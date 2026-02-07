import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken, getAdminTokenFromHeaders } from '@/lib/adminAuth';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = getAdminTokenFromHeaders(authHeader);

        if (!token) {
            return NextResponse.json(
                { error: 'กรุณาเข้าสู่ระบบ' },
                { status: 401 }
            );
        }

        const payload = verifyAdminToken(token);

        if (!payload) {
            return NextResponse.json(
                { error: 'Token ไม่ถูกต้องหรือหมดอายุ' },
                { status: 401 }
            );
        }

        // Get admin from database
        const admin = await prisma.admin.findUnique({
            where: { id: payload.adminId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true
            }
        });

        if (!admin || !admin.isActive) {
            return NextResponse.json(
                { error: 'บัญชีไม่พบหรือถูกระงับ' },
                { status: 401 }
            );
        }

        return NextResponse.json({ admin });

    } catch (error) {
        console.error('Admin verify error:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในระบบ' },
            { status: 500 }
        );
    }
}
