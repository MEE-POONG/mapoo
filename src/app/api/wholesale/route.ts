import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const rates = await prisma.wholesaleRate.findMany({
            orderBy: {
                minQuantity: 'asc',
            },
        });
        return NextResponse.json(rates);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching rates' }, { status: 500 });
    }
}
