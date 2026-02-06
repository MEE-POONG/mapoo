import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { customerName, phone, address } = await request.json();
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

        // 2. Calculate total
        const subtotal = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        const shipping = 40;
        const totalAmount = subtotal + shipping;

        // 3. Create Order in a transaction
        const order = await prisma.$transaction(async (tx) => {
            // Create the order
            const newOrder = await tx.order.create({
                data: {
                    customerName,
                    phone,
                    address,
                    totalAmount,
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
