import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = getTokenFromHeaders(authHeader);

        if (!token) {
            return NextResponse.json(
                { error: 'กรุณาเข้าสู่ระบบ' },
                { status: 401 }
            );
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json(
                { error: 'Token ไม่ถูกต้อง' },
                { status: 401 }
            );
        }

        const orderId = params.id;

        // Find order and verify ownership
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        });

        if (!order) {
            return NextResponse.json(
                { error: 'ไม่พบออเดอร์' },
                { status: 404 }
            );
        }

        if (order.customerId !== payload.customerId) {
            return NextResponse.json(
                { error: 'คุณไม่มีสิทธิ์ยกเลิกออเดอร์นี้' },
                { status: 403 }
            );
        }

        if (order.status !== 'PENDING') {
            return NextResponse.json(
                { error: 'ไม่สามารถยกเลิกออเดอร์ที่ดำเนินการไปแล้วได้' },
                { status: 400 }
            );
        }

        // Return stock and cancel order
        await prisma.$transaction(async (tx) => {
            // Update items stock
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { increment: item.quantity }
                    }
                });
            }

            // Update order status
            await tx.order.update({
                where: { id: orderId },
                data: { status: 'CANCELLED' }
            });
        });

        return NextResponse.json({ message: 'ยกเลิกออเดอร์เรียบร้อยแล้ว' });

    } catch (error) {
        console.error('Cancel order error:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการยกเลิกออเดอร์' },
            { status: 500 }
        );
    }
}
