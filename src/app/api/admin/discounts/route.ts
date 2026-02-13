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

        const discounts = await prisma.discount.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(discounts);
    } catch (error) {
        console.error('Error fetching discounts:', error);
        return NextResponse.json({ error: 'Failed to fetch discounts' }, { status: 500 });
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
        const { code, description, discountValue, type, isActive, usageLimit, startDate, endDate } = body;

        if (!code || discountValue === undefined) {
            return NextResponse.json({ error: 'Code and discount value are required' }, { status: 400 });
        }

        const discount = await prisma.discount.create({
            data: {
                code: code.toUpperCase(),
                description,
                discountValue: parseFloat(discountValue),
                type: type || 'PERCENTAGE',
                isActive: isActive !== undefined ? isActive : true,
                usageLimit: usageLimit ? parseInt(usageLimit) : null,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
            }
        });

        return NextResponse.json(discount);
    } catch (error: any) {
        console.error('Error creating discount:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Discount code already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create discount' }, { status: 500 });
    }
}
