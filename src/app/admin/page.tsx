'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';
import {
    TrendingUp,
    Users,
    Package,
    ShoppingCart,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    DollarSign,
    Box,
    Clock,
    ChevronRight,
    ChevronDown,
    Calendar,
    Phone,
    MapPin,
    RefreshCw,
    CheckCircle2,
    Truck,
    XCircle,
    ShoppingBag,
    Ticket,
    BarChart3,
    LogOut,
    ShieldCheck,
    MessageSquare,
    Star,
    CreditCard
} from "lucide-react";

interface Stats {
    totalRevenue: number;
    totalOrders: number;
    totalProfit: number;
    topProducts: Array<{ name: string, quantity: number, revenue: number }>;
    todayOrdersCount: number;
    todayOrders: any[];
}

const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'รอดำเนินการ', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    { value: 'PROCESSING', label: 'กำลังเตรียมของ', color: 'bg-blue-100 text-blue-700', icon: RefreshCw },
    { value: 'SHIPPED', label: 'กำลังจัดส่ง', color: 'bg-purple-100 text-purple-700', icon: Truck },
    { value: 'DELIVERED', label: 'ส่งสำเร็จ', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    { value: 'CANCELLED', label: 'ยกเลิก', color: 'bg-red-100 text-red-700', icon: XCircle },
];

import AdminHeader from '@/components/AdminHeader';

