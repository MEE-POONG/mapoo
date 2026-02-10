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
    Star
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

export default function AdminDashboard() {
    const router = useRouter();
    const { admin, isLoading: authLoading, isAuthenticated, logout } = useAdminAuth();

    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/admin/login');
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
            const res = await fetch('/api/admin/stats');
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
                headers: { 'Content-Type': 'application/json' },
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

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
    };

    if (authLoading || (!isAuthenticated && !authLoading)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            </div>
        );
    }

    if (loading && !stats) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-accent-500 animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50/50">
            {/* Admin Header */}
            <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900">Admin Panel</h1>
                                <p className="text-xs text-gray-500">SiamSausage</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-700">{admin?.name}</p>
                                <p className="text-xs text-gray-400">{admin?.role}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">ออกจากระบบ</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-black tracking-tight">Dashboard ศูนย์ควบคุม</h1>
                        <p className="text-gray-500 font-medium italic">Siam Sausage Premium Admin Terminal</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">System Online</span>
                    </div>
                </div>

                {/* Quick Navigation */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <Link href="/admin/customers" className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group">
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                                <Users className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-xs">ลูกค้า</p>
                                <p className="text-[10px] text-gray-400">Customers</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/admin/products" className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all group">
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors">
                                <Package className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-xs">สินค้า</p>
                                <p className="text-[10px] text-gray-400">Products</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/admin/orders" className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all group">
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                                <ShoppingCart className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-xs">ออร์เดอร์</p>
                                <p className="text-[10px] text-gray-400">Orders</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/admin/contacts" className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all group">
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                                <MessageSquare className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-xs">ข้อความ</p>
                                <p className="text-[10px] text-gray-400">Contacts</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/admin/reviews" className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all group">
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:bg-yellow-500 transition-colors">
                                <Star className="w-6 h-6 text-yellow-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-xs">รีวิว</p>
                                <p className="text-[10px] text-gray-400">Reviews</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/admin/wholesale" className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all group">
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                                <TrendingUp className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-xs">ราคาส่ง</p>
                                <p className="text-[10px] text-gray-400">Wholesale</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* KPI Cards */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[4rem] -mr-8 -mt-8 transition-all group-hover:scale-110" />
                        <div className="flex items-center justify-between mb-4 relative">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                <DollarSign className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">ยอดขายรวม</p>
                        <p className="text-2xl font-black text-gray-900">฿{(stats?.totalRevenue || 0).toLocaleString()}</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/50 rounded-bl-[4rem] -mr-8 -mt-8 transition-all group-hover:scale-110" />
                        <div className="flex items-center justify-between mb-4 relative">
                            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">กำไรสุทธิ</p>
                        <p className="text-2xl font-black text-green-600">฿{(stats?.totalProfit || 0).toLocaleString()}</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50/50 rounded-bl-[4rem] -mr-8 -mt-8 transition-all group-hover:scale-110" />
                        <div className="flex items-center justify-between mb-4 relative">
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                                <ShoppingCart className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">ออเดอร์ทั้งหมด</p>
                        <p className="text-2xl font-black text-gray-900">{(stats?.totalOrders || 0).toLocaleString()} รายการ</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/50 rounded-bl-[4rem] -mr-8 -mt-8 transition-all group-hover:scale-110" />
                        <div className="flex items-center justify-between mb-4 relative">
                            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                                <Box className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">รายการสินค้า</p>
                        <p className="text-2xl font-black text-gray-900">{(stats?.topProducts?.length || 0)} รายการ</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                    {/* Compact Navigation */}
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 text-accent-500" />
                            เมนูการจัดการ
                        </h2>

                        <Link href="/admin/products" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-accent-300 hover:shadow-md transition-all group">
                            <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center text-accent-600 group-hover:bg-accent-500 group-hover:text-white transition-all">
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">จัดการสินค้า</p>
                                <p className="text-[10px] text-gray-400 font-medium italic">สต๊อก & ราคา</p>
                            </div>
                            <ArrowUpRight className="ml-auto w-4 h-4 text-gray-300 group-hover:text-accent-500 transition-colors" />
                        </Link>

                        <Link href="/admin/orders" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">ประวัติสั่งซื้อ</p>
                                <p className="text-[10px] text-gray-400 font-medium italic">รายการทั้งหมด</p>
                            </div>
                            <ArrowUpRight className="ml-auto w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </Link>

                        <Link
                            href="/admin/reports/sales"
                            className="flex items-center gap-4 p-5 rounded-3xl bg-blue-50/50 hover:bg-blue-100/50 transition-all border border-blue-100 group"
                        >
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <BarChart3 className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-900">สรุปยอดขาย</h3>
                                <p className="text-xs text-gray-500 font-bold italic">ดูรายงานรายได้ย้อนหลัง</p>
                            </div>
                        </Link>

                        <Link href="/admin/discounts" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-orange-300 hover:shadow-md transition-all group">
                            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                <Ticket className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">โค้ดส่วนลด</p>
                                <p className="text-[10px] text-gray-400 font-medium italic">โปรโมชั่น & คูปอง</p>
                            </div>
                            <ArrowUpRight className="ml-auto w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
                        </Link>

                        <Link href="/contact" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-green-300 hover:shadow-md transition-all group">
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">ข้อความลูกค้า</p>
                                <p className="text-[10px] text-gray-400 font-medium italic">ตอบกลับผ่านเว็บ</p>
                            </div>
                            <ArrowUpRight className="ml-auto w-4 h-4 text-gray-300 group-hover:text-green-500 transition-colors" />
                        </Link>

                        {/* Top Products Compact */}
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">5 อันดับขายดี</h2>
                            <div className="space-y-3">
                                {stats?.topProducts?.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-50 text-[11px]">
                                        <span className="font-bold text-gray-400 mr-2">#0{i + 1}</span>
                                        <span className="font-bold text-gray-700 truncate flex-1">{p.name}</span>
                                        <span className="font-black text-accent-600 ml-2">฿{p.revenue.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* BIG BROTHER: Recent Orders Expansion */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-gray-900 flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                                <div className="flex items-center gap-3">
                                    <ShoppingBag className="w-6 h-6 text-accent-600" />
                                    ออเดอร์วันนี้
                                </div>
                                <span className="bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-xs font-black">
                                    {stats?.todayOrdersCount || 0} รายการ
                                </span>
                            </h2>
                            <Link href="/admin/orders" className="text-sm font-bold text-gray-400 hover:text-accent-500 transition-colors underline decoration-dotted">
                                ดูทั้งหมด
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {(!stats?.todayOrders || stats?.todayOrders?.length === 0) ? (
                                <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
                                    <Clock className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-bold">ยังไม่มีออเดอร์ในวันนี้</p>
                                </div>
                            ) : stats?.todayOrders?.map((order, i) => {
                                const statusInfo = getStatusInfo(order.status);
                                const StatusIcon = statusInfo.icon;
                                const isExpanded = expandedOrder === order.id;

                                return (
                                    <div key={order.id} className={`bg-white rounded-3xl border transition-all duration-300 ${isExpanded ? 'border-accent-300 shadow-xl shadow-accent-100/20 ring-4 ring-accent-50' : 'border-gray-100 shadow-sm hover:border-accent-200'}`}>
                                        <div
                                            className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${statusInfo.color.replace('text-', 'text-opacity-80 text-')}`}>
                                                    <Package className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">ID: #{order.id.slice(-6).toUpperCase()}</p>
                                                    <h3 className="font-black text-gray-900">{order.customerName}</h3>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-6 md:gap-10">
                                                <div className="text-center md:text-left">
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">วันที่</p>
                                                    <p className="text-xs font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString('th-TH')}</p>
                                                </div>
                                                <div className="text-center md:text-left">
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">ยอดรวม</p>
                                                    <p className="text-sm font-black text-accent-600">฿{order.totalAmount.toLocaleString()}</p>
                                                </div>
                                                <div className="text-center md:text-left">
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">เวลาที่สั่ง</p>
                                                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                                                        <Clock className="w-3 h-3 text-accent-500" />
                                                        {new Date(order.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                                                    </p>
                                                </div>
                                                <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="pt-8 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ข้อมูลที่อยู่จัดส่ง</h4>
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusInfo.color}`}>
                                                                {statusInfo.label}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                                            <Phone className="w-4 h-4 text-accent-500" /> {order.phone}
                                                        </div>
                                                        <div className="flex items-start gap-3 text-sm font-medium text-gray-600">
                                                            <MapPin className="w-4 h-4 text-accent-500 mt-0.5" /> <span className="flex-1 italic">{order.address || 'ไม่ระบุที่อยู่'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-gray-50 p-6 rounded-2xl space-y-3">
                                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">รายการสินค้า</h4>
                                                        {order.items?.map((item: any) => (
                                                            <div key={item.id} className="flex justify-between items-center text-xs font-bold">
                                                                <span className="text-gray-700">{item.product?.name} x {item.quantity}</span>
                                                                <span className="text-accent-600">฿{(item.price * item.quantity).toLocaleString()}</span>
                                                            </div>
                                                        )) || <p className="text-xs text-gray-400 italic">ไม่มีข้อมูลสินค้า</p>}
                                                        <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between font-black">
                                                            <span className="text-gray-900">ค่าจัดส่ง</span>
                                                            <span className="text-gray-900">฿40</span>
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
