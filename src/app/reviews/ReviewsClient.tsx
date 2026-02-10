'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Star,
    MessageCircle,
    User,
    Calendar,
    Plus,
    X,
    Loader2,
    Send,
    Quote
} from "lucide-react";

interface Review {
    id: string;
    customerName: string;
    rating: number;
    comment: string;
    imageUrl?: string;
    source: string;
    createdAt: string;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        customerName: '',
        rating: 5,
        comment: '',
        imageUrl: '',
        source: 'Website'
    });

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/reviews');
            const data = await res.json();
            if (Array.isArray(data)) {
                setReviews(data);
            } else {
                console.error('Reviews data is not an array:', data);
                setReviews([]);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsModalOpen(false);
                setFormData({
                    customerName: '',
                    rating: 5,
                    comment: '',
                    imageUrl: '',
                    source: 'Website'
                });
                fetchReviews();
            } else {
                alert('เกิดข้อผิดพลาดในการส่งรีวิว');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '0';

    return (
        <main className="min-h-screen bg-brand-50/50">
            <Navbar />

            {/* Header Section */}
            <div className="pt-32 pb-16 bg-white border-b border-brand-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-accent-100 text-accent-700 font-bold text-sm mb-6">
                        <Star className="w-4 h-4 fill-current" />
                        รีวิวจากลูกค้าจริง
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-brand-900 mb-6">ความประทับใจจากลูกค้า</h1>
                    <p className="text-lg text-brand-500 max-w-2xl mx-auto mb-10">
                        เสียงตอบรับจากลูกค้ากว่า 1,000+ รายที่ไว้วางใจในคุณภาพรสชาติและการบริการของเรา
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                        <div className="text-center">
                            <div className="text-5xl font-black text-brand-900 mb-2">{averageRating}</div>
                            <div className="flex justify-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className={`w-5 h-5 ${s <= Math.round(Number(averageRating)) ? 'text-accent-500 fill-current' : 'text-gray-200'}`} />
                                ))}
                            </div>
                            <p className="text-sm text-brand-400 font-medium">{reviews.length} รีวิวทั้งหมด</p>
                        </div>

                        <div className="h-16 w-px bg-brand-100 hidden md:block"></div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-brand-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-accent-600 transition-all shadow-xl shadow-brand-200 hover:-translate-y-1"
                        >
                            <Plus className="w-6 h-6" />
                            เขียนรีวิวของคุณ
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Grid */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-accent-500 animate-spin" />
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        {reviews.map((review) => (
                            <div key={review.id} className="break-inside-avoid bg-white p-8 rounded-3xl shadow-lg shadow-brand-100/20 border border-brand-50 hover:border-accent-200 transition-all group">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-800 font-bold group-hover:bg-accent-100 group-hover:text-accent-700 transition-colors">
                                            {review.customerName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-brand-900">{review.customerName}</h4>
                                            <div className="flex gap-0.5 mt-1">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-accent-500 fill-current' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <Quote className="w-8 h-8 text-brand-50 opacity-20 group-hover:text-accent-500 group-hover:opacity-10 transition-all" />
                                </div>
                                <p className="text-brand-600 leading-relaxed italic mb-6">"{review.comment}"</p>
                                <div className="flex items-center justify-between text-xs text-brand-400 font-medium pt-4 border-t border-brand-50">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(review.createdAt).toLocaleDateString('th-TH', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <span className="bg-brand-50 px-2 py-0.5 rounded-md uppercase tracking-wider text-[10px]">{review.source}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && reviews.length === 0 && (
                    <div className="text-center py-20">
                        <MessageCircle className="w-16 h-16 text-brand-100 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-brand-900 mb-2">ยังไม่มีรีวิว</h3>
                        <p className="text-brand-400">มาร่วมเป็นคนแรกที่รีวิวความอร่อยให้เรา</p>
                    </div>
                )}
            </div>

            {/* Submit Review Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b border-brand-100 flex justify-between items-center bg-brand-50/30">
                            <div>
                                <h2 className="text-2xl font-bold text-brand-900">เขียนรีวิว</h2>
                                <p className="text-sm text-brand-400">บอกความประทับใจของคุณให้เราทราบ</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-brand-400 hover:text-brand-900 p-2 hover:bg-brand-50 rounded-xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-brand-900 mb-3">ให้คะแนนความพึงพอใจ</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: s })}
                                            className={`p-2 rounded-xl transition-all ${formData.rating >= s ? 'text-accent-500 scale-110' : 'text-gray-200'}`}
                                        >
                                            <Star className={`w-8 h-8 ${formData.rating >= s ? 'fill-current' : ''}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-brand-900 mb-2 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    ชื่อเล่น / นามแฝง
                                </label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-5 py-4 bg-brand-50/50 border-none rounded-2xl focus:ring-2 focus:ring-accent-500 transition-all font-medium"
                                    placeholder="เช่น คุณอุ้ม, แม่ค้าก้อย"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-brand-900 mb-2 flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4" />
                                    ความประทับใจ
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full px-5 py-4 bg-brand-50/50 border-none rounded-2xl focus:ring-2 focus:ring-accent-500 transition-all font-medium"
                                    placeholder="รสชาติเป็นอย่างไร, จัดส่งไวไหม, หรือมีอะไรแนะนำ..."
                                    value={formData.comment}
                                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                ></textarea>
                            </div>

                            <button
                                disabled={submitting}
                                type="submit"
                                className="w-full bg-brand-900 text-white py-5 rounded-2xl font-bold hover:bg-accent-600 shadow-xl shadow-brand-200 transition-all flex items-center justify-center gap-3 text-lg"
                            >
                                {submitting ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        ส่งรีวิวความอร่อย
                                        <Send className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}
