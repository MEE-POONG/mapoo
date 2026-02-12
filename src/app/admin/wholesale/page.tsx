'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';
import {
    TrendingUp,
    Plus,
    Edit2,
    Trash2,
    ChevronLeft,
    Loader2,
    ShieldCheck,
    LogOut,
    Check,
    X,
    LayoutGrid,
    Flame,
    DollarSign,
    Box
} from 'lucide-react';

interface WholesaleRate {
    id: string;
    minQuantity: number;
    pricePerKg: number;
    costPerUnit?: number;
    discountLabel?: string;
    isPopular: boolean;
}

export default function AdminWholesalePage() {
    const router = useRouter();
    const { admin, token, isLoading: authLoading, isAuthenticated, logout } = useAdminAuth();
    const [rates, setRates] = useState<WholesaleRate[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingRate, setEditingRate] = useState<WholesaleRate | null>(null);

    const [formData, setFormData] = useState({
        minQuantity: '',
        pricePerKg: '',
        costPerUnit: '',
        discountLabel: '',
        isPopular: false
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/admin/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchRates();
        }
    }, [isAuthenticated]);

    const fetchRates = async () => {
        try {
            const res = await fetch('/api/admin/wholesale', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            setRates(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching wholesale rates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (rate: WholesaleRate | null = null) => {
        if (rate) {
            setEditingRate(rate);
            setFormData({
                minQuantity: rate.minQuantity.toString(),
                pricePerKg: rate.pricePerKg.toString(),
                costPerUnit: rate.costPerUnit?.toString() || '',
                discountLabel: rate.discountLabel || '',
                isPopular: rate.isPopular
            });
        } else {
            setEditingRate(null);
            setFormData({
                minQuantity: '',
                pricePerKg: '',
                costPerUnit: '',
                discountLabel: '',
                isPopular: false
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const url = editingRate
                ? `/api/admin/wholesale/${editingRate.id}`
                : '/api/admin/wholesale';
            const method = editingRate ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchRates();
            } else {
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
        } catch (error) {
            console.error('Error saving wholesale rate:', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('ยืนยันการลบเรทราคานี้?')) return;
        try {
            const res = await fetch(`/api/admin/wholesale/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                fetchRates();
            } else {
                alert('เกิดข้อผิดพลาดในการลบข้อมูล');
            }
        } catch (error) {
            console.error('Error deleting wholesale rate:', error);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
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
                                    <TrendingUp className="w-4 h-4 text-blue-600" />
                                </div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">จัดการราคาขายส่ง</h1>
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-11">Bulk Pricing & Volume Discounts: {rates.length} Active Tiers</p>
                        </div>
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-gray-900 text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-gray-200"
                    >
                        <Plus className="w-6 h-6" />
                        เพิ่มช่วงราคา
                    </button>
                </div>

                {/* Rates List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-12 h-12 text-brand-900 animate-spin" />
                    </div>
                ) : rates.length === 0 ? (
                    <div className="bg-white rounded-[3rem] border border-gray-100 p-24 text-center shadow-lg shadow-gray-100/50">
                        <TrendingUp className="w-20 h-20 text-gray-100 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-gray-900 mb-2">ยังไม่มีข้อมูลเรทราคาส่ง</h3>
                        <p className="text-gray-400 font-medium mb-8 max-w-sm mx-auto">เริ่มสร้างเรทราคาส่งของคุณเพื่อจูงใจให้ลูกค้าสั่งซื้อในปริมาณที่มากขึ้น</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-brand-50 text-brand-900 px-8 py-4 rounded-2xl font-black inline-flex items-center gap-2 hover:bg-brand-100 transition-colors"
                        >
                            <Plus className="w-5 h-5" /> สร้างรายการแรก
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rates.map((rate) => (
                            <div
                                key={rate.id}
                                className={`bg-white rounded-[2.5rem] border overflow-hidden transition-all duration-500 group relative ${rate.isPopular ? 'border-amber-400 ring-4 ring-amber-50 shadow-2xl shadow-amber-100/50' : 'border-gray-100 shadow-sm hover:shadow-xl'}`}
                            >
                                {rate.isPopular && (
                                    <div className="absolute top-6 right-6 z-10">
                                        <div className="bg-amber-400 text-white text-[10px] font-black px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-amber-400/30">
                                            <Flame className="w-3.5 h-3.5" /> POPULAR
                                        </div>
                                    </div>
                                )}

                                <div className="p-8 pb-4">
                                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-900 mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <LayoutGrid className="w-7 h-7" />
                                    </div>

                                    <div className="mb-8">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-2">ปริมาณขั้นต่ำ</p>
                                        <h3 className="text-4xl font-black text-gray-900 tracking-tighter">
                                            {rate.minQuantity}+ <span className="text-base font-bold text-gray-400 tracking-normal ml-1">กิโลกรัม</span>
                                        </h3>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100/50 group-hover:bg-green-100 transition-colors duration-500">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center">
                                                    <DollarSign className="w-5 h-5" />
                                                </div>
                                                <span className="text-sm font-black text-green-700">ราคาส่ง</span>
                                            </div>
                                            <span className="text-2xl font-black text-green-600">฿{rate.pricePerKg}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-white transition-colors duration-500">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center">
                                                    <Box className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-bold text-gray-600">ต้นทุนเฉลี่ย</span>
                                            </div>
                                            <span className="text-lg font-bold text-gray-900">฿{rate.costPerUnit || '0'}</span>
                                        </div>

                                        {rate.discountLabel && (
                                            <div className="bg-amber-50 px-4 py-3 rounded-xl border border-amber-100 text-amber-700 text-xs font-black uppercase tracking-wider text-center">
                                                {rate.discountLabel}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="px-8 pb-8 flex gap-3">
                                    <button
                                        onClick={() => handleOpenModal(rate)}
                                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-brand-900 transition-all hover:shadow-lg active:scale-95"
                                    >
                                        <Edit2 className="w-4 h-4" /> แก้ไขข้อมูล
                                    </button>
                                    <button
                                        onClick={() => handleDelete(rate.id)}
                                        className="w-16 h-[52px] flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-red-200"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl ring-1 ring-white/20 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                        <div className="p-10">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                                        {editingRate ? 'แก้ไขเรทราคา' : 'เพิ่มเรทราคาใหม่'}
                                    </h2>
                                    <p className="text-gray-400 font-medium">ระบุเงื่อนไขและราคาสำหรับยอดสั่งซื้อปริมาณมาก</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 hover:text-gray-900 transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">จำนวนขั้นต่ำ (กก.)</label>
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center text-brand-900 ring-1 ring-brand-100 group-focus-within:bg-brand-900 group-focus-within:text-white transition-all">
                                                <Box className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="number"
                                                required
                                                value={formData.minQuantity}
                                                onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                                                className="w-full pl-16 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-900/5 focus:bg-white focus:border-brand-900 transition-all font-bold text-gray-900"
                                                placeholder="เข่น 20"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">ราคาต่อกิโลกรัม (฿)</label>
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600 ring-1 ring-green-100 group-focus-within:bg-green-500 group-focus-within:text-white transition-all">
                                                <DollarSign className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={formData.pricePerKg}
                                                onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
                                                className="w-full pl-16 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/5 focus:bg-white focus:border-green-600 transition-all font-bold text-gray-900"
                                                placeholder="เช่น 155"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">ต้นทุนต่อหน่วย (฿)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.costPerUnit}
                                            onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:bg-white focus:border-gray-900 transition-all font-bold text-gray-900"
                                            placeholder="ไม่บังคับ"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">ชื่อส่วนลด / โปรโมชั่น</label>
                                        <input
                                            type="text"
                                            value={formData.discountLabel}
                                            onChange={(e) => setFormData({ ...formData, discountLabel: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:bg-white focus:border-gray-900 transition-all font-bold text-gray-900"
                                            placeholder="เช่น ส่วนลด 15%"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-amber-50/50 p-6 rounded-3xl border border-amber-100/50">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isPopular: !formData.isPopular })}
                                        className={`w-14 h-8 rounded-full transition-all relative flex items-center px-1 ${formData.isPopular ? 'bg-amber-400' : 'bg-gray-200'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full bg-white shadow-lg transition-all ${formData.isPopular ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                    <div>
                                        <p className="text-sm font-black text-amber-900">แนะนำรายการนี้ (Popular)</p>
                                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Highlight this rate on price list</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-5 bg-gray-50 text-gray-500 rounded-[2rem] font-black transition-all hover:bg-gray-100"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-[2] py-5 bg-black text-white rounded-[2rem] font-black shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {submitting ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <Check className="w-6 h-6" />
                                        )}
                                        บันทึกข้อมูล
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
