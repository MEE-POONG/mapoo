import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = getTokenFromHeaders(authHeader);

        if (!token) {
            return NextResponse.json(
                { error: 'กรุณาเข้าสู่ระบบเพื่อดูคำสั่งซื้อ' },
                { status: 401 }
            );
        }

        const payload = verifyToken(token);

        if (!payload) {
            return NextResponse.json(
                { error: 'token ไม่ถูกต้องหรือหมดอายุ' },
                { status: 401 }
            );
        }

        // Get customer orders with items
        const orders = await prisma.order.findMany({
            where: { customerId: payload.customerId },
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

        return NextResponse.json({ orders });

    } catch (error) {
        console.error('Get orders error:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ' },
            { status: 500 }
        );
    }
}
