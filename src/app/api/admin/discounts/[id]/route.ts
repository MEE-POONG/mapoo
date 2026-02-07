import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { id } = params;

        const updateData: any = {};
        if (body.code !== undefined) updateData.code = body.code.toUpperCase();
        if (body.description !== undefined) updateData.description = body.description;
        if (body.discountValue !== undefined) updateData.discountValue = parseFloat(body.discountValue);
        if (body.type !== undefined) updateData.type = body.type;
        if (body.isActive !== undefined) updateData.isActive = body.isActive;
        if (body.usageLimit !== undefined) updateData.usageLimit = body.usageLimit ? parseInt(body.usageLimit) : null;
        if (body.startDate !== undefined) updateData.startDate = body.startDate ? new Date(body.startDate) : null;
        if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null;

        const discount = await prisma.discount.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(discount);
    } catch (error: any) {
        console.error('Error updating discount:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Discount code already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update discount' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        await prisma.discount.delete({
            where: { id }
        });
        return NextResponse.json({ message: 'Discount deleted successfully' });
    } catch (error) {
        console.error('Error deleting discount:', error);
        return NextResponse.json({ error: 'Failed to delete discount' }, { status: 500 });
    }
}
