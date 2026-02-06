import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const reviews = await prisma.review.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Error fetching reviews' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerName, rating, comment, imageUrl, source } = body;

        const review = await prisma.review.create({
            data: {
                customerName,
                rating: parseInt(rating),
                comment,
                imageUrl,
                source: source || 'Website'
            }
        });

        return NextResponse.json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json({ error: 'Error creating review' }, { status: 500 });
    }
}
