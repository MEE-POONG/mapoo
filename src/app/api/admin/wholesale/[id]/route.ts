import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken, getAdminTokenFromHeaders } from '@/lib/adminAuth';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = getAdminTokenFromHeaders(authHeader);
        if (!token || !verifyAdminToken(token)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { minQuantity, pricePerKg, costPerUnit, discountLabel, isPopular } = body;

        const updateData: any = {};
        if (minQuantity !== undefined) updateData.minQuantity = parseInt(minQuantity);
        if (pricePerKg !== undefined) updateData.pricePerKg = parseFloat(pricePerKg);
        if (costPerUnit !== undefined) updateData.costPerUnit = costPerUnit ? parseFloat(costPerUnit) : null;
        if (discountLabel !== undefined) updateData.discountLabel = discountLabel;
        if (isPopular !== undefined) updateData.isPopular = Boolean(isPopular);

        const rate = await prisma.wholesaleRate.update({
            where: { id: params.id },
            data: updateData,
        });

        return NextResponse.json(rate);
    } catch (error) {
        console.error('Error updating wholesale rate:', error);
        return NextResponse.json({ error: 'Error updating rate' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = getAdminTokenFromHeaders(authHeader);
        if (!token || !verifyAdminToken(token)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.wholesaleRate.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting wholesale rate:', error);
        return NextResponse.json({ error: 'Error deleting rate' }, { status: 500 });
    }
}
