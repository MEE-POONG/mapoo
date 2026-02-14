import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
    subsets: ["latin", "thai"],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-prompt',
});

export const metadata: Metadata = {
    metadataBase: new URL('https://siamsausage.com'),
    title: {
        default: "หมูเเดดเดียว mapoo - หมูแดดเดียว & ไส้กรอกอีสาน ราคาส่ง ต้นตำรับความอร่อย",
        template: "%s | หมูเเดดเดียว mapoo"
    },
    description: "แหล่งรวมไส้กรอกอีสานและหมูแดดเดียว ราคาส่ง ผลิตสดใหม่ทุกวัน ไร้สารกันบูด รสชาติต้นตำรับ เหมาะสำหรับร้านอาหารและตัวแทนจำหน่ายสินค้าทั่วประเทศ",
    keywords: ["ไส้กรอกอีสาน", "หมูแดดเดียว", "ราคาส่ง", "ขายส่งไส้กรอก", "อาหารอีสาน", "ของฝาก", "โรงงานไส้กรอก"],
    openGraph: {
        title: "หมูเเดดเดียว mapoo - หมูแดดเดียว & ไส้กรอกอีสาน ราคาส่ง",
        description: "อร่อย สะอาด ได้มาตรฐานต้นตำรับ ขายส่งทั่วประเทศ",
        url: 'https://siamsausage.com',
        siteName: 'หมูเเดดเดียว mapoo',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
            },
        ],
        locale: 'th_TH',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "หมูเเดดเดียว mapoo - หมูแดดเดียว & ไส้กรอกอีสาน ราคาส่ง",
        description: "อร่อย สะอาด ได้มาตรฐานต้นตำรับ ขายส่งทั่วประเทศ",
    },
};

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import FloatingActions from "@/components/FloatingActions";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="th">
            <body className={`${prompt.variable} font-sans antialiased text-brand-900 bg-brand-50 selection:bg-accent-500 selection:text-white`}>
                <ToastProvider>
                    <AuthProvider>
                        <CartProvider>
                            {children}
                            <FloatingActions />
                        </CartProvider>
                    </AuthProvider>
                </ToastProvider>
            </body>
        </html>
    );
}

