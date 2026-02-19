'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';
import {
    ShieldCheck,
    ChevronLeft,
    Loader2,
    Plus,
    Trash2,
    Mail,
    User,
    Lock,
    LogOut,
    CheckCircle,
    XCircle,
    Crown,
    AlertCircle,
    X
} from 'lucide-react';

interface Admin {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

import AdminHeader from '@/components/AdminHeader';

export default function AdminsPage() {
    const router = useRouter();
    const { admin: currentAdmin, token, isLoading: authLoading, isAuthenticated, logout } = useAdminAuth();
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'ADMIN' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/admin/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchAdmins();
        }
    }, [isAuthenticated]);

    const fetchAdmins = async () => {
        try {
            const res = await fetch('/api/admin/admins', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setAdmins(data.admins || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const res = await fetch('/api/admin/admins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setShowModal(false);
                setFormData({ name: '', email: '', password: '', role: 'ADMIN' });
                fetchAdmins();
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('เกิดข้อผิดพลาด');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            await fetch(`/api/admin/admins/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            fetchAdmins();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('ต้องการลบ Admin นี้?')) return;

        try {
            await fetch(`/api/admin/admins/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchAdmins();
        } catch (error) {
            console.error('Error:', error);
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 mb-6 md:mb-10">
                    <div className="flex items-center gap-4 md:gap-6">
                        <Link
                            href="/admin"
                            className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 hover:border-gray-900 transition-all group"
                        >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-gray-900" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 md:gap-3 mb-0.5 md:mb-1">
                                <div className="hidden sm:flex w-6 h-6 md:w-8 md:h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                                    <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-600" />
                                </div>
                                <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">จัดการผู้ดูแลระบบ</h1>
                            </div>
                            <p className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1 sm:ml-11">{admins.length} Total Moderators</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-gray-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-[1.5rem] font-black text-sm md:text-base flex items-center justify-center gap-2 md:gap-3 hover:scale-[1.02] transition-all shadow-lg"
                    >
                        <Plus className="w-5 h-5 md:w-6 md:h-6" />
                        เพิ่มผู้ดูแลระบบ
                    </button>
                </div>

                {/* Admin List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {admins.map((admin) => (
                            <div
                                key={admin.id}
                                className={`bg-white rounded-xl md:rounded-2xl border shadow-sm p-4 md:p-6 ${admin.isActive ? 'border-gray-100' : 'border-red-200 bg-red-50/50'}`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 ${admin.role === 'SUPER_ADMIN' ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-gray-500 to-gray-700'} text-white`}>
                                            {admin.role === 'SUPER_ADMIN' ? (
                                                <Crown className="w-5 h-5 md:w-6 md:h-6" />
                                            ) : (
                                                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm md:text-base">
                                                <span className="truncate">{admin.name}</span>
                                                {admin.id === currentAdmin?.id && (
                                                    <span className="text-[9px] md:text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full shrink-0">คุณ</span>
                                                )}
                                            </h3>
                                            <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1.5 truncate">
                                                <Mail className="w-3 h-3 shrink-0" />
                                                <span className="truncate">{admin.email}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4">
                                        <span className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-xs font-black uppercase tracking-wider ${admin.role === 'SUPER_ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {admin.role}
                                        </span>

                                        <button
                                            onClick={() => handleToggleActive(admin.id, admin.isActive)}
                                            disabled={admin.id === currentAdmin?.id}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-tight transition-all active:scale-95 ${admin.isActive
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {admin.isActive ? (
                                                <>
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Active
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    Inactive
                                                </>
                                            )}
                                        </button>

                                        {admin.id !== currentAdmin?.id && (
                                            <button
                                                onClick={() => handleDelete(admin.id)}
                                                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                                    สร้างเมื่อ: {new Date(admin.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Admin Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-brand-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] max-w-md w-full p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6 md:mb-8">
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">เพิ่ม Admin ใหม่</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Access Node Setup</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleCreateAdmin} className="space-y-4 md:space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-1.5">ชื่อ</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-amber-500/5 focus:bg-white focus:border-amber-500 transition-all font-bold text-sm"
                                        placeholder="ชื่อ Admin"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-1.5">อีเมล</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-amber-500/5 focus:bg-white focus:border-amber-500 transition-all font-bold text-sm"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-1.5">รหัสผ่าน</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-amber-500/5 focus:bg-white focus:border-amber-500 transition-all font-bold text-sm"
                                        placeholder="อย่างน้อย 6 ตัวอักษร"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-1.5">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-amber-500/5 focus:bg-white focus:border-amber-500 transition-all font-bold text-sm"
                                >
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 px-4 border border-gray-100 text-gray-400 rounded-xl font-black text-xs md:text-sm hover:bg-gray-50 transition-all uppercase tracking-widest"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-3 px-4 bg-gray-900 text-white rounded-xl font-black text-xs md:text-sm hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest"
                                >
                                    {submitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            สร้าง
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
