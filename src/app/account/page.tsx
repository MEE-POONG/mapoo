'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
    User, Package, MapPin, Phone, Mail, LogOut,
    ArrowLeft, Loader2, Clock, CheckCircle, Truck,
    XCircle, Edit3, Save, X
} from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        id: string;
        name: string;
        imageUrl: string;
        unit: string;
    };
}

interface Order {
    id: string;
    customerName: string;
    phone: string;
    address: string | null;
    totalAmount: number;
    discountCode: string | null;
    discountAmount: number | null;
    status: string;
    items: OrderItem[];
    createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
    PENDING: {
        label: 'รอดำเนินการ',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50 border-amber-200',
        icon: Clock
    },
    CONFIRMED: {
        label: 'ยืนยันแล้ว',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 border-blue-200',
        icon: CheckCircle
    },
    SHIPPING: {
        label: 'กำลังจัดส่ง',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 border-purple-200',
        icon: Truck
    },
    DELIVERED: {
        label: 'จัดส่งสำเร็จ',
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200',
        icon: CheckCircle
    },
    CANCELLED: {
        label: 'ยกเลิก',
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200',
        icon: XCircle
    }
};

export default function AccountPage() {
    const router = useRouter();
    const { customer, token, isLoading: authLoading, logout, updateProfile } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: '',
        phone: '',
        address: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const fetchOrders = useCallback(async () => {
        if (!token) return;

        try {
            const res = await fetch('/api/customer/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoadingOrders(false);
        }
    }, [token]);

    useEffect(() => {
        if (!authLoading && !customer) {
            router.push('/login');
        }
    }, [authLoading, customer, router]);

    useEffect(() => {
        if (customer) {
            setEditData({
                name: customer.name || '',
                phone: customer.phone || '',
                address: customer.address || ''
            });
        }
    }, [customer]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        const result = await updateProfile(editData);
        setIsSaving(false);

        if (result.success) {
            setIsEditing(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-50">
                <Loader2 className="w-8 h-8 text-accent-500 animate-spin" />
            </div>
        );
    }

    if (!customer) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-brand-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 group transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>กลับหน้าหลัก</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>ออกจากระบบ</span>
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-accent-500 to-brand-600 rounded-3xl p-8 text-white mb-8 shadow-xl shadow-accent-500/20">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                            <User className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">สวัสดี, {customer.name}!</h1>
                            <p className="text-white/80">ยินดีต้อนรับเข้าสู่บัญชีของคุณ</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'orders'
                                ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30'
                                : 'bg-white text-brand-600 hover:bg-brand-50'
                            }`}
                    >
                        <span className="inline-flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            คำสั่งซื้อของฉัน
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'profile'
                                ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30'
                                : 'bg-white text-brand-600 hover:bg-brand-50'
                            }`}
                    >
                        <span className="inline-flex items-center gap-2">
                            <User className="w-5 h-5" />
                            ข้อมูลส่วนตัว
                        </span>
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'orders' ? (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-brand-900">ประวัติคำสั่งซื้อ</h2>

                        {isLoadingOrders ? (
                            <div className="bg-white rounded-2xl p-8 text-center">
                                <Loader2 className="w-8 h-8 text-accent-500 animate-spin mx-auto" />
                                <p className="text-brand-600 mt-2">กำลังโหลด...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center">
                                <Package className="w-16 h-16 text-brand-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-brand-700 mb-2">ยังไม่มีคำสั่งซื้อ</h3>
                                <p className="text-brand-500 mb-6">เริ่มช้อปปิ้งเพื่อสร้างคำสั่งซื้อแรกของคุณ</p>
                                <Link
                                    href="/products"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition-colors"
                                >
                                    ไปหน้าสินค้า
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => {
                                    const status = statusConfig[order.status] || statusConfig.PENDING;
                                    const StatusIcon = status.icon;

                                    return (
                                        <div
                                            key={order.id}
                                            className="bg-white rounded-2xl p-6 shadow-lg shadow-brand-900/5 border border-brand-100"
                                        >
                                            {/* Order Header */}
                                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm text-brand-500 mb-1">
                                                        คำสั่งซื้อ #{order.id.slice(-8).toUpperCase()}
                                                    </p>
                                                    <p className="text-sm text-brand-500">
                                                        {format(new Date(order.createdAt), 'dd MMMM yyyy เวลา HH:mm น.', { locale: th })}
                                                    </p>
                                                </div>
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${status.bgColor} ${status.color}`}>
                                                    <StatusIcon className="w-4 h-4" />
                                                    <span className="font-medium">{status.label}</span>
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            <div className="border-t border-b border-brand-100 py-4 mb-4">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="flex items-center gap-4 py-2">
                                                        <div className="w-16 h-16 bg-brand-100 rounded-xl overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={item.product.imageUrl}
                                                                alt={item.product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-brand-900 truncate">{item.product.name}</p>
                                                            <p className="text-sm text-brand-500">
                                                                {item.quantity} {item.product.unit} x ฿{item.price.toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <p className="font-semibold text-brand-900">
                                                            ฿{(item.quantity * item.price).toLocaleString()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Order Total */}
                                            <div className="flex justify-between items-center">
                                                <div className="text-sm text-brand-600">
                                                    {order.discountCode && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-lg">
                                                            ใช้โค้ด: {order.discountCode}
                                                            {order.discountAmount && order.discountAmount > 0 && (
                                                                <span>(-฿{order.discountAmount.toLocaleString()})</span>
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-brand-500">ยอดรวม</p>
                                                    <p className="text-xl font-bold text-accent-600">
                                                        ฿{order.totalAmount.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-brand-900/5 border border-brand-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-brand-900">ข้อมูลส่วนตัว</h2>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-accent-600 hover:bg-accent-50 rounded-xl transition-colors"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    แก้ไข
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditData({
                                                name: customer.name || '',
                                                phone: customer.phone || '',
                                                address: customer.address || ''
                                            });
                                        }}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        ยกเลิก
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={isSaving}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition-colors disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        บันทึก
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            {/* Name */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-accent-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-brand-500 mb-1">ชื่อ-นามสกุล</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-4 py-2 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
                                        />
                                    ) : (
                                        <p className="font-medium text-brand-900">{customer.name}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-accent-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-brand-500 mb-1">อีเมล</p>
                                    <p className="font-medium text-brand-900">{customer.email}</p>
                                    <p className="text-xs text-brand-400 mt-1">(ไม่สามารถเปลี่ยนได้)</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5 text-accent-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-brand-500 mb-1">เบอร์โทรศัพท์</p>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={editData.phone}
                                            onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                                            className="w-full px-4 py-2 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
                                            placeholder="กรอกเบอร์โทรศัพท์"
                                        />
                                    ) : (
                                        <p className="font-medium text-brand-900">{customer.phone || '-'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-accent-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-brand-500 mb-1">ที่อยู่จัดส่ง</p>
                                    {isEditing ? (
                                        <textarea
                                            value={editData.address}
                                            onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                                            className="w-full px-4 py-2 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
                                            rows={3}
                                            placeholder="กรอกที่อยู่จัดส่ง"
                                        />
                                    ) : (
                                        <p className="font-medium text-brand-900">{customer.address || '-'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
