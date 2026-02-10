import { Metadata } from 'next';
import CartClient from './CartClient';

export const metadata: Metadata = {
    title: "ตะกร้าสินค้า - SiamSausage",
    description: "ตรวจสอบรายการสินค้าที่คุณเลือก เตรียมพร้อมสั่งซื้อไส้กรอกอีสานและหมูแดดเดียวแสนอร่อย",
};

export default function Page() {
    return <CartClient />;
}
