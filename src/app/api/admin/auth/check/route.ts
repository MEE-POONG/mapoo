import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Check if any admin exists in the system
export async function GET() {
    try {
        const adminCount = await prisma.admin.count();
        const admins = await prisma.admin.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        });

        return NextResponse.json({
            hasAdmin: adminCount > 0,
            count: adminCount,
            admins: admins.map(a => ({
                id: a.id,
                email: a.email,
                name: a.name,
                role: a.role,
                isActive: a.isActive,
                createdAt: a.createdAt
            }))
        });

    } catch (error) {
        console.error('Error checking admins:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการตรวจสอบ', details: String(error) },
            { status: 500 }
        );
    }
}
