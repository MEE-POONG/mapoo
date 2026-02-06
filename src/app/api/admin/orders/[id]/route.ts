import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const order = await prisma.order.update({
            where: { id: params.id },
            data: { status },
        });

        return NextResponse.json(order);
    } catch (error: any) {
        console.error('Error updating order status:', error);
        return NextResponse.json({
            error: 'Error updating order status',
            details: error.message
        }, { status: 500 });
    }
}
