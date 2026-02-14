import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken, getAdminTokenFromHeaders } from '@/lib/adminAuth';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = getAdminTokenFromHeaders(authHeader);
        if (!token || !verifyAdminToken(token)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const orderId = params.id;

        // ดำเนินการใน Transaction
        const updatedOrder = await prisma.$transaction(async (tx) => {
            // 1. ดึงข้อมูลออเดอร์ปัจจุบันและสินค้าในออเดอร์
            const currentOrder = await tx.order.findUnique({
                where: { id: orderId },
                include: { items: true }
            });

            if (!currentOrder) {
                throw new Error('Order not found');
            }

            // 2. ถ้าเปลี่ยนสถานะเป็น CANCELLED และสถานะเดิมไม่ใช่ CANCELLED
            // ให้ทำการคืนสต๊อกสินค้า
            if (status === 'CANCELLED' && currentOrder.status !== 'CANCELLED') {
                for (const item of currentOrder.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: { increment: item.quantity }
                        }
                    });
                }
            }

            // 3. ถ้าเปลี่ยนสถานะจาก CANCELLED กลับมาเป็นสถานะอื่น (เผื่อแอดมินแก้ผิด)
            // ให้ไปตัดสต๊อกอีกรอบ (ถ้าต้องการป้องกันความผิดพลาด)
            // แต่เบื้องต้นทำส่วน "คืนสต๊อกเมื่อยกเลิก" ตามที่คุยกันก่อนครับ

            // 4. อัปเดตสถานะออเดอร์
            return await tx.order.update({
                where: { id: orderId },
                data: { status },
            });
        });

        return NextResponse.json(updatedOrder);
    } catch (error: any) {
        console.error('Error updating order status:', error);
        return NextResponse.json({
            error: error.message === 'Order not found' ? 'Order not found' : 'Error updating order status',
            details: error.message
        }, { status: error.message === 'Order not found' ? 404 : 500 });
    }
}
