import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Check if any admin exists in the system (used for initial setup flow)
export async function GET() {
    try {
        const adminCount = await prisma.admin.count();

        // Only return whether an admin exists, NOT admin details
        return NextResponse.json({
            hasAdmin: adminCount > 0
        });

    } catch (error) {
        console.error('Error checking admins:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการตรวจสอบ' },
            { status: 500 }
        );
    }
}
