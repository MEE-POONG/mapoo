import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, phone, newPassword } = await request.json();

        if (!email || !phone || !newPassword) {
            return NextResponse.json(
                { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' },
                { status: 400 }
            );
        }

        // Find customer by email AND phone for verification
        const customer = await prisma.customer.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!customer) {
            return NextResponse.json(
                { error: 'ไม่พบบัญชีผู้ใช้นี้' },
                { status: 404 }
            );
        }

        // Verify phone number matches
        if (customer.phone !== phone.trim()) {
            return NextResponse.json(
                { error: 'เบอร์โทรศัพท์ไม่ตรงกับบัญชี' },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.customer.update({
            where: { id: customer.id },
            data: { password: hashedPassword }
        });

        return NextResponse.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' },
            { status: 500 }
        );
    }
}
