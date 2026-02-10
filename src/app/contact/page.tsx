import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
    title: "ติดต่อเรา - SiamSausage",
    description: "สอบถามข้อมูลเพิ่มเติม สั่งซื้อสินค้า หรือสมัครเป็นตัวแทนจำหน่าย ติดต่อเราได้ผ่านแบบฟอร์ม โทรศัพท์ หรือ LINE",
    keywords: ["ติดต่อสอบถาม", "เบอร์โทร", "ไลน์ไอดี", "ที่ตั้งร้าน"],
};

export default function Page() {
    return <ContactClient />;
}
