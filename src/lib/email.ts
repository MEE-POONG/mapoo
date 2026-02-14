import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendOrderEmail(to: string, orderData: any) {
    if (!process.env.SMTP_USER) {
        console.warn('SMTP_USER not configured. Skipping email.');
        return;
    }

    const itemsHtml = orderData.items.map((item: any) => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">฿${(item.price * item.quantity).toLocaleString()}</td>
        </tr>
    `).join('');

    const mailOptions = {
        from: `"หมูเเดดเดียว mapoo" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to,
        subject: `ยืนยันการสั่งซื้อ #${orderData.id.slice(-8).toUpperCase()}`,
        html: `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #ea580c; text-align: center;">ขอบคุณที่สั่งซื้อสินค้าจาก หมูเเดดเดียว mapoo!</h2>
                <p>สวัสดีคุณ ${orderData.customerName},</p>
                <p>เราได้รับคำสั่งซื้อของคุณเรียบร้อยแล้ว รายละเอียดมีดังนี้:</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr style="background-color: #f8fafc;">
                            <th style="padding: 10px; text-align: left;">สินค้า</th>
                            <th style="padding: 10px; text-align: center;">จำนวน</th>
                            <th style="padding: 10px; text-align: right;">ราคา</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">รวมยอดสุทธิ:</td>
                            <td style="padding: 10px; text-align: right; font-weight: bold; color: #ea580c;">฿${orderData.totalAmount.toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>

                <div style="margin-top: 30px; padding: 20px; background-color: #fff7ed; border-radius: 10px; border: 1px solid #fed7aa;">
                    <h3 style="margin-top: 0; color: #9a3412;">ขั้นตอนถัดไป</h3>
                    <ol>
                        <li>โอนเงินมาที่เลขบัญชี: <strong>123-4-56789-0 (กสิกรไทย)</strong></li>
                        <li>แนบหลักฐานการโอนเงิน (สลิป) ที่หน้า <strong>"บัญชีของฉัน"</strong></li>
                        <li>รอรับสินค้าที่บ้านได้เลย!</li>
                    </ol>
                </div>
                
                <p style="font-size: 12px; color: #666; text-align: center; margin-top: 30px;">
                    หากมีข้อสงสัย ติดต่อเราได้ที่ LINE @mapoo หรือโทร 089-123-4567
                </p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending order email:', error);
    }
}
