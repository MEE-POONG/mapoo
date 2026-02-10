'use client';

import { useState, useEffect, useMemo } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus, Loader2, Search, Star, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    unit: string;
    imageUrl: string;
    category: string;
    tags: string[];
    stock: number;
}

const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
    const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number, seconds: number }>({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <span className="font-mono bg-accent-500 px-2 py-0.5 rounded text-white tabular-nums">
            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
    );
};

import { useCart } from "@/context/CartContext";

export default function ProductsPage() {
    const { addToCart: contextAddToCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [sortBy, setSortBy] = useState('POPULAR');

    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return products;
        const q = searchQuery.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.tags || []).some(t => t.toLowerCase().includes(q))
        );
    }, [products, searchQuery]);

    const sortedProducts = useMemo(() => {
        const result = [...filteredProducts];
        if (sortBy === 'PRICE_ASC') {
            return result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'PRICE_DESC') {
            return result.sort((a, b) => b.price - a.price);
        }
        // Popular is default (original order for now or could be randomized)
        return result;
    }, [filteredProducts, sortBy]);

    useEffect(() => {
        fetchProducts();
    }, [filter]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const query = filter !== 'All' ? `?category=${filter}` : '';
            const res = await fetch(`/api/products${query}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                console.error('Products data is not an array:', data);
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId: string) => {
        setAddingToCart(productId);
        const success = await contextAddToCart(productId);
        if (success) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } else {
            alert('เกิดข้อผิดพลาดในการเพิ่มสินค้า');
        }
        setAddingToCart(null);
    };

    return (
        <main className="min-h-screen bg-brand-50">
            <Navbar />

            {/* Promotion Countdown */}
            <div className="bg-brand-900 text-white py-3 overflow-hidden whitespace-nowrap relative">
                <div className="flex items-center gap-8 animate-marquee">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 text-sm font-bold">
                            <span className="bg-accent-500 text-white px-2 py-0.5 rounded text-xs">HOT</span>
                            <span>ฉลองเปิดสาขาใหม่! รับส่วนลดสูงสุด 50%</span>
                            <div className="flex items-center gap-2">
                                <span>เหลือเวลา:</span>
                                <CountdownTimer targetDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Header */}
            <header className="bg-brand-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-brand-900 mb-2">สินค้าทั้งหมด</h1>
                    <p className="text-brand-600 mb-6">
                        คัดสรรความอร่อย สูตรหมูแดดเดียว ไส้กรอกอีสาน ราคาส่ง
                    </p>
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ค้นหาสินค้า..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all shadow-sm"
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 sticky top-24">
                            <h3 className="font-bold text-lg mb-4 text-brand-800 hidden lg:block">
                                หมวดหมู่สินค้า
                            </h3>
                            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                                {['All', 'ไส้กรอกอีสาน', 'หมูแดดเดียว', 'แหนมเนือง'].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilter(cat)}
                                        className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === cat
                                            ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30'
                                            : 'bg-brand-50 text-brand-600 hover:bg-brand-100'
                                            }`}
                                    >
                                        {cat === 'All' ? 'ทั้งหมด' : cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Grid */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-brand-500 text-sm">ค้นพบ {filteredProducts.length} รายการ</span>
                            <select
                                className="border-brand-200 rounded-lg text-sm text-brand-700 bg-white shadow-sm focus:border-accent-500 focus:ring-accent-500 p-2"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="POPULAR">เรียงตาม: ยอดนิยม</option>
                                <option value="PRICE_ASC">เรียงตาม: ราคา ต่ำ-สูง</option>
                                <option value="PRICE_DESC">เรียงตาม: ราคา สูง-ต่ำ</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-10 h-10 text-accent-500 animate-spin" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sortedProducts.map((product: Product) => (
                                    <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-brand-100 flex flex-col h-full relative">
                                        <Link href={`/products/${product.id}`} className="relative pt-[100%] bg-gray-100 overflow-hidden block">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {(product.tags || []).map((tag: string, i: number) => (
                                                <div key={i} className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm">
                                                    {tag}
                                                </div>
                                            ))}

                                            {/* Out of Stock Badge */}
                                            {product.stock <= 0 && (
                                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                                                    <span className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg rotate-[-5deg]">
                                                        สินค้าหมด
                                                    </span>
                                                </div>
                                            )}
                                        </Link>
                                        <div className="p-4 flex flex-col flex-1">
                                            <div className="flex items-center gap-1 mb-1.5 gray-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'fill-brand-100 text-brand-100'}`} />
                                                ))}
                                                <span className="text-[10px] text-brand-400 font-bold ml-1">(4.8)</span>
                                            </div>
                                            <Link href={`/products/${product.id}`}>
                                                <h3 className="text-lg font-bold text-brand-900 mb-1 group-hover:text-accent-600 transition-colors line-clamp-1">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <div className="flex items-center gap-2 mb-4">
                                                <p className="text-brand-400 text-xs">
                                                    หน่วย: {product.unit}
                                                </p>
                                                <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                                    ราคาส่งเริ่ม ฿220
                                                </span>
                                            </div>

                                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-brand-50">
                                                <div>
                                                    <p className="text-[10px] text-brand-400 font-bold uppercase tracking-wider">ราคาปลีก</p>
                                                    <p className="text-xl font-bold text-brand-800">
                                                        ฿{product.price.toLocaleString()}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => addToCart(product.id)}
                                                    disabled={addingToCart === product.id || product.stock <= 0}
                                                    className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 ${product.stock <= 0
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-brand-900 text-white hover:bg-accent-600 shadow-lg hover:shadow-accent-500/20 active:scale-95'
                                                        }`}
                                                >
                                                    {addingToCart === product.id ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <Plus className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {!loading && sortedProducts.length === 0 && (
                            <div className="text-center py-20 text-brand-400">
                                {searchQuery ? `ไม่พบสินค้าที่ค้นหา "${searchQuery}"` : 'ไม่พบสินค้าในหมวดหมู่นี้'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />

            {/* Toast Notification */}
            <div className={`fixed bottom-8 right-8 z-50 transition-all duration-300 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
                <div className="bg-brand-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
                    <div className="bg-accent-500 rounded-full p-1">
                        <Plus className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold">เพิ่มลงในตะกร้าแล้ว</p>
                        <Link href="/cart" className="text-accent-400 text-sm hover:text-accent-300 underline font-medium">ดูตะกร้าสินค้า</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
