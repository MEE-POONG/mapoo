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
import AdminHeader from '@/components/AdminHeader';

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
        <main className="min-h-screen bg-[#F8F9FB]">
            <AdminHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                {/* Header */}
                {/* Header Section */}
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
                                <div className="hidden sm:flex w-6 h-6 md:w-8 md:h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                                    <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-600 fill-yellow-600" />
                                </div>
                                <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">จัดการรีวิวลูกค้า</h1>
                            </div>
                            <p className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1 sm:ml-11">{reviews.length} Verified Reviews</p>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="relative group">
                        <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 md:w-5 md:h-5 group-focus-within:text-gray-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อลูกค้า, ข้อความรีวิว..."
                            className="w-full md:w-80 pl-11 md:pl-14 pr-5 md:pr-6 py-3 md:py-4 bg-white border border-gray-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-yellow-500/5 focus:bg-white focus:border-yellow-500 transition-all font-bold text-sm md:text-base placeholder:font-medium placeholder:text-gray-300 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                                className="bg-white rounded-2xl md:rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-gray-200/20 transition-all duration-500 group"
                            >
                                <div className="p-5 md:p-8">
                                    <div className="flex justify-between items-start mb-4 md:mb-6">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg shadow-yellow-200 shrink-0">
                                                {review.customerName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-black text-gray-900 text-base md:text-lg truncate">{review.customerName}</h3>
                                                <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-0.5 md:mt-1">
                                                    <div className="flex items-center gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-3 h-3 md:w-4 md:h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-[9px] md:text-xs text-gray-400 font-bold whitespace-nowrap">
                                                        {new Date(review.createdAt).toLocaleDateString('th-TH')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            disabled={deletingId === review.id}
                                            className="p-1.5 md:p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg md:rounded-xl transition-all shrink-0"
                                            title="ลบรีวิว"
                                        >
                                            {deletingId === review.id ? (
                                                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <Quote className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-10 md:w-12 h-10 md:h-12 text-yellow-50 opacity-10 pointer-events-none" />
                                        <div className="bg-gray-50/50 p-4 md:p-6 rounded-2xl md:rounded-3xl mb-4 md:mb-6 italic text-gray-700 font-medium relative z-10 leading-relaxed text-sm md:text-base">
                                            "{review.comment}"
                                        </div>
                                    </div>

                                    {review.imageUrl && (
                                        <div className="relative h-32 md:h-48 rounded-xl md:rounded-2xl overflow-hidden mb-4 md:mb-6 border border-gray-100 shadow-inner">
                                            <img
                                                src={review.imageUrl}
                                                alt="Review"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-gray-50">
                                        <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-bold text-gray-400">
                                            <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
                                            <span className="truncate max-w-[100px] md:max-w-none">Verified: {review.source}</span>
                                        </div>
                                        <div className="bg-yellow-50 text-yellow-700 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                                            Review
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
