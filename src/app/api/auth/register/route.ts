import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name, phone } = body;

        // Validate required fields
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'กรุณากรอกอีเมล รหัสผ่าน และชื่อ' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'รูปแบบอีเมลไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        // Validate password length
        if (password.length < 6) {
            return NextResponse.json(
                { error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingCustomer = await prisma.customer.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existingCustomer) {
            return NextResponse.json(
                { error: 'อีเมลนี้ถูกใช้งานแล้ว' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create customer
        const customer = await prisma.customer.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                name,
                phone: phone || null
            }
        });

        // Generate JWT token
        const token = signToken({
            customerId: customer.id,
            email: customer.email,
            name: customer.name
        });

        return NextResponse.json({
            message: 'สมัครสมาชิกสำเร็จ',
            customer: {
                id: customer.id,
                email: customer.email,
                name: customer.name,
                phone: customer.phone
            },
            token
        }, { status: 201 });

    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' },
            { status: 500 }
        );
    }
}
