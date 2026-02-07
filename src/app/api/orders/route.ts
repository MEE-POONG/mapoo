import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { customerName, phone, address, discountCode } = await request.json();
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('cart_session_id')?.value;

        if (!sessionId) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 400 });
        }

        // 1. Get cart items
        const cart = await prisma.cart.findUnique({
            where: { sessionId },
            include: { items: { include: { product: true } } }
        });

        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        // 2. Calculate initial total
        const subtotal = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
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

        // 4. Create Order in a transaction
        const order = await prisma.$transaction(async (tx) => {
            // Increment discount count
            if (discountCode && discountAmount > 0) {
                await tx.discount.update({
                    where: { code: discountCode.toUpperCase() },
                    data: { usedCount: { increment: 1 } }
                });
            }

            // Create the order
            const newOrder = await tx.order.create({
                data: {
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
                            price: item.product.price
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
