import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, format, eachDayOfInterval, eachMonthOfInterval, isSameDay, isSameMonth } from 'date-fns';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || 'day'; // day, month, year
        const dateStr = searchParams.get('date');

        const targetDate = dateStr ? new Date(dateStr) : new Date();

        let startDate, endDate;

        if (period === 'day') {
            startDate = startOfDay(targetDate);
            endDate = endOfDay(targetDate);
        } else if (period === 'month') {
            startDate = startOfMonth(targetDate);
            endDate = endOfMonth(targetDate);
        } else {
            startDate = startOfYear(targetDate);
            endDate = endOfYear(targetDate);
        }

        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate
                },
                status: {
                    not: 'CANCELLED'
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Summary Stats
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        const totalOrders = orders.length;
        let totalCost = 0;

        orders.forEach(order => {
            order.items.forEach(item => {
                totalCost += (item.product.costPrice || 0) * item.quantity;
            });
        });

        const totalProfit = totalRevenue - totalCost;

        // Chart Data
        let chartData = [];
        if (period === 'day') {
            // Should probably show hourly, but for simplicity let's stick to the day for now or just the single point
            chartData = [{
                label: format(targetDate, 'dd/MM/yyyy'),
                revenue: totalRevenue,
                orders: totalOrders
            }];
        } else if (period === 'month') {
            const days = eachDayOfInterval({ start: startDate, end: endDate });
            chartData = days.map(day => {
                const dayOrders = orders.filter(o => isSameDay(new Date(o.createdAt), day));
                return {
                    label: format(day, 'dd/MM'),
                    revenue: dayOrders.reduce((acc, o) => acc + o.totalAmount, 0),
                    orders: dayOrders.length
                };
            });
        } else {
            const months = eachMonthOfInterval({ start: startDate, end: endDate });
            chartData = months.map(month => {
                const monthOrders = orders.filter(o => isSameMonth(new Date(o.createdAt), month));
                return {
                    label: format(month, 'MMM'),
                    revenue: monthOrders.reduce((acc, o) => acc + o.totalAmount, 0),
                    orders: monthOrders.length
                };
            });
        }

        return NextResponse.json({
            summary: {
                totalRevenue,
                totalOrders,
                totalProfit,
                avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
            },
            chartData,
            orders: orders.map(o => ({
                id: o.id,
                customerName: o.customerName,
                totalAmount: o.totalAmount,
                discountCode: o.discountCode,
                discountAmount: o.discountAmount,
                createdAt: o.createdAt,
                status: o.status
            }))
        });
    } catch (error) {
        console.error('Error fetching sales report:', error);
        return NextResponse.json({ error: 'Error fetching sales report' }, { status: 500 });
    }
}
