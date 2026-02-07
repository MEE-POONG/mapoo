import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Reset admin password - for fixing plain text passwords
export async function POST(request: Request) {
    try {
        const { email, newPassword, setupKey } = await request.json();

        // Simple setup key protection
        const SETUP_KEY = process.env.ADMIN_SETUP_KEY || 'siamsausage-setup-2024';

        if (setupKey !== SETUP_KEY) {
            return NextResponse.json(
                { error: 'Invalid setup key' },
                { status: 403 }
            );
        }

        if (!email || !newPassword) {
            return NextResponse.json(
                { error: 'กรุณากรอก email และ password ใหม่' },
                { status: 400 }
            );
        }

        // Find admin
        const admin = await prisma.admin.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!admin) {
            return NextResponse.json(
                { error: 'ไม่พบ Admin นี้ในระบบ' },
                { status: 404 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update admin password
        await prisma.admin.update({
            where: { email: email.toLowerCase() },
            data: { password: hashedPassword }
        });

        return NextResponse.json({
            success: true,
            message: 'Password reset successfully',
            email: admin.email
        });

    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในระบบ' },
            { status: 500 }
        );
    }
}
