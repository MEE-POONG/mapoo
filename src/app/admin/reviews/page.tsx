'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';
import {
    Star,
    MessageSquare,
    Calendar,
    ChevronLeft,
    Loader2,
    Trash2,
    ShieldCheck,
    LogOut,
    Search,
    ThumbsUp,
    Quote
} from 'lucide-react';

interface Review {
    id: string;
    customerName: string;
    rating: number;
    comment: string;
    imageUrl?: string;
    source: string;
    createdAt: string;
}

export default function AdminReviewsPage() {
    const router = useRouter();
    const { admin, token, isLoading: authLoading, isAuthenticated, logout } = useAdminAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
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
            fetchReviews();
        }
    }, [isAuthenticated]);

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/admin/reviews', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            setReviews(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('ยืนยันการลบรีวิวนี้?')) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                setReviews(reviews.filter(r => r.id !== id));
            } else {
                alert('ไม่สามารถลบริวิวได้');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
    };

    const filteredReviews = reviews.filter(r =>
        r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchTerm.toLowerCase())
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
                                <Star className="w-7 h-7 text-yellow-500 fill-yellow-500" />
                                จัดการรีวิวลูกค้า
                            </h1>
                            <p className="text-gray-500">ความพึงพอใจและการตอบกลับจากผู้ใช้</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อลูกค้า, ข้อความรีวิว..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Reviews List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center shadow-sm">
                        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Star className="w-10 h-10 text-yellow-200" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">ไม่พบข้อมูลรีวิว</h3>
                        <p className="text-gray-500">ยังไม่มีรีวิวจากลูกค้าในขณะนี้</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredReviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 group"
                            >
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-yellow-200">
                                                {review.customerName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-black text-gray-900 text-lg">{review.customerName}</h3>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                                                        />
                                                    ))}
                                                    <span className="text-xs text-gray-400 font-bold ml-2">
                                                        {new Date(review.createdAt).toLocaleDateString('th-TH')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            disabled={deletingId === review.id}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            title="ลบรีวิว"
                                        >
                                            {deletingId === review.id ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <Quote className="absolute -top-4 -left-4 w-12 h-12 text-yellow-50 opacity-10 pointer-events-none" />
                                        <div className="bg-gray-50/50 p-6 rounded-3xl mb-6 italic text-gray-700 font-medium relative z-10 leading-relaxed">
                                            "{review.comment}"
                                        </div>
                                    </div>

                                    {review.imageUrl && (
                                        <div className="relative h-48 rounded-2xl overflow-hidden mb-6 border border-gray-100 shadow-inner">
                                            <img
                                                src={review.imageUrl}
                                                alt="Review"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                            <ShieldCheck className="w-4 h-4 text-green-500" />
                                            Verified Source: {review.source}
                                        </div>
                                        <div className="bg-yellow-50 text-yellow-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            Customer Feedback
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
