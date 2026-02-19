'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';
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
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
        <main className="min-h-screen bg-[#F8F9FB]">
            <AdminHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 mb-6 md:mb-10">
                    <div className="flex items-center gap-4 md:gap-6">
                        <Link href="/admin" className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm hover:border-gray-900 transition-all group">
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-gray-900" />
                        </Link>
                        <div>
                            <h1 className="text-xl md:text-3xl font-black text-gray-900 flex items-center gap-2 md:gap-3 tracking-tight">
                                <Ticket className="w-6 h-6 md:w-8 md:h-8 text-amber-500" />
                                จัดการโค้ดส่วนลด
                            </h1>
                            <p className="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-wider">Total {discounts.length} Active Vouchers</p>
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
                        className={`flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-[1.5rem] font-black text-sm md:text-base transition-all shadow-lg ${isAdding
                            ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            : 'bg-gray-900 text-white hover:scale-[1.02]'
                            }`}
                    >
                        {isAdding ? <XCircle className="w-4 h-4 md:w-5 md:h-5" /> : <Plus className="w-4 h-4 md:w-5 md:h-5" />}
                        {isAdding ? 'ยกเลิก' : 'สร้างส่วนลดใหม่'}
                    </button>
                </div>

                {isAdding && (
                    <div className="bg-white p-5 md:p-10 rounded-2xl md:rounded-[3rem] shadow-xl border border-gray-100 mb-6 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                            <div className="md:col-span-2 mb-2">
                                <h3 className="text-lg md:text-2xl font-black text-gray-900 flex items-center gap-2 md:gap-3">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                        {editingId ? <Pencil className="w-4 h-4 md:w-5 md:h-5 text-amber-600" /> : <Plus className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />}
                                    </div>
                                    {editingId ? 'แก้ไขข้อมูลส่วนลด' : 'รายละเอียดโค้ดส่วนลด'}
                                </h3>
                            </div>
                            <div className="space-y-1.5 md:space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">รหัสโค้ดส่วนลด *</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="เช่น NEWYEAR20"
                                    className="w-full px-5 md:px-6 py-3 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-amber-500/5 focus:bg-white focus:border-amber-500 transition-all font-bold text-gray-900 uppercase"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5 md:space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">คำอธิบาย</label>
                                <input
                                    type="text"
                                    placeholder="เช่น ส่วนลดพิเศษสำหรับลูกค้าใหม่"
                                    className="w-full px-5 md:px-6 py-3 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-amber-500/5 focus:bg-white focus:border-amber-500 transition-all font-bold text-gray-900"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <div className="space-y-1.5 md:space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">ประเภท</label>
                                    <select
                                        className="w-full px-5 md:px-6 py-3 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-amber-500/5 focus:bg-white focus:border-amber-500 transition-all font-bold text-gray-900"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="PERCENTAGE">% เปอร์เซ็นต์</option>
                                        <option value="FIXED">฿ จำนวนเงิน</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5 md:space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                                        {formData.type === 'PERCENTAGE' ? 'ส่วนลด (%) *' : 'ส่วนลด (฿) *'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            required
                                            type="number"
                                            step="0.01"
                                            className="w-full px-5 md:px-6 py-3 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-amber-500/5 focus:bg-white focus:border-amber-500 transition-all font-bold text-gray-900"
                                            value={formData.discountValue}
                                            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                        />
                                        <div className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-gray-400">
                                            {formData.type === 'PERCENTAGE' ? <Percent className="w-4 h-4 md:w-5 md:h-5" /> : <DollarSign className="w-4 h-4 md:w-5 md:h-5" />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <div className="space-y-1.5 md:space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">สิทธิ์รวมทั้งหมด</label>
                                    <input
                                        type="number"
                                        placeholder="เช่น 100"
                                        className="w-full px-5 md:px-6 py-3 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-amber-500/5 focus:bg-white focus:border-amber-500 transition-all font-bold text-gray-900"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5 md:space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">ขั้นต่ำ (฿)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full px-5 md:px-6 py-3 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-amber-500/5 focus:bg-white focus:border-amber-500 transition-all font-bold text-gray-900"
                                        value={formData.minPurchaseAmount}
                                        onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 md:space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">สิทธิ์ต่อคน</label>
                                <input
                                    type="number"
                                    className="w-full px-5 md:px-6 py-3 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-amber-500/5 focus:bg-white focus:border-amber-500 transition-all font-bold text-gray-900"
                                    value={formData.userUsageLimit}
                                    onChange={(e) => setFormData({ ...formData, userUsageLimit: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <div className="space-y-1.5 md:space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">วันที่เริ่ม</label>
                                    <input
                                        type="date"
                                        className="w-full px-5 md:px-6 py-3 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-amber-500/5 focus:bg-white focus:border-amber-500 transition-all font-bold text-gray-900"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5 md:space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">วันที่สิ้นสุด</label>
                                    <input
                                        type="date"
                                        className="w-full px-5 md:px-6 py-3 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-amber-500/5 focus:bg-white focus:border-amber-500 transition-all font-bold text-gray-900"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 flex justify-end pt-4 md:pt-6">
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="w-full md:w-auto bg-gray-900 text-white px-10 py-4 rounded-xl md:rounded-2xl font-black text-base hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                    {editingId ? 'บันทึกการแก้ไข' : 'ยืนยันสร้างส่วนลด'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Search & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 mb-6 md:mb-10">
                    <div className="md:col-span-3 bg-white px-5 md:px-8 py-3 md:py-4 rounded-xl md:rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-3 md:gap-4 ring-4 ring-gray-100/50">
                        <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาโค้ดส่วนลดหรือคำอธิบาย..."
                            className="bg-transparent border-none focus:ring-0 w-full font-bold text-sm md:text-base text-gray-900 placeholder:text-gray-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="text-gray-300 hover:text-gray-500">
                                <XCircle className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between ring-4 ring-gray-100/50">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">ทั้งหมด</p>
                            <p className="text-xl md:text-2xl font-black text-gray-900">{discounts.length}</p>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-50 rounded-xl md:rounded-2xl flex items-center justify-center">
                            <Ticket className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
                        </div>
                    </div>
                </div>

                {/* Discounts List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {loading ? (
                        <div className="col-span-full flex justify-center py-20">
                            <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
                        </div>
                    ) : filteredDiscounts.length > 0 ? (
                        filteredDiscounts.map((discount) => (
                            <div key={discount.id} className="bg-white rounded-2xl md:rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-amber-200 transition-all group relative">
                                <div className="p-6 md:p-8">
                                    <div className="flex justify-between items-start mb-4 md:mb-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="bg-gray-900 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-lg md:text-xl font-black tracking-wider flex items-center gap-2 w-fit">
                                                {discount.code}
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(discount.code);
                                                        alert('คัดลอกโค้ดแล้ว!');
                                                    }}
                                                    className="hover:text-amber-400 transition-colors"
                                                >
                                                    <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                </button>
                                            </div>
                                            <p className="text-[10px] md:text-sm font-bold text-gray-400 line-clamp-1">{discount.description || 'ไม่มีคำอธิบาย'}</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggleActive(discount.id, discount.isActive)}
                                            className={`transition-colors h-10 w-10 md:w-12 md:h-12 flex items-center justify-center ${discount.isActive ? 'text-green-500' : 'text-gray-300'}`}
                                        >
                                            {discount.isActive ? <ToggleRight className="w-8 h-8 md:w-10 md:h-10" /> : <ToggleLeft className="w-8 h-8 md:w-10 md:h-10" />}
                                        </button>
                                    </div>

                                    <div className="mb-4 md:mb-6">
                                        <div className="flex items-baseline gap-2 mb-2 md:mb-3">
                                            <span className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">
                                                {discount.type === 'PERCENTAGE' ? `${discount.discountValue}%` : `฿${discount.discountValue}`}
                                            </span>
                                            <span className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest italic">OFF</span>
                                        </div>

                                        <div className="bg-gray-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-gray-100 flex flex-wrap gap-2 md:gap-3">
                                            <div className="px-2.5 md:px-3 py-1 bg-white rounded-lg border border-gray-100 text-[9px] md:text-[10px] font-black text-gray-500 uppercase flex items-center gap-1.5 leading-none">
                                                <RefreshCw className="w-3 h-3 text-blue-500" />
                                                {discount.usedCount}/{discount.usageLimit || '∞'}
                                            </div>
                                            {(discount.minPurchaseAmount || 0) > 0 && (
                                                <div className="px-2.5 md:px-3 py-1 bg-white rounded-lg border border-gray-100 text-[9px] md:text-[10px] font-black text-gray-500 uppercase flex items-center gap-1.5 leading-none">
                                                    <DollarSign className="w-3 h-3 text-green-500" />
                                                    Min ฿{discount.minPurchaseAmount}
                                                </div>
                                            )}
                                            {discount.userUsageLimit && (
                                                <div className="px-2.5 md:px-3 py-1 bg-white rounded-lg border border-gray-100 text-[9px] md:text-[10px] font-black text-gray-500 uppercase flex items-center gap-1.5 leading-none">
                                                    <Ticket className="w-3 h-3 text-orange-500" />
                                                    Limit {discount.userUsageLimit}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-4 md:pt-6 border-t border-gray-50">
                                        <div className="flex justify-between items-center text-[10px] md:text-xs">
                                            <span className="text-gray-400 font-bold uppercase flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3 text-orange-400" /> ระยะเวลา
                                            </span>
                                            <span className="font-bold text-gray-700">
                                                {discount.startDate ? new Date(discount.startDate).toLocaleDateString('th-TH') : 'เริ่มทันที'} - {discount.endDate ? new Date(discount.endDate).toLocaleDateString('th-TH') : 'ไม่มีกำหนด'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-[10px] md:text-xs">
                                            <span className="text-gray-400 font-bold uppercase flex items-center gap-1.5">
                                                <Info className="w-3 h-3 text-purple-400" /> สถานะ
                                            </span>
                                            <span className={`font-black uppercase flex items-center gap-1.5 ${discount.isActive ? 'text-green-600' : 'text-red-500'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${discount.isActive ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                                                {discount.isActive ? 'เปิดการใช้งาน' : 'ปิดการใช้งาน'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-50 flex justify-end gap-2 md:gap-3">
                                        <button
                                            onClick={() => handleEdit(discount)}
                                            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                            title="แก้ไข"
                                        >
                                            <Pencil className="w-4 h-4 md:w-5 md:h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(discount.id)}
                                            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            title="ลบ"
                                        >
                                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
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
