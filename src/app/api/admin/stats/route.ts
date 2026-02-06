import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        const totalRevenue = orders
            .filter(order => order.status !== 'CANCELLED')
            .reduce((acc, order) => acc + order.totalAmount, 0);

        const totalOrders = orders.length;

        // Calculate profit (only for non-cancelled orders)
        let totalProfit = 0;
        orders.filter(order => order.status !== 'CANCELLED').forEach(order => {
            let orderCost = 0;
            order.items.forEach(item => {
                const cost = item.product.costPrice || 0;
                orderCost += cost * item.quantity;
            });
            totalProfit += (order.totalAmount - orderCost);
        });

        // Top selling products (only from non-cancelled orders)
        const productStats: Record<string, { name: string, quantity: number, revenue: number }> = {};
        orders.filter(order => order.status !== 'CANCELLED').forEach(order => {
            order.items.forEach(item => {
                if (!productStats[item.productId]) {
                    productStats[item.productId] = { name: item.product.name, quantity: 0, revenue: 0 };
                }
                productStats[item.productId].quantity += item.quantity;
                productStats[item.productId].revenue += item.price * item.quantity;
            });
        });

        const topProducts = Object.values(productStats)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        // Get today's orders
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayOrdersList = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            orderDate.setHours(0, 0, 0, 0);
            return orderDate.getTime() === today.getTime();
        }).reverse();

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
