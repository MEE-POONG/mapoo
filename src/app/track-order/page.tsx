import { Metadata } from 'next';
import TrackOrderClient from './TrackOrderClient';

export const metadata: Metadata = {
    title: "ติดตามสถานะคำสั่งซื้อ",
    description: "ตรวจสอบสถานะการจัดส่งสินค้าของคุณ เพียงกรอกหมายเลขคำสั่งซื้อและเบอร์โทรศัพท์",
};

export default function Page() {
    return <TrackOrderClient />;
}
