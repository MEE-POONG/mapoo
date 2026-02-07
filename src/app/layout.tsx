import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
    subsets: ["latin", "thai"],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-prompt',
});

export const metadata: Metadata = {
    title: "SiamSausage - ไส้กรอกอีสาน & หมูแดดเดียว ราคาส่ง",
    description: "ไส้กรอกอีสาน หมูแดดเดียว ราคาส่ง กำไรดี เหมาะสำหรับร้านค้าและตัวแทนจำหน่าย",
};

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="th">
            <body className={`${prompt.variable} font-sans antialiased text-brand-900 bg-brand-50 selection:bg-accent-500 selection:text-white`}>
                <AuthProvider>
                    <CartProvider>
                        {children}
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
