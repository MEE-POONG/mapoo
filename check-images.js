// เช็ครูปภาพในระบบ - ดูว่า URL เป็นแบบ local หรือ Cloudflare
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function checkImages() {
    console.log('=== เช็ครูปภาพในระบบ ===\n');

    // 1. เช็ครูปสินค้า
    const products = await prisma.product.findMany({
        select: { id: true, name: true, imageUrl: true }
    });

    console.log(`📦 สินค้าทั้งหมด: ${products.length} รายการ`);
    let cfCount = 0;
    let localCount = 0;
    products.forEach(p => {
        const isCF = p.imageUrl?.includes('imagedelivery.net') || p.imageUrl?.includes('cloudflare');
        if (isCF) cfCount++;
        else localCount++;
        const icon = isCF ? '☁️ ' : '💾';
        console.log(`  ${icon} ${p.name}: ${p.imageUrl?.substring(0, 80)}...`);
    });
    console.log(`  ☁️  Cloudflare: ${cfCount} | 💾 Local/อื่นๆ: ${localCount}\n`);

    // 2. เช็ค slip
    const orders = await prisma.order.findMany({
        where: { slipImageUrl: { not: null } },
        select: { id: true, slipImageUrl: true }
    });

    console.log(`🧾 ออเดอร์ที่มีสลิป: ${orders.length} รายการ`);
    let cfSlip = 0;
    let localSlip = 0;
    orders.forEach(o => {
        const isCF = o.slipImageUrl?.includes('imagedelivery.net') || o.slipImageUrl?.includes('cloudflare');
        if (isCF) cfSlip++;
        else localSlip++;
        const icon = isCF ? '☁️ ' : '💾';
        console.log(`  ${icon} Order ${o.id.slice(-8)}: ${o.slipImageUrl?.substring(0, 80)}`);
    });
    console.log(`  ☁️  Cloudflare: ${cfSlip} | 💾 Local/อื่นๆ: ${localSlip}\n`);

    // 3. เช็ค Cloudflare Images โดยตรง
    const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
    const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

    const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1?per_page=5`,
        { headers: { 'Authorization': `Bearer ${API_TOKEN}` } }
    );
    const data = await res.json();

    if (data.success) {
        console.log(`☁️  รูปบน Cloudflare Images ทั้งหมด (5 ล่าสุด):`);
        data.result?.images?.forEach(img => {
            console.log(`  🖼️  ID: ${img.id}`);
            console.log(`     URL: ${img.variants?.[0]}`);
            console.log(`     Uploaded: ${img.uploaded}`);
        });
    }

    await prisma.$disconnect();
}

checkImages().catch(e => { console.error(e); process.exit(1); });
