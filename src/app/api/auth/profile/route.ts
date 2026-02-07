import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = getTokenFromHeaders(authHeader);

        if (!token) {
            return NextResponse.json(
                { error: 'ไม่พบ token กรุณาเข้าสู่ระบบ' },
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

        // Get customer data
        const customer = await prisma.customer.findUnique({
            where: { id: payload.customerId },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                address: true,
                createdAt: true
            }
        });

        if (!customer) {
            return NextResponse.json(
                { error: 'ไม่พบข้อมูลลูกค้า' },
                { status: 404 }
            );
        }

        return NextResponse.json({ customer });

    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาด' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = getTokenFromHeaders(authHeader);

        if (!token) {
            return NextResponse.json(
                { error: 'ไม่พบ token กรุณาเข้าสู่ระบบ' },
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

        const body = await request.json();
        const { name, phone, address } = body;

        // Update customer
        const customer = await prisma.customer.update({
            where: { id: payload.customerId },
            data: {
                name: name || undefined,
                phone: phone || undefined,
                address: address || undefined
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                address: true
            }
        });

        return NextResponse.json({
            message: 'อัพเดทข้อมูลสำเร็จ',
            customer
        });

    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการอัพเดท' },
            { status: 500 }
        );
    }
}
