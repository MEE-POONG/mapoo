import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    // Check if data exists - standalone Mongo doesn't support transactions used in deleteMany
    // So we just check count and skip if data already exists
    const productCount = await prisma.product.count()

    if (productCount > 0) {
        console.log('Data already exists, skipping seed')
        return
    }

    // Seed Products
    const products = [
        {
            name: 'ไส้กรอกอีสาน (สูตรหมูล้วน)',
            description: 'เนื้อแดงคัดพิเศษ 90% มันน้อย ไม่เลี่ยน เหมาะสำหรับกลุ่มลูกค้าสายสุขภาพ',
            price: 120,
            unit: '50 ลูก / 1 กิโลกรัม',
            imageUrl: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&q=80&w=800',
            category: 'ไส้กรอกอีสาน',
            tags: ['ขายดี', 'แนะนำ'],
            isFeatured: true,
        },
        {
            name: 'ไส้กรอกอีสาน (สูตรต้นตำรับ)',
            description: 'รสชาติกลมกล่อม เปรี้ยวกำลังดี ขายง่ายที่สุด นิยมมากในตลาดนัด',
            price: 95,
            unit: '50 ลูก / 1 กิโลกรัม',
            imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=800',
            category: 'ไส้กรอกอีสาน',
            tags: ['สูตรดั้งเดิม'],
            isFeatured: true,
        },
        {
            name: 'หมูแดดเดียว (สูตรพริกไทยดำ)',
            description: 'หอมเครื่องเทศ ตากแดดธรรมชาติ 100% ทอดแล้วสีสวย ไม่ดำ',
            price: 150,
            unit: 'แพ็ค 500 กรัม',
            imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=800',
            category: 'หมูแดดเดียว',
            tags: ['ใหม่'],
            isFeatured: true,
        },
        {
            name: 'แหนมเนือง (ชุดเล็ก)',
            description: 'พร้อมน้ำจิ้มสูตรเด็ด ผักสดยกสวน แป้งเหนียวนุ่ม',
            price: 180,
            unit: '1 ชุด (ทานได้ 2-3 คน)',
            imageUrl: 'https://images.unsplash.com/photo-1596796408226-5b487d605503?auto=format&fit=crop&q=80&w=800',
            category: 'แหนมเนือง',
            tags: [],
            isFeatured: false,
        },
    ]

    for (const p of products) {
        await prisma.product.create({ data: p })
    }

    // Seed Wholesale Rates
    const rates = [
        { minQuantity: 5, pricePerKg: 140, costPerUnit: 2.80, discountLabel: null, isPopular: false },
        { minQuantity: 10, pricePerKg: 120, costPerUnit: 2.40, discountLabel: 'ลด ฿20/กก.', isPopular: true },
        { minQuantity: 50, pricePerKg: 100, costPerUnit: 2.00, discountLabel: 'ลด ฿40/กก.', isPopular: false },
        { minQuantity: 100, pricePerKg: 90, costPerUnit: 1.80, discountLabel: 'ลด ฿50/กก.', isPopular: false },
    ]

    for (const r of rates) {
        await prisma.wholesaleRate.create({ data: r })
    }

    console.log('Seed data created')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
