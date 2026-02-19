'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from 'next/link';
import {
    Search, Loader2, Package, Phone, Clock,
    CheckCircle, Truck, XCircle, ArrowLeft, Hash
} from "lucide-react";

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

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType; step: number }> = {
    PENDING: {
        label: 'รอดำเนินการ',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50 border-amber-200',
        icon: Clock,
        step: 1
    },
    PROCESSING: {
        label: 'กำลังเตรียมของ',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 border-blue-200',
        icon: CheckCircle,
        step: 2
    },
    SHIPPED: {
        label: 'กำลังจัดส่ง',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 border-purple-200',
        icon: Truck,
        step: 3
    },
    DELIVERED: {
        label: 'ส่งสำเร็จ',
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200',
        icon: CheckCircle,
        step: 4
    },
    CANCELLED: {
        label: 'ยกเลิก',
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200',
        icon: XCircle,
        step: 0
    }
};

const steps = [
    { key: 'PENDING', label: 'รอดำเนินการ', icon: Clock },
    { key: 'PROCESSING', label: 'กำลังเตรียมของ', icon: CheckCircle },
    { key: 'SHIPPED', label: 'กำลังจัดส่ง', icon: Truck },
    { key: 'DELIVERED', label: 'ส่งสำเร็จ', icon: Package },
];

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [phone, setPhone] = useState('');
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setOrder(null);

        if (!orderId || !phone) {
            setError('กรุณากรอกหมายเลขออเดอร์และเบอร์โทรศัพท์');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/orders/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, phone })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'ไม่พบออเดอร์');
            } else {
                setOrder(data.order);
            }
        } catch {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setLoading(false);
        }
    };

    const currentStep = order ? (statusConfig[order.status]?.step || 0) : 0;
    const isCancelled = order?.status === 'CANCELLED';

    return (
        <div className="min-h-screen bg-brand-50">
            <Navbar />

            <main className="max-w-3xl mx-auto px-4 pt-28 pb-16">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-500 to-brand-600 rounded-2xl mb-4 shadow-lg shadow-accent-500/30">
                        <Search className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-brand-900">ติดตามสถานะออเดอร์</h1>
                    <p className="text-brand-600 mt-2">กรอกหมายเลขออเดอร์และเบอร์โทรศัพท์เพื่อตรวจสอบสถานะ</p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleTrack} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-brand-900/10 p-8 border border-white/50 mb-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-brand-700 mb-2">หมายเลขออเดอร์</label>
                            <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                                <input
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="เช่น A1B2C3"
                                    className="w-full pl-12 pr-4 py-3 bg-brand-50/50 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-700 mb-2">เบอร์โทรศัพท์</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="เบอร์โทรที่ใช้สั่งซื้อ"
                                    className="w-full pl-12 pr-4 py-3 bg-brand-50/50 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-200">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-accent-500 to-brand-600 text-white font-semibold rounded-xl hover:from-accent-600 hover:to-brand-700 disabled:opacity-50 transition-all shadow-lg shadow-accent-500/30 hover:shadow-xl hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <span className="inline-flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    กำลังค้นหา...
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2">
                                    <Search className="w-5 h-5" />
                                    ค้นหาออเดอร์
                                </span>
                            )}
                        </button>
                    </div>
                </form>

                {/* Order Result */}
                {order && (
                    <div className="bg-white rounded-3xl shadow-xl shadow-brand-900/10 p-8 border border-brand-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Order Header */}
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                            <div>
                                <p className="text-sm text-brand-500">ออเดอร์ #{order.id.slice(-8).toUpperCase()}</p>
                                <h2 className="text-xl font-bold text-brand-900 mt-1">{order.customerName}</h2>
                                <p className="text-sm text-brand-500 mt-1">
                                    {new Date(order.createdAt).toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${statusConfig[order.status]?.bgColor} ${statusConfig[order.status]?.color}`}>
                                {(() => {
                                    const StatusIcon = statusConfig[order.status]?.icon || Clock;
                                    return <StatusIcon className="w-4 h-4" />;
                                })()}
                                <span className="font-bold">{statusConfig[order.status]?.label || order.status}</span>
                            </div>
                        </div>

                        {/* Progress Steps */}
                        {!isCancelled && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between relative">
                                    {/* Progress Line */}
                                    <div className="absolute top-5 left-0 right-0 h-1 bg-brand-100 rounded-full" />
                                    <div
                                        className="absolute top-5 left-0 h-1 bg-gradient-to-r from-accent-500 to-green-500 rounded-full transition-all duration-700"
                                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                                    />

                                    {steps.map((step, idx) => {
                                        const isCompleted = currentStep > idx + 1;
                                        const isCurrent = currentStep === idx + 1;

                                        return (
                                            <div key={step.key} className="relative flex flex-col items-center z-10">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCompleted
                                                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                                    : isCurrent
                                                        ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30 ring-4 ring-accent-100'
                                                        : 'bg-brand-100 text-brand-400'
                                                    }`}>
                                                    <step.icon className="w-5 h-5" />
                                                </div>
                                                <span className={`mt-2 text-xs font-bold text-center ${isCurrent ? 'text-accent-600' : isCompleted ? 'text-green-600' : 'text-brand-400'}`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Order Items */}
                        <div className="border-t border-brand-100 pt-6">
                            <h3 className="font-bold text-brand-800 mb-4">รายการสินค้า</h3>
                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-3 bg-brand-50 rounded-xl">
                                        <div className="w-14 h-14 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-brand-100">
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
                                        <p className="font-bold text-brand-900">
                                            ฿{(item.quantity * item.price).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="mt-6 pt-6 border-t border-brand-100 flex justify-between items-center">
                            <div>
                                {order.discountCode && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-sm font-medium">
                                        โค้ด: {order.discountCode}
                                        {order.discountAmount && order.discountAmount > 0 && (
                                            <span>(-฿{order.discountAmount.toLocaleString()})</span>
                                        )}
                                    </span>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-brand-500">ยอดรวมทั้งสิ้น</p>
                                <p className="text-2xl font-black text-accent-600">
                                    ฿{order.totalAmount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
