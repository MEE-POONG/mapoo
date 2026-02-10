import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

async function getOrCreateCartId() {
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('cart_session_id')?.value;

    if (!sessionId) {
        sessionId = crypto.randomUUID();
    }

    let cart = await prisma.cart.findUnique({
        where: { sessionId },
        include: { items: { include: { product: true } } }
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: { sessionId },
            include: { items: { include: { product: true } } }
        });
    }

    return { cart, sessionId };
}

export async function GET() {
    try {
        const { cart, sessionId } = await getOrCreateCartId();
        const response = NextResponse.json(cart);
        response.cookies.set('cart_session_id', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });
        return response;
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json({ error: 'Error fetching cart' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { productId, quantity = 1 } = await request.json();
        const { cart, sessionId } = await getOrCreateCartId();

        // Check if item already exists
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId
                }
            },
            include: { product: true }
        });

        // Get product to check stock
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

        if (product.stock < newQuantity) {
            return NextResponse.json({
                error: `ขออภัย สินค้ามีสต๊อกไม่เพียงพอ (คงเหลือ ${product.stock} ${product.unit})`,
                currentStock: product.stock
            }, { status: 400 });
        }

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity }
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity
                }
            });
        }

        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: { items: { include: { product: true } } }
        });

        const response = NextResponse.json(updatedCart);
        response.cookies.set('cart_session_id', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7
        });
        return response;
    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json({ error: 'Error adding to cart' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { productId, quantity } = await request.json();
        const { cart } = await getOrCreateCartId();

        if (quantity <= 0) {
            await prisma.cartItem.delete({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId
                    }
                }
            });
        } else {
            // Check stock before updating
            const product = await prisma.product.findUnique({ where: { id: productId } });
            if (!product) {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 });
            }

            if (product.stock < quantity) {
                return NextResponse.json({
                    error: `สินค้าคงเหลือเพียง ${product.stock} ${product.unit}`,
                    currentStock: product.stock
                }, { status: 400 });
            }

            await prisma.cartItem.update({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId
                    }
                },
                data: { quantity }
            });
        }

        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: { items: { include: { product: true } } }
        });

        return NextResponse.json(updatedCart);
    } catch (error) {
        console.error('Error updating cart:', error);
        return NextResponse.json({ error: 'Error updating cart' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');
        const { cart } = await getOrCreateCartId();

        if (productId) {
            await prisma.cartItem.delete({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId
                    }
                }
            });
        } else {
            // Clear entire cart
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            });
        }

        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: { items: { include: { product: true } } }
        });

        return NextResponse.json(updatedCart);
    } catch (error) {
        console.error('Error clearing cart:', error);
        return NextResponse.json({ error: 'Error clearing cart' }, { status: 500 });
    }
}
