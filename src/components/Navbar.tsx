'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Menu, User, LogIn, Package, LogOut, ChevronDown } from 'lucide-react';
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { itemCount } = useCart();
    const { customer, isLoading, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        router.push('/');
    };

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
                    <div className="flex items-center space-x-3">
                        {/* Auth Buttons */}
                        {!isLoading && (
                            customer ? (
                                <div className="relative hidden sm:block" ref={dropdownRef}>
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="flex items-center gap-2 px-4 py-2 bg-accent-50 text-accent-700 rounded-xl hover:bg-accent-100 transition-colors border border-accent-200"
                                    >
                                        <User className="w-4 h-4" />
                                        <span className="font-medium max-w-[100px] truncate">{customer.name}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showDropdown && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-brand-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <Link
                                                href="/account"
                                                onClick={() => setShowDropdown(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-brand-700 hover:bg-brand-50 transition-colors"
                                            >
                                                <User className="w-4 h-4" />
                                                <span className="font-medium">บัญชีของฉัน</span>
                                            </Link>
                                            <Link
                                                href="/account"
                                                onClick={() => setShowDropdown(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-brand-700 hover:bg-brand-50 transition-colors"
                                            >
                                                <Package className="w-4 h-4" />
                                                <span className="font-medium">คำสั่งซื้อของฉัน</span>
                                            </Link>
                                            <div className="border-t border-brand-100 my-2"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors w-full"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span className="font-medium">ออกจากระบบ</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="hidden sm:flex items-center gap-2">
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 text-brand-700 hover:text-accent-600 font-medium transition-colors"
                                    >
                                        เข้าสู่ระบบ
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-4 py-2 bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition-colors font-medium shadow-lg shadow-accent-500/20"
                                    >
                                        สมัครสมาชิก
                                    </Link>
                                </div>
                            )
                        )}

                        {/* Mobile Auth Button */}
                        {!isLoading && (
                            <Link
                                href={customer ? "/account" : "/login"}
                                className="sm:hidden text-brand-700 hover:text-accent-600"
                            >
                                {customer ? <User className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
                            </Link>
                        )}

                        {/* Order Tracking Icon - Shows when logged in, next to cart */}
                        {!isLoading && customer && (
                            <Link
                                href="/account"
                                className="text-brand-700 hover:text-accent-600 relative group"
                                title="ติดตามคำสั่งซื้อ"
                            >
                                <Package className="w-7 h-7" />
                                {/* Tooltip */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-brand-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-lg z-50">
                                    ติดตามคำสั่งซื้อ
                                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-900 rotate-45"></div>
                                </div>
                            </Link>
                        )}

                        {/* Cart */}
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
