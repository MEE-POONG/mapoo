export async function sendLineNotify(message: string) {
    const token = process.env.LINE_NOTIFY_TOKEN;
    if (!token) {
        console.warn('LINE_NOTIFY_TOKEN not configured. Skipping LINE notification.');
        return;
    }

    try {
        const res = await fetch('https://notify-api.line.me/api/notify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${token}`,
            },
            body: new URLSearchParams({ message }),
        });

        if (!res.ok) {
            console.error('LINE Notify error:', await res.text());
        }
    } catch (error) {
        console.error('LINE Notify error:', error);
    }
}

export async function sendNewOrderNotification(orderData: any) {
    const orderId = orderData.id.slice(-8).toUpperCase();
    const message = `
🌟 มีออเดอร์ใหม่! #${orderId}
👤 ลูกค้า: ${orderData.customerName}
📞 เบอร์โทร: ${orderData.phone}
💰 ยอดรวม: ฿${orderData.totalAmount.toLocaleString()}
📍 ที่อยู่: ${orderData.address}

ตรวจสอบออเดอร์ได้ที่หน้า Admin นะครับ!
`.trim();

    return sendLineNotify(message);
}
