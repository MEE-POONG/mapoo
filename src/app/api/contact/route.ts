import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, subject, message } = body;

        // Validate required fields
        if (!name || !name.trim()) {
            return NextResponse.json({ error: 'กรุณากรอกชื่อ' }, { status: 400 });
        }

        if (!phone || !phone.trim()) {
            return NextResponse.json({ error: 'กรุณากรอกเบอร์โทรศัพท์' }, { status: 400 });
        }

        if (!subject || !subject.trim()) {
            return NextResponse.json({ error: 'กรุณาเลือกหัวข้อ' }, { status: 400 });
        }

        if (!message || !message.trim()) {
            return NextResponse.json({ error: 'กรุณากรอกข้อความ' }, { status: 400 });
        }

        // Sanitize - trim whitespace
        const contact = await prisma.contactMessage.create({
            data: {
                name: name.trim(),
                phone: phone.trim(),
                subject: subject.trim(),
                message: message.trim(),
            },
        });

        return NextResponse.json(contact);
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Error sending message' }, { status: 500 });
    }
}
