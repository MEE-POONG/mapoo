import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { code, subtotal, phone } = await request.json();

        if (!code) {
            return NextResponse.json({ error: 'โค้ดส่วนลดต้องไม่ว่างเปล่า' }, { status: 400 });
        }

        const discount = await prisma.discount.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!discount) {
            return NextResponse.json({ error: 'ไม่พบโค้ดส่วนลดนี้' }, { status: 404 });
        }

        if (!discount.isActive) {
            return NextResponse.json({ error: 'โค้ดส่วนลดนี้ถูกปิดใช้งานแล้ว' }, { status: 400 });
        }

        // Check minimum purchase
        if (discount.minPurchaseAmount && subtotal < discount.minPurchaseAmount) {
            return NextResponse.json({
                error: `ยอดซื้อขั้นต่ำต้องเป็น ฿${discount.minPurchaseAmount.toLocaleString()} (ขณะนี้ ฿${subtotal.toLocaleString()})`
            }, { status: 400 });
        }

        // Check global usage limit
        if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
            return NextResponse.json({ error: 'โค้ดส่วนลดนี้ถูกใช้งานครบตามจำนวนจำกัดรวมแล้ว' }, { status: 400 });
        }

        // Check per-user usage limit
        if (discount.userUsageLimit && phone) {
            const userUsageCount = await prisma.order.count({
                where: {
                    phone,
                    discountCode: code.toUpperCase(),
                    status: { not: 'CANCELLED' }
                }
            });

            if (userUsageCount >= discount.userUsageLimit) {
                return NextResponse.json({ error: `คุณใช้โค้ดส่วนลดนี้ครบจำกัด ${discount.userUsageLimit} ครั้งแล้ว` }, { status: 400 });
            }
        }

        // Check dates
        const now = new Date();
        if (discount.startDate && new Date(discount.startDate) > now) {
            return NextResponse.json({ error: 'ยังไม่ถึงเวลาใช้งานโค้ดส่วนลดนี้' }, { status: 400 });
        }
        if (discount.endDate && new Date(discount.endDate) < now) {
            return NextResponse.json({ error: 'โค้ดส่วนลดนี้หมดอายุแล้ว' }, { status: 400 });
        }

        return NextResponse.json({
            id: discount.id,
            code: discount.code,
            type: discount.type,
            discountValue: discount.discountValue,
            description: discount.description,
            minPurchaseAmount: discount.minPurchaseAmount,
            userUsageLimit: discount.userUsageLimit
        });
    } catch (error) {
        console.error('Error validating discount:', error);
        return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการตรวจสอบโค้ด' }, { status: 500 });
    }
}
