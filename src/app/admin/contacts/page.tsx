'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';
import {
    MessageSquare,
    Mail,
    Phone,
    Calendar,
    ChevronLeft,
    Loader2,
    Trash2,
    Clock,
    ShieldCheck,
    LogOut,
    CheckCircle2,
    Search
} from 'lucide-react';

interface ContactMessage {
    id: string;
    name: string;
    phone: string;
    subject: string;
    message: string;
    createdAt: string;
}

export default function ContactsPage() {
    const router = useRouter();
    const { admin, token, isLoading: authLoading, isAuthenticated, logout } = useAdminAuth();
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/admin/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchMessages();
        }
    }, [isAuthenticated]);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/admin/contacts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('ยืนยันการลบข้อความนี้?')) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/contacts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                setMessages(messages.filter(m => m.id !== id));
            } else {
                alert('ไม่สามารถลบข้อความได้');
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
    };

    const filteredMessages = messages.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.includes(searchTerm)
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
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin"
                            className="p-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <MessageSquare className="w-7 h-7 text-indigo-500" />
                                จัดการข้อความติดต่อ
                            </h1>
                            <p className="text-gray-500">รวมข้อความสอบถามจากหน้าเว็บไซต์</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อ, หัวข้อ, ข้อความ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Messages List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center shadow-sm">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageSquare className="w-10 h-10 text-indigo-200" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">ไม่พบข้อความ</h3>
                        <p className="text-gray-500">ขณะนี้ยังไม่มีข้อความส่งเข้ามาจากลูกค้า</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredMessages.map((msg) => (
                            <div
                                key={msg.id}
                                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group"
                            >
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                    New Inquiry
                                                </span>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(msg.createdAt).toLocaleDateString('th-TH', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                    <span className="mx-1">•</span>
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(msg.createdAt).toLocaleTimeString('th-TH', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })} น.
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-black text-gray-900 mb-2">{msg.subject}</h3>

                                            <div className="bg-gray-50 p-6 rounded-2xl mb-6 relative">
                                                <div className="absolute top-4 right-4 opacity-5 pointer-events-none">
                                                    <MessageSquare className="w-20 h-20" />
                                                </div>
                                                <p className="text-gray-700 leading-relaxed font-medium whitespace-pre-wrap relative z-10">
                                                    "{msg.message}"
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                                        {msg.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-tight">ผู้ติอต่อ</p>
                                                        <p className="text-sm font-bold text-gray-900">{msg.name}</p>
                                                    </div>
                                                </div>
                                                <div className="h-8 w-px bg-gray-100 hidden sm:block" />
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                                        <Phone className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-tight">เบอร์โทรศัพท์</p>
                                                        <Link href={`tel:${msg.phone}`} className="text-sm font-bold text-gray-900 hover:text-green-600 transition-colors">
                                                            {msg.phone}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:w-px md:bg-gray-100" />

                                        <div className="flex md:flex-col justify-end gap-3 pt-4 md:pt-0">
                                            <button
                                                onClick={() => handleDelete(msg.id)}
                                                disabled={deletingId === msg.id}
                                                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all font-bold text-sm"
                                            >
                                                {deletingId === msg.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                                ลบรายการ
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
