import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = getTokenFromHeaders(authHeader);

        if (!token) {
            return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Token ไม่ถูกต้อง' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'กรุณาเลือกไฟล์หลักฐานการโอนเงิน' }, { status: 400 });
        }

        const orderId = params.id;
        const order = await prisma.order.findUnique({ where: { id: orderId } });

        if (!order || order.customerId !== payload.customerId) {
            return NextResponse.json({ error: 'ไม่พบออเดอร์หรือคุณไม่มีสิทธิ์เข้าถึง' }, { status: 403 });
        }

        // Convert file to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define path
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'slips');

        // Create directory if not exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Directory exists
        }

        const fileName = `${orderId}_${Date.now()}${path.extname(file.name)}`;
        const filePath = path.join(uploadDir, fileName);

        // Write file
        await writeFile(filePath, buffer);

        const fileUrl = `/uploads/slips/${fileName}`;

        // Update Order
        await prisma.order.update({
            where: { id: orderId },
            data: {
                slipImageUrl: fileUrl,
                status: 'PENDING' // Keep as pending or change to 'AWAITING_VERIFICATION' if you add that status
            }
        });

        return NextResponse.json({ message: 'อัปโหลดหลักฐานเรียบร้อยแล้ว', url: fileUrl });

    } catch (error) {
        console.error('Upload slip error:', error);
        return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการอัปโหลด' }, { status: 500 });
    }
}
