import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const featured = searchParams.get('featured');

        const where: any = {};
        if (category && category !== 'All' && category !== 'ทั้งหมด') {
            // Just in case frontend sends 'ทั้งหมด'
            where.category = category;
        }
        if (featured === 'true') {
            where.isFeatured = true;
        }

        const products = await prisma.product.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const product = await prisma.product.create({
            data: body,
        });
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
    }
}
