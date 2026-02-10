import { Metadata } from 'next';
import WholesaleClient from './WholesaleClient';

export const metadata: Metadata = {
    title: "เรทราคาส่ง - สำหรับตัวแทนและร้านค้า",
    description: "ตรวจสอบเรทราคาขายส่งไส้กรอกอีสานและหมูแดดเดียว เริ่มต้นเพียง 10 กก. กำไรดี จัดส่งทั่วไทย",
    keywords: ["ราคาส่ง", "ตัวแทนจำหน่าย", "รับไปขายต่อ", "ธุรกิจอาหาร"],
};

export default function Page() {
    return <WholesaleClient />;
}
