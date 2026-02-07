import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// This is a setup route to create the first admin
// Should be disabled in production after initial setup
export async function POST(request: Request) {
    try {
        const { email, password, name, setupKey } = await request.json();

        // Simple setup key protection (change this or remove after setup)
        const SETUP_KEY = process.env.ADMIN_SETUP_KEY || 'siamsausage-setup-2024';

        if (setupKey !== SETUP_KEY) {
            return NextResponse.json(
                { error: 'Invalid setup key' },
                { status: 403 }
            );
        }

        // Validate input
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'กรุณากรอกข้อมูลให้ครบ' },
                { status: 400 }
            );
        }

        // Check if admin already exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existingAdmin) {
            return NextResponse.json(
                { error: 'อีเมลนี้มีผู้ใช้งานแล้ว' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create admin
        const admin = await prisma.admin.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                name,
                role: 'SUPER_ADMIN',
                isActive: true
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Admin created successfully',
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role
            }
        });

    } catch (error) {
        console.error('Admin setup error:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในระบบ' },
            { status: 500 }
        );
    }
}
