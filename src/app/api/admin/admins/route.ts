import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET all admins
export async function GET() {
    try {
        const admins = await prisma.admin.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return NextResponse.json({ admins });

    } catch (error) {
        console.error('Error fetching admins:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาด' },
            { status: 500 }
        );
    }
}

// POST create new admin
export async function POST(request: Request) {
    try {
        const { email, password, name, role } = await request.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'กรุณากรอกข้อมูลให้ครบ' },
                { status: 400 }
            );
        }

        // Check if admin exists
        const existing = await prisma.admin.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existing) {
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
                role: role || 'ADMIN',
                isActive: true
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        });

        return NextResponse.json({ admin });

    } catch (error) {
        console.error('Error creating admin:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาด' },
            { status: 500 }
        );
    }
}
