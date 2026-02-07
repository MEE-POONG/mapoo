import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DELETE admin
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Check if admin exists
        const admin = await prisma.admin.findUnique({
            where: { id }
        });

        if (!admin) {
            return NextResponse.json(
                { error: 'ไม่พบ Admin นี้' },
                { status: 404 }
            );
        }

        // Delete admin
        await prisma.admin.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error deleting admin:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาด' },
            { status: 500 }
        );
    }
}

// PATCH update admin (toggle active status)
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const { isActive, role } = await request.json();

        const updateData: any = {};
        if (typeof isActive === 'boolean') updateData.isActive = isActive;
        if (role) updateData.role = role;

        const admin = await prisma.admin.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true
            }
        });

        return NextResponse.json({ admin });

    } catch (error) {
        console.error('Error updating admin:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาด' },
            { status: 500 }
        );
    }
}
