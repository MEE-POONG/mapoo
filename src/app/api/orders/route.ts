import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { customerName, phone, address, discountCode } = await request.json();

        // Simple Phone Validation (Thailand 10 digits)
        if (!phone || !phone.match(/^[0-9]{10}$/)) {
            return NextResponse.json({ error: 'เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข 10 หลัก)' }, { status: 400 });
        }

        const cookieStore = await cookies();
        const sessionId = cookieStore.get('cart_session_id')?.value;

        if (!sessionId) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 400 });
        }

        // Force member login (No Guest Checkout)
        const authHeader = request.headers.get('authorization');
        const token = getTokenFromHeaders(authHeader);
        let customerId: string | null = null;

        if (token) {
            const payload = verifyToken(token);
            if (payload) {
                customerId = payload.customerId;
            } else {
                return NextResponse.json({ error: 'Session Expired. Please login again.' }, { status: 401 });
            }
        }

        if (!customerId) {
            return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนสั่งซื้อ' }, { status: 401 });
        }

        // 1. Get cart items and wholesale rates
        const [cart, wholesaleRates] = await Promise.all([
            prisma.cart.findUnique({
                where: { sessionId },
                include: { items: { include: { product: true } } }
            }),
            prisma.wholesaleRate.findMany({
                orderBy: { minQuantity: 'desc' }
            })
        ]);

        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        // 2. Calculate wholesale pricing
        const wholesaleItemsCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        const applicableRate = wholesaleRates.find(rate => wholesaleItemsCount >= rate.minQuantity);

        // 2. Calculate initial total
        const subtotal = cart.items.reduce((acc, item) => {
            const price = applicableRate ? applicableRate.pricePerKg : item.product.price;
            return acc + (price * item.quantity);
        }, 0);

        let shipping = 40;
        let discountAmount = 0;

        // 3. Validate and apply discount code if present
        if (discountCode) {
            const discount = await prisma.discount.findUnique({
                where: { code: discountCode.toUpperCase(), isActive: true }
            });

            if (discount) {
                // Verify usage limit, dates, minimum purchase, and per-user limit
                const now = new Date();
                const isWithinDates = (!discount.startDate || new Date(discount.startDate) <= now) &&
                    (!discount.endDate || new Date(discount.endDate) >= now);
                const hasUsageRemaining = !discount.usageLimit || discount.usedCount < discount.usageLimit;
                const isMinPurchaseMet = !discount.minPurchaseAmount || subtotal >= discount.minPurchaseAmount;

                let isUserLimitMet = true;
                if (discount.userUsageLimit && phone) {
                    const userUsageCount = await prisma.order.count({
                        where: {
                            phone,
                            discountCode: discountCode.toUpperCase(),
                            status: { not: 'CANCELLED' }
                        }
                    });
                    isUserLimitMet = userUsageCount < discount.userUsageLimit;
                }

                if (isWithinDates && hasUsageRemaining && isMinPurchaseMet && isUserLimitMet) {
                    if (discount.type === 'PERCENTAGE') {
                        discountAmount = (subtotal * discount.discountValue) / 100;
                    } else {
                        discountAmount = discount.discountValue;
                    }
                    // Ensure discount doesn't exceed subtotal
                    discountAmount = Math.min(discountAmount, subtotal);
                }
            }
        }

        const totalAmount = subtotal + shipping - discountAmount;

        // 4. Check stock availability
        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                return NextResponse.json({
                    error: `สินค้า "${item.product.name}" มีสต๊อกไม่เพียงพอ (เหลือ ${item.product.stock} ${item.product.unit})`
                }, { status: 400 });
            }
        }

        // 5. Create Order in a transaction
        const order = await prisma.$transaction(async (tx) => {
            // Increment discount count
            if (discountCode && discountAmount > 0) {
                await tx.discount.update({
                    where: { code: discountCode.toUpperCase() },
                    data: { usedCount: { increment: 1 } }
                });
            }

            // Decrement stock for each product
            for (const item of cart.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            // Create the order with customerId if logged in
            const newOrder = await tx.order.create({
                data: {
                    customerId: customerId,
                    customerName,
                    phone,
                    address,
                    totalAmount,
                    discountCode: discountAmount > 0 ? discountCode.toUpperCase() : null,
                    discountAmount,
                    status: 'PENDING',
                    items: {
                        create: cart.items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: applicableRate ? applicableRate.pricePerKg : item.product.price
                        }))
                    }
                }
            });

            // Clear the cart items
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id }
            });

            return newOrder;
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
    }
}
