'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';
import {
    ShoppingBag,
    Search,
    Loader2,
    Calendar,
    Phone,
    MapPin,
    User,
    Package,
    ChevronDown,
    ChevronLeft,
    RefreshCw,
    CheckCircle2,
    Truck,
    Clock,
    XCircle,
    ShieldCheck,
    LogOut
} from "lucide-react";

interface OrderItem {
    id: string;
    product: {
        name: string;
        price: number;
    };
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    customerName: string;
    phone: string;
    address: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'รอดำเนินการ', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    { value: 'PROCESSING', label: 'กำลังเตรียมของ', color: 'bg-blue-100 text-blue-700', icon: RefreshCw },
    { value: 'SHIPPED', label: 'กำลังจัดส่ง', color: 'bg-purple-100 text-purple-700', icon: Truck },
    { value: 'DELIVERED', label: 'ส่งสำเร็จ', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    { value: 'CANCELLED', label: 'ยกเลิก', color: 'bg-red-100 text-red-700', icon: XCircle },
];

import AdminHeader from '@/components/AdminHeader';

export default function AdminOrdersPage() {
    const router = useRouter();
    const { admin, token, isLoading: authLoading, isAuthenticated, logout } = useAdminAuth();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/admin/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                setOrders(data);
            } else {
                console.error('Invalid orders data:', data);
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        setUpdatingId(`${orderId}_${newStatus}`);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                // Update local state
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            } else {
                const errData = await res.json().catch(() => ({}));
                alert(errData.error || 'ไม่สามารถอัปเดตสถานะได้');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredOrders = Array.isArray(orders) ? orders.filter(o => {
        const matchesSearch = (o.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (o.phone || '').includes(searchQuery) ||
            (o.id || '').includes(searchQuery);

        const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;

        const orderDate = new Date(o.createdAt);
        orderDate.setHours(0, 0, 0, 0);

        let matchesDate = true;
        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            filterDate.setHours(0, 0, 0, 0);
            if (orderDate.getTime() !== filterDate.getTime()) matchesDate = false;
        }

        return matchesSearch && matchesStatus && matchesDate;
    }) : [];

    const getStatusInfo = (status: string) => {
        return STATUS_OPTIONS.find(opt => opt.value === status) || STATUS_OPTIONS[0];
    };

    if (authLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8F9FB]">
            <AdminHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/admin"
                            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 hover:border-gray-900 transition-all group"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-gray-900" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                                </div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">จัดการคำสั่งซื้อ</h1>
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-11">Order Fulfillment & Tracking: {orders.length} Orders in Database</p>
                        </div>
                    </div>
                </div>

                {/* Modern Filter Section */}
                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 mb-10 flex flex-col lg:flex-row items-stretch lg:items-center gap-6 ring-4 ring-gray-100/50">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-gray-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อลูกค้า, เบอร์โทร หรือ ID ออร์เดอร์..."
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all font-bold placeholder:font-medium placeholder:text-gray-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <select
                            className="px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all font-bold text-gray-600"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">สถานะทั้งหมด</option>
                            {STATUS_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <div className="relative">
                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 pointer-events-none" />
                            <input
                                type="date"
                                className="pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 transition-all font-bold text-gray-600 appearance-none"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setStatusFilter('ALL');
                                setDateFilter('');
                            }}
                            className="px-6 py-4 bg-white text-gray-400 rounded-2xl font-bold text-sm hover:text-gray-900 border border-gray-100 shadow-sm transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span className="hidden sm:inline">ล้างตัวกรอง</span>
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-8">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 text-accent-500 animate-spin" />
                        </div>
                    ) : filteredOrders.length > 0 ? (
                        filteredOrders.map((order, index) => {
                            const statusInfo = getStatusInfo(order.status);
                            const StatusIcon = statusInfo.icon;

                            const orderDate = new Date(order.createdAt).toLocaleDateString('th-TH', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            });

                            const prevOrderDate = index > 0
                                ? new Date(filteredOrders[index - 1].createdAt).toLocaleDateString('th-TH', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })
                                : null;

                            const showDateDivider = orderDate !== prevOrderDate;

                            return (
                                <div key={order.id} className="space-y-4">
                                    {showDateDivider && (
                                        <div className="flex items-center gap-4 py-4">
                                            <div className="h-[1px] flex-1 bg-gray-200" />
                                            <span className="bg-white px-4 py-1.5 rounded-full border border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-[0.15em] shadow-sm flex items-center gap-2">
                                                <Calendar className="w-3 h-3 text-accent-500" />
                                                {orderDate}
                                            </span>
                                            <div className="h-[1px] flex-1 bg-gray-200" />
                                        </div>
                                    )}

                                    <div className={`bg-white rounded-3xl shadow-sm border transition-all ${expandedOrder === order.id ? 'border-accent-300 ring-4 ring-accent-50' : 'border-gray-100 hover:border-accent-200'}`}>
                                        <div
                                            className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${statusInfo.color.replace('text-', 'text-opacity-80 text-')}`}>
                                                    <Package className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400 font-medium mb-1">รหัสออเดอร์: #{order.id.slice(-6).toUpperCase()}</p>
                                                    <h3 className="text-xl font-black text-gray-900">{order.customerName}</h3>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 md:gap-12">
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">เวลาที่สั่ง</p>
                                                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                                                        <Clock className="w-4 h-4 text-accent-500" />
                                                        {new Date(order.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">ยอดรวม</p>
                                                    <p className="text-lg font-black text-accent-600">฿{order.totalAmount.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">สถานะ</p>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 ${statusInfo.color}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                                <div className={`transition-transform duration-300 ${expandedOrder === order.id ? 'rotate-180' : ''}`}>
                                                    <ChevronDown className="w-6 h-6 text-gray-300" />
                                                </div>
                                            </div>
                                        </div>

                                        {expandedOrder === order.id && (
                                            <div className="px-8 pb-8 animate-in slide-in-from-top-4 duration-300">
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-8 border-t border-gray-50">
                                                    {/* Details */}
                                                    <div className="lg:col-span-1 space-y-6">
                                                        <div>
                                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">ข้อมูลการจัดส่ง</h4>
                                                            <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                                                                <div className="flex items-center gap-3 text-gray-700 font-bold">
                                                                    <User className="w-5 h-5 text-accent-500" />
                                                                    {order.customerName}
                                                                </div>
                                                                <div className="flex items-center gap-3 text-gray-700 font-medium">
                                                                    <Phone className="w-5 h-5 text-accent-500" />
                                                                    {order.phone}
                                                                </div>
                                                                <div className="flex items-start gap-3 text-gray-700 font-medium">
                                                                    <MapPin className="w-5 h-5 text-accent-500 mt-1" />
                                                                    <span className="flex-1">{order.address}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Status Update */}
                                                        <div>
                                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">อัปเดตสถานะออเดอร์</h4>
                                                            <div className="space-y-2">
                                                                {STATUS_OPTIONS.map((opt, idx) => {
                                                                    const isCurrent = order.status === opt.value;
                                                                    const currentIdx = STATUS_OPTIONS.findIndex(s => s.value === order.status);
                                                                    const isNext = idx === currentIdx + 1;
                                                                    const isPassed = idx < currentIdx;
                                                                    const isUpdating = updatingId === `${order.id}_${opt.value}`;
                                                                    const isAnyUpdating = updatingId?.startsWith(order.id);

                                                                    return (
                                                                        <button
                                                                            key={opt.value}
                                                                            disabled={isCurrent || (isAnyUpdating && !isUpdating)}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                if (!isCurrent) {
                                                                                    if (opt.value === 'CANCELLED') {
                                                                                        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกออเดอร์นี้?')) {
                                                                                            handleUpdateStatus(order.id, opt.value);
                                                                                        }
                                                                                    } else {
                                                                                        handleUpdateStatus(order.id, opt.value);
                                                                                    }
                                                                                }
                                                                            }}
                                                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all border
                                                                                ${isCurrent
                                                                                    ? `${opt.color} border-current ring-2 ring-offset-1 ring-current/20 cursor-default`
                                                                                    : isPassed
                                                                                        ? 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100 line-through'
                                                                                        : isNext
                                                                                            ? 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 shadow-sm'
                                                                                            : opt.value === 'CANCELLED'
                                                                                                ? 'bg-white text-gray-400 border-gray-100 hover:border-red-300 hover:bg-red-50 hover:text-red-600'
                                                                                                : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600'
                                                                                }
                                                                                ${(isAnyUpdating && !isUpdating) ? 'opacity-50 cursor-not-allowed' : ''}
                                                                            `}
                                                                        >
                                                                            {isUpdating ? (
                                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                            ) : isCurrent ? (
                                                                                <CheckCircle2 className="w-4 h-4" />
                                                                            ) : (
                                                                                <opt.icon className="w-4 h-4" />
                                                                            )}
                                                                            <span className="flex-1 text-left">{opt.label}</span>
                                                                            {isCurrent && (
                                                                                <span className="text-[10px] font-black uppercase tracking-wider opacity-70">ปัจจุบัน</span>
                                                                            )}
                                                                            {isNext && !isCurrent && (
                                                                                <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">ถัดไป →</span>
                                                                            )}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Items */}
                                                    <div className="lg:col-span-2">
                                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">รายการสินค้า</h4>
                                                        <div className="bg-gray-50 p-8 rounded-[2rem] space-y-4">
                                                            {order.items.map((item) => (
                                                                <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-brand-50">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center font-black text-brand-900 text-sm">
                                                                            {item.quantity}
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-gray-900 font-bold block">{item.product.name}</span>
                                                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter italic">Siam Sausage Quality</span>
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-gray-900 font-black">฿{(item.price * item.quantity).toLocaleString()}</span>
                                                                </div>
                                                            ))}
                                                            <div className="pt-6 mt-4 border-t border-gray-200">
                                                                <div className="flex justify-between items-center text-sm font-bold text-gray-500 mb-2">
                                                                    <span>ค่าจัดส่ง (Standard Delivery)</span>
                                                                    <span>฿40</span>
                                                                </div>
                                                                <div className="flex justify-between items-center text-2xl font-black">
                                                                    <span className="text-brand-900">ยอดสุทธิ</span>
                                                                    <span className="text-accent-600">฿{order.totalAmount.toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                            <ShoppingBag className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                            <h3 className="text-xl font-black text-gray-900 mb-2">ไม่พบประวัติการสั่งซื้อ</h3>
                            <p className="text-gray-400 font-bold">เมื่อมีการสั่งซื้อ ข้อมูลจะมาปรากฏที่นี่</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
