import { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';

interface Props {
    params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        // In a real app, you'd fetch the product from DB here
        // For now we'll just return a decent title
        return {
            title: `รายละเอียดสินค้า | SiamSausage`,
            description: "ดูข้อมูลสินค้า ราคา และส่วนผสมของไส้กรอกอีสานและหมูแดดเดียวรสดั้งเดิม",
        };
    } catch (error) {
        return {
            title: "รายละเอียดสินค้า | SiamSausage",
        };
    }
}

export default function Page({ params }: Props) {
    return <ProductDetailClient params={params} />;
}
