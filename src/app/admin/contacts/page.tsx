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

import AdminHeader from '@/components/AdminHeader';

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
                                <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
                                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                                </div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">ข้อความติดต่อ</h1>
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-11">Customer Support & Inquiries: {messages.length} Pending Messages</p>
                        </div>
                    </div>
                </div>

                {/* Search Box */}
                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 mb-10 ring-4 ring-gray-100/50">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-gray-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="ค้นหาตามชื่อ, หัวข้อ หรือ เนื้อหาข้อความ..."
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all font-bold placeholder:font-medium placeholder:text-gray-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
