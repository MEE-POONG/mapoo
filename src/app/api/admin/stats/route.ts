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

        // Optimizing: Use date boundaries for today's orders
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // Fetch today's orders separately for the list (more efficient than filtering all orders)
        const [orders, todayOrdersList] = await Promise.all([
            prisma.order.findMany({
                where: { status: { not: 'CANCELLED' } },
                select: {
                    totalAmount: true,
                    status: true,
                    items: {
                        select: {
                            quantity: true,
                            price: true,
                            productId: true,
                            product: {
                                select: {
                                    name: true,
                                    costPrice: true
                                }
                            }
                        }
                    }
                }
            }),
            prisma.order.findMany({
                where: {
                    createdAt: {
                        gte: startOfToday,
                        lte: endOfToday
                    }
                },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    imageUrl: true
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })
        ]);

        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        const totalOrders = orders.length;

        // Calculate profit efficiently
        let totalProfit = 0;
        const productStats: Record<string, { name: string, quantity: number, revenue: number }> = {};

        orders.forEach(order => {
            let orderCost = 0;
            order.items.forEach(item => {
                const cost = item.product.costPrice || 0;
                orderCost += cost * item.quantity;

                // Group product stats while we are at it
                if (!productStats[item.productId]) {
                    productStats[item.productId] = { name: item.product.name, quantity: 0, revenue: 0 };
                }
                productStats[item.productId].quantity += item.quantity;
                productStats[item.productId].revenue += item.price * item.quantity;
            });
            totalProfit += (order.totalAmount - orderCost);
        });

        const topProducts = Object.values(productStats)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        const todayOrdersCount = todayOrdersList.length;

        return NextResponse.json({
            totalRevenue,
            totalOrders,
            totalProfit,
            topProducts,
            todayOrdersCount,
            todayOrders: todayOrdersList
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json({ error: 'Error fetching stats' }, { status: 500 });
    }
}
