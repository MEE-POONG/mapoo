import { Metadata } from 'next';
import ProductsPage from './ProductsClient';

export const metadata: Metadata = {
    title: "สินค้าทั้งหมด - รวมไส้กรอกอีสานและหมูแดดเดียว",
    description: "เลือกซื้อไส้กรอกอีสาน หมูแดดเดียว แหนมเนือง และสินค้าอาหารแปรรูปอร่อยๆ ราคาส่งโดยตรงจากโรงงาน",
    keywords: ["รายการสินค้า", "ไส้กรอกอีสาน", "หมูแดดเดียว", "อาหารแปรรูป", "ขายส่ง"],
};

export default function Page() {
    return <ProductsPage />;
}
