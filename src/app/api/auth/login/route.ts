import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json(
                { error: 'กรุณากรอกอีเมลและรหัสผ่าน' },
                { status: 400 }
            );
        }

        // Find customer by email
        const customer = await prisma.customer.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!customer) {
            return NextResponse.json(
                { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, customer.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = signToken({
            customerId: customer.id,
            email: customer.email,
            name: customer.name
        });

        return NextResponse.json({
            message: 'เข้าสู่ระบบสำเร็จ',
            customer: {
                id: customer.id,
                email: customer.email,
                name: customer.name,
                phone: customer.phone,
                address: customer.address
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
            { status: 500 }
        );
    }
}
