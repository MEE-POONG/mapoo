import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { orderId, phone } = await request.json();

        if (!orderId || !phone) {
            return NextResponse.json(
                { error: 'กรุณากรอกหมายเลขออเดอร์และเบอร์โทรศัพท์' },
                { status: 400 }
            );
        }

        // Search by last 6 chars of order ID + phone number
        const orders = await prisma.order.findMany({
            where: {
                phone: phone.trim(),
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                imageUrl: true,
                                unit: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Filter by matching order ID (last 6 chars)
        const searchId = orderId.trim().toUpperCase().replace('#', '');
        const matchedOrder = orders.find(o =>
            o.id.slice(-6).toUpperCase() === searchId ||
            o.id.slice(-8).toUpperCase() === searchId ||
            o.id.toUpperCase().includes(searchId)
        );

        if (!matchedOrder) {
            return NextResponse.json(
                { error: 'ไม่พบออเดอร์ กรุณาตรวจสอบหมายเลขออเดอร์และเบอร์โทรศัพท์' },
                { status: 404 }
            );
        }

        return NextResponse.json({ order: matchedOrder });

    } catch (error) {
        console.error('Track order error:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาด' },
            { status: 500 }
        );
    }
}
