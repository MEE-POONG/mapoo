'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, Menu, User, LogIn, Package, LogOut, ChevronDown } from 'lucide-react';
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { itemCount } = useCart();
    const { customer, isLoading, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setShowMobileMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setShowMobileMenu(false);
    }, [pathname]);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        router.push('/');
    };

    const navLinks = [
        { name: 'หน้าแรก', href: '/' },
        { name: 'สินค้าทั้งหมด', href: '/products' },
        { name: 'รีวิวลูกค้า', href: '/reviews' },
        { name: 'เรทราคาส่ง', href: '/wholesale' },
        { name: 'ติดตามออเดอร์', href: '/track-order' },
        { name: 'ติดต่อเรา', href: '/contact' },
    ];

    return (
        <nav className="glass-nav fixed w-full z-50 border-b border-brand-200 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
                        <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center text-white text-xl font-bold font-serif group-hover:rotate-12 transition-transform duration-300">M</div>
                        <div>
                            <span className="font-bold text-2xl tracking-tight text-brand-800 group-hover:text-accent-600 transition-colors">หมูเเดดเดียว mapoo</span>
                            <p className="text-xs text-brand-500 -mt-1 tracking-wider uppercase font-semibold">Thai Taste</p>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`font-medium transition-all duration-300 relative group ${pathname === link.href ? 'text-accent-600' : 'text-brand-700 hover:text-accent-600'
                                    }`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent-500 transition-all duration-300 ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                                    }`}></span>
                            </Link>
                        ))}
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

                        {/* Mobile Device Only Profile Icon */}
                        {!isLoading && (
                            <Link
                                href={customer ? "/account" : "/login"}
                                className="sm:hidden text-brand-700 hover:text-accent-600 p-2"
                            >
                                {customer ? <User className="w-6 h-6 text-accent-600" /> : <LogIn className="w-6 h-6" />}
                            </Link>
                        )}

                        {/* Cart */}
                        <Link href="/cart" className="text-brand-700 hover:text-accent-600 relative group p-2">
                            <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            {itemCount > 0 && (
                                <span key={itemCount} className="absolute top-1 right-0.5 bg-accent-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pop">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden text-brand-700 hover:text-accent-600 p-2"
                        >
                            <Menu className="w-7 h-7" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {showMobileMenu && (
                <div className="fixed inset-0 bg-brand-900/40 backdrop-blur-sm z-50 md:hidden animate-in fade-in duration-300">
                    <div
                        ref={mobileMenuRef}
                        className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl animate-in slide-in-from-right duration-300"
                    >
                        <div className="p-6 flex justify-between items-center border-b border-brand-50">
                            <span className="font-bold text-brand-900 text-lg">Menu</span>
                            <button
                                onClick={() => setShowMobileMenu(false)}
                                className="p-2 text-brand-400 hover:text-brand-900"
                            >
                                <ChevronDown className="w-6 h-6 rotate-90" />
                            </button>
                        </div>
                        <div className="py-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center justify-between px-6 py-4 transition-colors ${pathname === link.href
                                        ? 'bg-accent-50 text-accent-700 border-r-4 border-accent-600 font-bold'
                                        : 'text-brand-700 hover:bg-brand-50'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {!customer && (
                            <div className="p-6 mt-4 border-t border-brand-50 space-y-3">
                                <Link
                                    href="/login"
                                    className="block w-full text-center py-4 rounded-xl font-bold bg-brand-50 text-brand-800"
                                >
                                    เข้าสู่ระบบ
                                </Link>
                                <Link
                                    href="/register"
                                    className="block w-full text-center py-4 rounded-xl font-bold bg-accent-600 text-white shadow-lg shadow-accent-500/20"
                                >
                                    สมัครสมาชิก
                                </Link>
                            </div>
                        )}
                        {customer && (
                            <div className="p-6 mt-4 border-t border-brand-50">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 text-red-600 p-2 font-bold"
                                >
                                    <LogOut className="w-5 h-5" />
                                    ออกจากระบบ
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
