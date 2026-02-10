import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken, getAdminTokenFromHeaders } from '@/lib/adminAuth';

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

        await prisma.review.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json({ error: 'Error deleting review' }, { status: 500 });
    }
}
