'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';
import {
    ShieldCheck,
    LogOut,
    User,
    ChevronDown,
    LayoutDashboard,
    ExternalLink
} from 'lucide-react';

export default function AdminHeader() {
    const router = useRouter();
    const { admin, isLoading, logout, isAuthenticated } = useAdminAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
        router.push('/admin/login');
    };

    if (isLoading || !isAuthenticated) return null;

    return (
        <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand */}
                    <Link href="/admin" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-900 leading-tight">Admin Panel</h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">SiamSausage</p>
                        </div>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            target="_blank"
                            className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-amber-600 transition-colors bg-gray-50 rounded-lg border border-gray-100"
                        >
                            <ExternalLink className="w-3 h-3" />
                            ดูหน้าเว็บ
                        </Link>

                        {/* Profile Dropdown Like Image 2 */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white border-2 border-gray-900 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-sm"
                            >
                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    <User className="w-3.5 h-3.5 text-gray-600" />
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-sm font-black text-gray-900 leading-none">{admin?.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{admin?.role}</p>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Standard Dropdown Style from Image 2 */}
                            {showDropdown && (
                                <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="px-5 py-3 border-b border-gray-50 mb-2 sm:hidden">
                                        <p className="text-sm font-black text-gray-900">{admin?.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold">{admin?.role}</p>
                                    </div>

                                    <Link
                                        href="/admin"
                                        onClick={() => setShowDropdown(false)}
                                        className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors font-bold group"
                                    >
                                        <LayoutDashboard className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                        <span>แผงควบคุมหลัก</span>
                                    </Link>

                                    <Link
                                        href="/admin/admins"
                                        onClick={() => setShowDropdown(false)}
                                        className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors font-bold group"
                                    >
                                        <ShieldCheck className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                        <span>จัดการแอดมิน</span>
                                    </Link>

                                    <div className="border-t border-gray-50 my-2 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.02)]"></div>

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-5 py-3 text-red-500 hover:bg-red-50 transition-colors w-full font-bold group"
                                    >
                                        <LogOut className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
                                        <span>ออกจากระบบ</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
