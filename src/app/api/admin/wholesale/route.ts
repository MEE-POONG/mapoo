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

        const rates = await prisma.wholesaleRate.findMany({
            orderBy: { minQuantity: 'asc' },
        });

        return NextResponse.json(rates);
    } catch (error) {
        console.error('Error fetching admin wholesale rates:', error);
        return NextResponse.json({ error: 'Error fetching rates' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = getAdminTokenFromHeaders(authHeader);
        if (!token || !verifyAdminToken(token)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { minQuantity, pricePerKg, costPerUnit, discountLabel, isPopular } = body;

        const rate = await prisma.wholesaleRate.create({
            data: {
                minQuantity: parseInt(minQuantity),
                pricePerKg: parseFloat(pricePerKg),
                costPerUnit: costPerUnit ? parseFloat(costPerUnit) : null,
                discountLabel: discountLabel || null,
                isPopular: Boolean(isPopular)
            }
        });

        return NextResponse.json(rate);
    } catch (error) {
        console.error('Error creating wholesale rate:', error);
        return NextResponse.json({ error: 'Error creating rate' }, { status: 500 });
    }
}
