'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';
import {
    Ticket,
    Plus,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Loader2,
    RefreshCw,
    Search,
    Calendar,
    Percent,
    DollarSign,
    Info,
    CheckCircle2,
    XCircle,
    Copy,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    Pencil,
    ShieldCheck,
    LogOut
} from "lucide-react";

interface Discount {
    id: string;
    code: string;
    description: string | null;
    discountValue: number;
    type: string;
    minPurchaseAmount: number | null;
    userUsageLimit: number | null;
    isActive: boolean;
    usageLimit: number | null;
    usedCount: number;
    startDate: string | null;
    endDate: string | null;
    createdAt: string;
    updatedAt: string;
}

export default function AdminDiscountsPage() {
    const router = useRouter();
    const { admin, token, isLoading: authLoading, isAuthenticated, logout } = useAdminAuth();

    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountValue: '',
        type: 'PERCENTAGE',
        minPurchaseAmount: '',
        userUsageLimit: '1',
        isActive: true,
        usageLimit: '',
        startDate: '',
        endDate: ''
    });

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/admin/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchDiscounts();
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
    };

    const fetchDiscounts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/discounts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setDiscounts(data);
        } catch (error) {
            console.error('Error fetching discounts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const url = editingId
                ? `/api/admin/discounts/${editingId}`
                : '/api/admin/discounts';
            const method = editingId ? 'PATCH' : 'POST';

            // Convert numeric fields
            const dataToSubmit = {
                ...formData,
                discountValue: parseFloat(formData.discountValue),
                minPurchaseAmount: formData.minPurchaseAmount ? parseFloat(formData.minPurchaseAmount) : 0,
                userUsageLimit: formData.userUsageLimit ? parseInt(formData.userUsageLimit) : null,
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSubmit),
            });

            if (res.ok) {
                const savedDiscount = await res.json();
                if (editingId) {
                    setDiscounts(discounts.map(d => d.id === editingId ? savedDiscount : d));
                } else {
                    setDiscounts([savedDiscount, ...discounts]);
                }
                setIsAdding(false);
                setEditingId(null);
                resetForm();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to save discount');
            }
        } catch (error) {
            console.error('Error saving discount:', error);
            alert('Failed to save discount');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            code: '',
            description: '',
            discountValue: '',
            type: 'PERCENTAGE',
            minPurchaseAmount: '',
            userUsageLimit: '1',
            isActive: true,
            usageLimit: '',
            startDate: '',
            endDate: ''
        });
    };

    const handleEdit = (discount: any) => {
        setEditingId(discount.id);
        setFormData({
            code: discount.code,
            description: discount.description || '',
            discountValue: discount.discountValue.toString(),
            type: discount.type,
            minPurchaseAmount: discount.minPurchaseAmount?.toString() || '',
            userUsageLimit: discount.userUsageLimit?.toString() || '1',
            isActive: discount.isActive,
            usageLimit: discount.usageLimit?.toString() || '',
            startDate: discount.startDate ? discount.startDate.split('T')[0] : '',
            endDate: discount.endDate ? discount.endDate.split('T')[0] : ''
        });
        setIsAdding(true);
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/admin/discounts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ isActive: !currentStatus }),
            });

            if (res.ok) {
                setDiscounts(discounts.map(d => d.id === id ? { ...d, isActive: !currentStatus } : d));
            }
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโค้ดส่วนลดนี้?')) return;

        try {
            const res = await fetch(`/api/admin/discounts/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setDiscounts(discounts.filter(d => d.id !== id));
            }
        } catch (error) {
            console.error('Error deleting discount:', error);
        }
    };

    const filteredDiscounts = discounts.filter(d =>
        d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (authLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
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
                            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <Ticket className="w-7 h-7 text-amber-600" />
                                จัดการโค้ดส่วนลด
                            </h1>
                            <p className="text-gray-500">โค้ดทั้งหมด {discounts.length} รายการ</p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setIsAdding(!isAdding);
                            if (isAdding) {
                                setEditingId(null);
                                resetForm();
                            }
                        }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg ${isAdding
                            ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-amber-500/30'
                            }`}
                    >
                        {isAdding ? <XCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        {isAdding ? 'ยกเลิก' : 'สร้างโค้ดส่วนลดใหม่'}
                    </button>
                </div>

                {isAdding && (
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-accent-100 mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 mb-2">
                                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                    {editingId ? <Pencil className="w-5 h-5 text-accent-500" /> : <Plus className="w-5 h-5 text-accent-500" />}
                                    {editingId ? 'แก้ไขข้อมูลส่วนลด' : 'สร้างส่วนลดใหม่'}
                                </h3>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">รหัสโค้ดส่วนลด *</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="เช่น NEWYEAR2024"
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent-500 transition-all font-bold text-gray-900 uppercase"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">คำอธิบาย</label>
                                <input
                                    type="text"
                                    placeholder="เช่น ส่วนลดพิเศษสำหรับปีใหม่"
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent-500 transition-all font-bold text-gray-900"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">ประเภท</label>
                                    <select
                                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent-500 transition-all font-bold text-gray-900"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="PERCENTAGE">เปอร์เซ็นต์ (%)</option>
                                        <option value="FIXED">จำนวนเงินคงที่ (฿)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">
                                        {formData.type === 'PERCENTAGE' ? 'เปอร์เซ็นต์ส่วนลด *' : 'จำนวนเงินที่ลด *'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            required
                                            type="number"
                                            step="0.01"
                                            placeholder={formData.type === 'PERCENTAGE' ? '10' : '100'}
                                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent-500 transition-all font-bold text-gray-900"
                                            value={formData.discountValue}
                                            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                        />
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                                            {formData.type === 'PERCENTAGE' ? <Percent className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">จำนวนจำกัดรวม (เว้นว่างไว้หากไม่จำกัด)</label>
                                    <input
                                        type="number"
                                        placeholder="เช่น 100"
                                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent-500 transition-all font-bold text-gray-900"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">ยอดซื้อขั้นต่ำ (฿)</label>
                                    <input
                                        type="number"
                                        placeholder="เช่น 500"
                                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent-500 transition-all font-bold text-gray-900"
                                        value={formData.minPurchaseAmount}
                                        onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">จำนวนครั้งที่ใช้ได้ต่อคน (เว้นว่างไว้หากไม่จำกัด)</label>
                                <input
                                    type="number"
                                    placeholder="เช่น 1"
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent-500 transition-all font-bold text-gray-900"
                                    value={formData.userUsageLimit}
                                    onChange={(e) => setFormData({ ...formData, userUsageLimit: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">วันที่เริ่ม</label>
                                    <input
                                        type="date"
                                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent-500 transition-all font-bold text-gray-900"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">วันที่สิ้นสุด</label>
                                    <input
                                        type="date"
                                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent-500 transition-all font-bold text-gray-900"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 flex justify-end pt-4">
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="bg-accent-500 text-white px-10 py-4 rounded-2xl font-black text-base hover:bg-accent-600 transition-all shadow-lg shadow-accent-200 flex items-center gap-3"
                                >
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                    {editingId ? 'บันทึกการแก้ไข' : 'สร้างโค้ดส่วนลด'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Search & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                    <div className="lg:col-span-3 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <Search className="w-6 h-6 text-gray-300" />
                        <input
                            type="text"
                            placeholder="ค้นหาโค้ดส่วนลดหรือคำอธิบาย..."
                            className="bg-transparent border-none focus:ring-0 w-full font-bold text-gray-900"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="text-gray-300 hover:text-gray-500">
                                <XCircle className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ทั้งหมด</p>
                            <p className="text-2xl font-black text-gray-900">{discounts.length}</p>
                        </div>
                        <Ticket className="w-10 h-10 text-accent-100" />
                    </div>
                </div>

                {/* Discounts List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full flex justify-center py-20">
                            <Loader2 className="w-12 h-12 text-accent-500 animate-spin" />
                        </div>
                    ) : filteredDiscounts.length > 0 ? (
                        filteredDiscounts.map((discount) => (
                            <div key={discount.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-accent-200 transition-all group">
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="bg-accent-50 text-accent-700 px-4 py-2 rounded-xl text-xl font-black tracking-wider flex items-center gap-2">
                                            {discount.code}
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(discount.code);
                                                    alert('คัดลอกโค้ดแล้ว!');
                                                }}
                                                className="hover:text-accent-900 transition-colors"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleToggleActive(discount.id, discount.isActive)}
                                            className={`transition-colors ${discount.isActive ? 'text-green-500' : 'text-gray-300'}`}
                                        >
                                            {discount.isActive ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                                        </button>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-4xl font-black text-gray-900">
                                                {discount.type === 'PERCENTAGE' ? `${discount.discountValue}%` : `฿${discount.discountValue}`}
                                            </span>
                                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">ส่วนลด</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-500 italic mb-4">
                                            {discount.description || 'ไม่มีคำอธิบาย'}
                                        </p>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">เงื่อนไขการใช้</p>
                                            <p className="text-sm font-bold text-gray-700">
                                                {discount.usageLimit ? `จำกัด ${discount.usageLimit} ครั้ง` : 'ไม่จำกัดจำนวน'}
                                                {(discount.minPurchaseAmount || 0) > 0 && ` • ขั้นต่ำ ฿${discount.minPurchaseAmount?.toLocaleString()}`}
                                                {discount.userUsageLimit && ` • คนละ ${discount.userUsageLimit} ครั้ง`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-gray-50">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-400 font-bold uppercase flex items-center gap-1.5">
                                                <RefreshCw className="w-3 h-3 text-blue-500" /> การใช้งาน
                                            </span>
                                            <span className="font-black text-gray-700">
                                                {discount.usedCount} / {discount.usageLimit || 'ไม่จำกัด'} ครั้ง
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-400 font-bold uppercase flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3 text-orange-500" /> ระยะเวลา
                                            </span>
                                            <span className="font-black text-gray-700">
                                                {discount.startDate ? new Date(discount.startDate).toLocaleDateString('th-TH') : 'เริ่มทันที'} - {discount.endDate ? new Date(discount.endDate).toLocaleDateString('th-TH') : 'ไม่มีกำหนด'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-400 font-bold uppercase flex items-center gap-1.5">
                                                <Info className="w-3 h-3 text-purple-500" /> สถานะ
                                            </span>
                                            <span className={`font-black uppercase flex items-center gap-1.5 ${discount.isActive ? 'text-green-600' : 'text-red-500'}`}>
                                                {discount.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                {discount.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end gap-3">
                                        <button
                                            onClick={() => handleEdit(discount)}
                                            className="text-gray-300 hover:text-accent-500 transition-colors p-2 hover:bg-accent-50 rounded-xl"
                                            title="แก้ไข"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(discount.id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl"
                                            title="ลบ"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <Ticket className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                            <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">ไม่พบโค้ดส่วนลด</h3>
                            <p className="text-gray-500 font-medium italic">เริ่มต้นสร้างโค้ดส่วนลดแรกของคุณเพื่อกระตุ้นยอดขาย</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
