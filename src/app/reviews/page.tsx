import { Metadata } from 'next';
import ReviewsClient from './ReviewsClient';

export const metadata: Metadata = {
    title: "รีวิวจากลูกค้า - ความประทับใจจริง",
    description: "อ่านรีวิวจากลูกค้าจริงที่ประทับใจในรสชาติและบริการของ SiamSausage การันตีความอร่อยระดับ 5 ดาว",
    keywords: ["รีวิวลูกค้า", "ความเห็นลูกค้า", "ยืนยันความอร่อย"],
};

export default function Page() {
    return <ReviewsClient />;
}
