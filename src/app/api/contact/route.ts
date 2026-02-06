import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, subject, message } = body;

        const contact = await prisma.contactMessage.create({
            data: {
                name,
                phone,
                subject,
                message,
            },
        });

        return NextResponse.json(contact);
    } catch (error) {
        return NextResponse.json({ error: 'Error sending message' }, { status: 500 });
    }
}
