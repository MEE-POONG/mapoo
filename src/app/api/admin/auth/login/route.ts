import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signAdminToken } from '@/lib/adminAuth';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'กรุณากรอกอีเมลและรหัสผ่าน' },
                { status: 400 }
            );
        }

        // Find admin by email
        const admin = await prisma.admin.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!admin) {
            return NextResponse.json(
                { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
                { status: 401 }
            );
        }

        // Check if admin is active
        if (!admin.isActive) {
            return NextResponse.json(
                { error: 'บัญชีนี้ถูกระงับการใช้งาน' },
                { status: 403 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = signAdminToken({
            adminId: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role
        });

        // Return admin data and token (exclude password)
        return NextResponse.json({
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role
            },
            token
        });

    } catch (error) {
        console.error('Admin login error:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในระบบ' },
            { status: 500 }
        );
    }
}
