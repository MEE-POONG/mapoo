import { NextResponse } from 'next/server';
import { verifyAdminToken, getAdminTokenFromHeaders } from '@/lib/adminAuth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = getAdminTokenFromHeaders(authHeader);

        if (!token || !verifyAdminToken(token)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'กรุณาเลือกไฟล์รูปภาพ' }, { status: 400 });
        }

        // Validate Size (Max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'ขนาดไฟล์ต้องไม่เกิน 5MB' }, { status: 400 });
        }

        // Validate Type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'กรุณาอัปโหลดเฉพาะไฟล์รูปภาพ (JPG, PNG, WEBP)' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define path
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');

        // Create directory
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) { }

        const fileName = `prod_${Date.now()}${path.extname(file.name)}`;
        const filePath = path.join(uploadDir, fileName);

        await writeFile(filePath, buffer);

        const fileUrl = `/uploads/products/${fileName}`;
        return NextResponse.json({ url: fileUrl });

    } catch (error) {
        console.error('Upload product image error:', error);
        return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการอัปโหลด' }, { status: 500 });
    }
}