export default function AdminDashboard() {
    const router = useRouter();
    const { admin, token, isLoading: authLoading, isAuthenticated, logout, clearStorageAndReload } = useAdminAuth();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [showResetButton, setShowResetButton] = useState(false);

    // Emergency Reset Timer: If it takes more than 5s, show the reset button
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (authLoading || (loading && !stats)) {
            timer = setTimeout(() => {
                setShowResetButton(true);
            }, 5000);
        } else {
            setShowResetButton(false);
        }
        return () => clearTimeout(timer);
    }, [authLoading, loading, stats]);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/admin/login');

            // Fallback: if client-side navigation hangs, force a full reload after 2 seconds
            const timeout = setTimeout(() => {
                if (window.location.pathname !== '/admin/login') {
                    window.location.href = '/admin/login';
                }
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchStats();
        }
    }, [isAuthenticated]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                fetchStats();
            } else {
                alert('ไม่สามารถอัปเดตสถานะได้');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusInfo = (status: string) => {
        return STATUS_OPTIONS.find(opt => opt.value === status) || STATUS_OPTIONS[0];
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const managementMenus = [
        { href: '/admin/products', label: 'จัดการสินค้า', desc: 'สต๊อก, ราคา', icon: Package, color: 'amber' as const },
        { href: '/admin/orders', label: 'คำสั่งซื้อ', desc: 'สถานะการส่ง', icon: ShoppingBag, color: 'blue' as const },
        { href: '/admin/reports/sales', label: 'รายงานยอดขาย', desc: 'สรุปกำไร', icon: BarChart3, color: 'purple' as const },
        { href: '/admin/wholesale', label: 'ราคาส่ง', desc: 'กำหนดเรทราคา', icon: TrendingUp, color: 'emerald' as const },
        { href: '/admin/discounts', label: 'โค้ดส่วนลด', desc: 'โปรโมชั่น', icon: Ticket, color: 'orange' as const },
        { href: '/admin/reviews', label: 'รีวิวลูกค้า', desc: 'ตรวจสอบรีวิว', icon: Star, color: 'yellow' as const },
        { href: '/admin/contacts', label: 'ข้อความลูกค้า', desc: 'บริการลูกค้า', icon: MessageSquare, color: 'indigo' as const },
        { href: '/admin/customers', label: 'สมาชิก', desc: 'ฐานข้อมูลลูกข้า', icon: Users, color: 'slate' as const }
    ];

    // 1. Initial Auth Check (Dark Background)
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
                <div className="text-center max-w-sm w-full">
                    <div className="relative mb-8">
                        <div className="w-20 h-20 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto" />
                        <div className="absolute inset-0 flex items-center justify-center text-amber-500">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                    </div>

                    <h2 className="text-white text-xl font-bold mb-2">Verifying Credentials</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-8">Siam Sausage Security Terminal</p>

                    {showResetButton && (
                        <div className="animate-in fade-in zoom-in duration-500">
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 mb-4">
                                <p className="text-amber-200 text-xs mb-4">ระบบหมุนนานผิดปกติ? ลองล้างข้อมูลแล้วเข้าใหม่ดูครับ</p>
                                <button
                                    onClick={clearStorageAndReload}
                                    className="w-full py-3 bg-amber-500 text-white font-black rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 text-xs uppercase"
                                >
                                    ล้างข้อมูลเซสชันและเข้าใหม่
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // 2. Not Authenticated (will be handled by useEffect redirect, but show one last loader just in case)
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Redirecting to Login...</p>
                </div>
            </div>
        );
    }

    // 3. Authenticated but Stats still loading (Light Background - within Dashboard)
    // We show the Header first to make it feel faster
    if (loading && !stats) {
        return (
            <main className="min-h-screen bg-[#F8F9FB]">
                <AdminHeader />
                <div className="flex flex-col items-center justify-center py-40 p-6 text-center">
                    <div className="relative mb-6">
                        <div className="w-16 h-16 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin" />
                    </div>
                    <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px] mb-8">Accessing Encrypted Data...</p>

                    {showResetButton && (
                        <div className="max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <button
                                onClick={clearStorageAndReload}
                                className="text-amber-600 font-bold text-xs underline hover:text-amber-700"
                            >
                                ข้อมูลไม่โหลด? กดลองใหม่ตรงนี้ครับ
                            </button>
                        </div>
                    )}
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8F9FB]">
            <AdminHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                {/* Dashboard Heading with Style */}
                <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1 h-6 md:h-8 bg-amber-500 rounded-full" />
                            <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">ศูนย์ควบคุมหลัก</h1>
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[8px] md:text-[10px] ml-3">Siam Sausage Premium Admin Terminal</p>
                    </div>

                    <div className="flex items-center gap-3 bg-white px-4 md:px-6 py-2 md:py-3 rounded-[2rem] shadow-sm border border-gray-100 ring-4 ring-gray-50/50 w-fit">
                        <div className="relative">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping absolute" />
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full relative" />
                        </div>
                        <span className="text-[10px] md:text-xs font-black text-gray-700 uppercase tracking-widest">System Online</span>
                    </div>
                </div>

                {/* KPI Overview Cards - More Compact on Mobile */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
                    {[
                        { label: 'ยอดขาย', value: `฿${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'blue', desc: 'Total sales' },
                        { label: 'กำไร', value: `฿${(stats?.totalProfit || 0).toLocaleString()}`, icon: TrendingUp, color: 'green', desc: 'Net profit' },
                        { label: 'ออเดอร์', value: `${(stats?.totalOrders || 0).toLocaleString()}`, icon: ShoppingCart, color: 'orange', desc: 'Orders' },
                        { label: 'สินค้า', value: `${(stats?.topProducts?.length || 0)}`, icon: Package, color: 'purple', desc: 'Active items' }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-4 md:p-7 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
                            <div className={`absolute top-0 right-0 w-20 md:w-32 h-20 md:h-32 bg-${item.color}-50/30 rounded-bl-[3rem] md:rounded-bl-[5rem] -mr-6 md:-mr-10 -mt-6 md:-mt-10 transition-all duration-700 group-hover:scale-125`} />

                            <div className="relative z-10">
                                <div className={`w-10 h-10 md:w-14 md:h-14 bg-${item.color}-50 rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-${item.color}-600 mb-3 md:mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-sm border border-${item.color}-100`}>
                                    <item.icon className="w-5 h-5 md:w-7 md:h-7" />
                                </div>
                                <p className="text-gray-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-0 md:mb-1">{item.label}</p>
                                <p className="text-lg md:text-3xl font-black text-gray-900 tracking-tighter mb-0 md:mb-2">{item.value}</p>
                                <p className="text-[8px] md:text-[10px] text-gray-400 font-bold italic opacity-0 md:opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Sidebar: Structured Navigation */}
                    <div className="lg:col-span-4 space-y-6 md:space-y-8">
                        <div>
                            <h2 className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-3">
                                <div className="w-4 md:w-6 h-[2px] bg-gray-200" />
                                การจัดการ
                            </h2>

                            {/* Dropdown for Mobile/Tablet */}
                            <div className="lg:hidden relative mb-6">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className={`w-full flex items-center justify-between p-4 bg-white rounded-2xl border transition-all duration-300 shadow-sm h-16 group ${isMenuOpen ? 'border-gray-900 ring-4 ring-gray-900/5' : 'border-gray-100'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isMenuOpen ? 'bg-gray-900 text-white' : 'bg-amber-50 text-amber-600'}`}>
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <span className="block font-black text-gray-900 text-sm">เลือกเมนูการจัดการ</span>
                                            <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Quick Access Management</span>
                                        </div>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-500 ${isMenuOpen ? 'rotate-180 text-gray-900' : ''}`} />
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-3 p-3 bg-white rounded-[2rem] border border-gray-100 shadow-2xl grid grid-cols-1 gap-2 z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="grid grid-cols-2 gap-2">
                                            {managementMenus.map((menu, i) => (
                                                <Link key={i} href={menu.href} className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50/50 hover:bg-gray-900 hover:text-white rounded-2xl transition-all group">
                                                    <div className={`w-10 h-10 bg-${menu.color}-50 rounded-xl flex items-center justify-center text-${menu.color}-600 group-hover:bg-white/10 group-hover:text-white transition-colors`}>
                                                        <menu.icon className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-black text-[11px] uppercase tracking-tighter text-center">{menu.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full py-3 mt-2 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-gray-900/20"
                                        >
                                            ปิดเมนู
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* List for Desktop */}
                            <div className="hidden lg:grid grid-cols-1 gap-4">
                                {managementMenus.map((menu, i) => (
                                    <Link key={i} href={menu.href} className="flex items-center gap-4 p-5 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:border-gray-900 hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
                                        <div className={`w-12 h-12 bg-${menu.color}-50 rounded-2xl flex items-center justify-center text-${menu.color}-600 group-hover:bg-gray-900 group-hover:text-white transition-all duration-300 flex-shrink-0`}>
                                            <menu.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-gray-900 text-sm group-hover:translate-x-1 transition-transform truncate">{menu.label}</p>
                                            <p className="text-[10px] text-gray-400 font-bold italic truncate">{menu.desc}</p>
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 text-gray-200 group-hover:text-gray-900 transition-colors flex-shrink-0" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Top Products Box - Compact */}
                        <div className="bg-gray-900 rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 text-white relative overflow-hidden shadow-2xl shadow-gray-400/20">
                            <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-white/5 rounded-full -mr-12 md:-mr-16 -mt-12 md:-mt-16 blur-3xl" />
                            <h2 className="text-[10px] md:text-[11px] font-black text-amber-400 uppercase tracking-[0.2em] mb-4 md:mb-8 flex items-center gap-3 relative z-10">
                                <Star className="w-4 h-4" /> 5 อันดับยอดนิยม
                            </h2>
                            <div className="space-y-3 md:space-y-4 relative z-10">
                                {stats?.topProducts?.map((p, i) => (
                                    <div key={i} className="flex items-center gap-3 md:gap-4 p-2.5 md:p-3 bg-white/5 rounded-xl md:rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center font-black text-[10px] md:text-xs">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-xs md:text-sm truncate">{p.name}</p>
                                            <p className="text-[9px] md:text-[10px] text-gray-400 font-bold italic">ขายได้ {p.quantity} หน่วย</p>
                                        </div>
                                        <p className="font-black text-amber-500 text-xs md:text-base">฿{p.revenue.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Content: Modern Orders List */}
                    <div className="lg:col-span-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-3 md:gap-4">
                                    <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 text-amber-500" />
                                    ออเดอร์ล่าสุดวันนี้
                                </h2>
                                <p className="text-gray-400 font-bold text-[10px] md:text-xs mt-0.5 md:mt-1 ml-9 md:ml-12">ตรวจสอบ และ จัดการสถานะการจัดส่ง</p>
                            </div>
                            <Link href="/admin/orders" className="bg-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-black text-gray-500 hover:text-gray-900 border border-gray-100 shadow-sm transition-all hover:-translate-y-1 text-center">
                                ดูทั้งหมด
                            </Link>
                        </div>

                        <div className="space-y-5">
                            {(!stats?.todayOrders || stats?.todayOrders?.length === 0) ? (
                                <div className="bg-white p-20 rounded-[3rem] border border-dashed border-gray-200 text-center shadow-inner">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Clock className="w-10 h-10 text-gray-200" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2">ยังไม่มีออเดอร์ในตัวควบคุม</h3>
                                    <p className="text-gray-400 font-bold max-w-xs mx-auto text-sm italic">รายการที่สั่งซื้อเข้ามาภายในวันนี้จะปรากฏที่นี่แบบ Real-time</p>
                                </div>
                            ) : stats?.todayOrders?.map((order, i) => {
                                const statusInfo = getStatusInfo(order.status);
                                const isExpanded = expandedOrder === order.id;

                                return (
                                    <div key={order.id} className={`bg-white rounded-2xl md:rounded-[2.5rem] border transition-all duration-500 ${isExpanded ? 'border-gray-900 shadow-2xl shadow-gray-200 ring-4 md:ring-[12px] ring-gray-900/5' : 'border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100 hover:border-amber-200'}`}>
                                        <div
                                            className="p-4 md:p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8"
                                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                        >
                                            <div className="flex items-center gap-4 md:gap-6">
                                                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] flex items-center justify-center flex-shrink-0 bg-gray-50 text-gray-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors shadow-inner`}>
                                                    <Package className="w-6 h-6 md:w-8 md:h-8" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <span className="text-[9px] md:text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 md:py-1 rounded-lg uppercase tracking-wider">#{order.id.slice(-6).toUpperCase()}</span>
                                                        <span className={`px-2 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase ${statusInfo.color}`}>
                                                            {statusInfo.label}
                                                        </span>
                                                        {order.slipImageUrl && (
                                                            <span className="px-2 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase bg-green-100 text-green-700 flex items-center gap-1">
                                                                <CreditCard className="w-2.5 h-2.5" />
                                                                จ่ายแล้ว
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-base md:text-xl font-black text-gray-900 truncate">{order.customerName}</h3>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between md:justify-end gap-4 md:gap-10">
                                                <div className="bg-gray-50/50 p-2 md:p-4 rounded-xl md:rounded-2xl border border-gray-100 min-w-[100px] md:min-w-[120px]">
                                                    <p className="text-[8px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0 md:mb-1">ยอดสุทธิ</p>
                                                    <p className="text-sm md:text-lg font-black text-gray-900">฿{order.totalAmount.toLocaleString()}</p>
                                                </div>
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-[8px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0 md:mb-1">เวลา</p>
                                                    <p className="text-xs md:text-sm font-black text-gray-700">{new Date(order.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</p>
                                                </div>
                                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-200 flex items-center justify-center transition-transform duration-500 ${isExpanded ? 'rotate-180 bg-gray-900 border-gray-900 text-white shadow-lg' : 'bg-white text-gray-300'}`}>
                                                    <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
                                                </div>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="px-4 md:px-10 pb-6 md:pb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                                                <div className="pt-6 md:pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                                    <div className="space-y-4 md:space-y-6">
                                                        <div>
                                                            <h4 className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 md:mb-4 flex items-center gap-2">
                                                                <Phone className="w-4 h-4" /> ข้อมูลผู้รับ
                                                            </h4>
                                                            <div className="bg-gray-50 p-4 md:p-6 rounded-2xl md:rounded-[2rem] space-y-3 md:space-y-4 border border-gray-100 shadow-inner">
                                                                <p className="text-sm md:text-base font-black text-gray-800 flex items-center gap-3">
                                                                    <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-lg md:rounded-xl flex items-center justify-center shadow-sm">
                                                                        <Users className="w-3.5 h-3.5 md:w-4 h-4 text-amber-500" />
                                                                    </div>
                                                                    {order.customerName}
                                                                </p>
                                                                <p className="text-xs md:text-sm font-bold text-gray-600 flex items-center gap-3">
                                                                    <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-lg md:rounded-xl flex items-center justify-center shadow-sm text-amber-500">📞</div>
                                                                    {order.phone}
                                                                </p>
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-lg md:rounded-xl flex items-center justify-center shadow-sm text-amber-500 shrink-0">📍</div>
                                                                    <p className="text-xs md:text-sm font-medium text-gray-500 italic leading-relaxed">{order.address || 'ไม่ระบุที่อยู่จัดส่ง'}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Quick Action Button */}
                                                        <Link href={`/admin/orders?id=${order.id}`} className="flex items-center justify-center gap-2 md:gap-3 w-full py-3 md:py-4 bg-gray-900 text-white rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:scale-[1.02] transition-transform shadow-xl shadow-gray-900/10">
                                                            <Package className="w-4 h-4 md:w-5 md:h-5" />
                                                            จัดการออเดอร์
                                                        </Link>
                                                    </div>

                                                    <div className="space-y-4 md:space-y-6">
                                                        <h4 className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 md:mb-4 flex items-center gap-2">
                                                            <ShoppingCart className="w-4 h-4" /> สรุปสินค้า
                                                        </h4>
                                                        <div className="space-y-2 md:space-y-3">
                                                            {order.items?.map((item: any) => (
                                                                <div key={item.id} className="flex justify-between items-center p-3 md:p-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-amber-500">
                                                                    <div className="flex items-center gap-3 md:gap-4">
                                                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-50 rounded-lg flex items-center justify-center text-[10px] md:text-xs font-black text-gray-400">
                                                                            x{item.quantity}
                                                                        </div>
                                                                        <p className="font-black text-gray-800 text-xs md:text-sm">{item.product?.name}</p>
                                                                    </div>
                                                                    <p className="font-black text-amber-600 text-xs md:text-base">฿{(item.price * item.quantity).toLocaleString()}</p>
                                                                </div>
                                                            )) || <p className="text-[10px] md:text-sm font-bold text-gray-400 italic">ไม่มีข้อมูลสินค้า</p>}

                                                            <div className="pt-4 md:pt-6 mt-4 md:mt-6 border-t-2 border-dashed border-gray-100 space-y-2 md:space-y-3">
                                                                <div className="flex justify-between items-center text-[10px] md:text-xs font-bold text-gray-400">
                                                                    <span>ค่าจัดส่ง (เหมา)</span>
                                                                    <span>฿40</span>
                                                                </div>
                                                                <div className="flex justify-between items-center text-lg md:text-xl font-black text-gray-900">
                                                                    <span className="text-xs md:text-base">รวมทั้งหมด</span>
                                                                    <span className="text-xl md:text-2xl text-amber-600">฿{order.totalAmount.toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function User({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    )
}
