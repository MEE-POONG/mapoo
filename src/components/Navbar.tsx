'use client';

import Link from 'next/link';
import { ShoppingCart, Menu } from 'lucide-react';
import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const { itemCount } = useCart();

    return (
        <nav className="glass-nav fixed w-full z-50 border-b border-brand-200 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                        <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center text-white text-xl font-bold font-serif">S</div>
                        <div>
                            <span className="font-bold text-2xl tracking-tight text-brand-800">SiamSausage</span>
                            <p className="text-xs text-brand-500 -mt-1 tracking-wider">ต้นตำรับ ราคาส่ง</p>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link href="/" className="text-brand-700 hover:text-accent-600 font-medium transition-colors">หน้าแรก</Link>
                        <Link href="/products" className="text-brand-700 hover:text-accent-600 font-medium transition-colors">สินค้าทั้งหมด</Link>
                        <Link href="/reviews" className="text-brand-700 hover:text-accent-600 font-medium transition-colors">รีวิวลูกค้า</Link>
                        <Link href="/wholesale" className="text-brand-700 hover:text-accent-600 font-medium transition-colors">เรทราคาส่ง</Link>
                        <Link href="/contact" className="text-brand-700 hover:text-accent-600 font-medium transition-colors">ติดต่อเรา</Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        <Link href="/cart" className="text-brand-700 hover:text-accent-600 relative group">
                            <ShoppingCart className="w-7 h-7" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-accent-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                        <button className="md:hidden text-brand-700">
                            <Menu className="w-7 h-7" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
