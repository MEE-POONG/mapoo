import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken, getAdminTokenFromHeaders } from '@/lib/adminAuth';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = getAdminTokenFromHeaders(authHeader);
        if (!token || !verifyAdminToken(token)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const reviews = await prisma.review.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching admin reviews:', error);
        return NextResponse.json({ error: 'Error fetching reviews' }, { status: 500 });
    }
}
