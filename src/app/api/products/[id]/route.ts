import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { name, description, price, unit, imageUrl, category, tags, isFeatured, stock, costPrice } = body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (unit !== undefined) updateData.unit = unit;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
        if (category !== undefined) updateData.category = category;
        if (tags !== undefined) updateData.tags = tags;
        if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
        if (stock !== undefined) updateData.stock = parseInt(stock) || 0;
        if (costPrice !== undefined) updateData.costPrice = parseFloat(costPrice) || 0;

        const product = await prisma.product.update({
            where: { id: params.id },
            data: updateData,
        });
        return NextResponse.json(product);
    } catch (error: any) {
        console.error('Error updating product:', error);
        return NextResponse.json({
            error: 'Error updating product',
            details: error.message
        }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.product.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Error deleting product' }, { status: 500 });
    }
}
