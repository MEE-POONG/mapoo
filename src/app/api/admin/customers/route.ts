import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken, getAdminTokenFromHeaders } from '@/lib/adminAuth';

// GET all customers
export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = getAdminTokenFromHeaders(authHeader);
        if (!token || !verifyAdminToken(token)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const customers = await prisma.customer.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                address: true,
                isVerified: true,
                createdAt: true,
                _count: {
                    select: { orders: true }
                },
                orders: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    select: {
                        id: true,
                        totalAmount: true,
                        status: true,
                        createdAt: true
                    }
                }
            }
        });

        // Calculate total spent for each customer
        const customersWithStats = await Promise.all(
            customers.map(async (customer) => {
                const totalSpent = await prisma.order.aggregate({
                    where: { customerId: customer.id },
                    _sum: { totalAmount: true }
                });

                return {
                    ...customer,
                    totalOrders: customer._count.orders,
                    totalSpent: totalSpent._sum?.totalAmount || 0,
                    recentOrders: customer.orders
                };
            })
        );

        return NextResponse.json({ customers: customersWithStats });

    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาด' },
            { status: 500 }
        );
    }
}
