'use client';

import { useState, useEffect, useMemo } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus, Loader2, Search, Star, ShoppingBag, ChevronDown, Filter } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

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
    const { showToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');

    const [sortBy, setSortBy] = useState('POPULAR');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);

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
            showToast('เพิ่มสินค้าลงในตะกร้าแล้ว', 'success');
        } else {
            showToast('เกิดข้อผิดพลาดในการเพิ่มสินค้า', 'error');
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
                    {/* Sidebar / Filter Section */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        {/* Desktop Sidebar */}
                        <div className="hidden lg:block bg-white p-6 rounded-2xl shadow-sm border border-brand-100 sticky top-24">
                            <h3 className="font-bold text-lg mb-4 text-brand-800">
                                หมวดหมู่สินค้า
                            </h3>
                            <div className="flex flex-col gap-2">
                                {['All', 'ไส้กรอกอีสาน', 'หมูแดดเดียว', 'แหนมเนือง'].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilter(cat)}
                                        className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === cat
                                            ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30'
                                            : 'bg-brand-50 text-brand-600 hover:bg-brand-100'
                                            }`}
                                    >
                                        {cat === 'All' ? 'ทั้งหมด' : cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile/Tablet Category Dropdown */}
                        <div className="lg:hidden relative">
                            <button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="w-full flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-brand-100 font-bold text-brand-800 hover:bg-brand-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Filter className="w-5 h-5 text-accent-500" />
                                    <span>หมวดหมู่: {filter === 'All' ? 'ทั้งหมด' : filter}</span>
                                </div>
                                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showMobileFilters ? 'rotate-180' : ''}`} />
                            </button>

                            {showMobileFilters && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-brand-100 overflow-hidden z-[40] animate-in fade-in slide-in-from-top-2 duration-200">
                                    {['All', 'ไส้กรอกอีสาน', 'หมูแดดเดียว', 'แหนมเนือง'].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setFilter(cat);
                                                setShowMobileFilters(false);
                                            }}
                                            className={`w-full text-left px-6 py-4 text-sm font-bold transition-colors ${filter === cat
                                                ? 'bg-accent-50 text-accent-600 border-l-4 border-accent-500'
                                                : 'text-brand-600 hover:bg-brand-50'
                                                }`}
                                        >
                                            {cat === 'All' ? 'ทั้งหมด' : cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Grid */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6 relative">
                            <span className="text-brand-500 text-sm">ค้นพบ {filteredProducts.length} รายการ</span>

                            <div className="relative">
                                <button
                                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-200 rounded-xl text-sm font-medium text-brand-700 hover:border-accent-500 transition-all shadow-sm"
                                >
                                    <span>{
                                        sortBy === 'POPULAR' ? 'เรียงตาม: ยอดนิยม' :
                                            sortBy === 'PRICE_ASC' ? 'เรียงตาม: ราคา ต่ำ-สูง' :
                                                'เรียงตาม: ราคา สูง-ต่ำ'
                                    }</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showSortDropdown && (
                                    <>
                                        {/* Overlay to close on click outside */}
                                        <div
                                            className="fixed inset-0 z-[45]"
                                            onClick={() => setShowSortDropdown(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-brand-100 py-2 z-[50] animate-in fade-in slide-in-from-top-2 duration-200">
                                            {[
                                                { value: 'POPULAR', label: 'เรียงตาม: ยอดนิยม' },
                                                { value: 'PRICE_ASC', label: 'เรียงตาม: ราคา ต่ำ-สูง' },
                                                { value: 'PRICE_DESC', label: 'เรียงตาม: ราคา สูง-ต่ำ' }
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setSortBy(option.value);
                                                        setShowSortDropdown(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortBy === option.value
                                                        ? 'bg-accent-50 text-accent-600 font-bold'
                                                        : 'text-brand-700 hover:bg-brand-50'
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-10 h-10 text-accent-500 animate-spin" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                {sortedProducts.map((product: Product) => (
                                    <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-brand-100 flex flex-col h-full relative">
                                        <Link href={`/products/${product.id}`} className="relative pt-[100%] bg-gray-100 overflow-hidden block">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {(product.tags || []).map((tag: string, i: number) => (
                                                <div key={i} className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-orange-500 text-white text-[8px] sm:text-xs font-bold px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full z-10 shadow-sm">
                                                    {tag}
                                                </div>
                                            ))}

                                            {/* Out of Stock Badge */}
                                            {product.stock <= 0 && (
                                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                                                    <span className="bg-red-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-sm shadow-lg rotate-[-5deg]">
                                                        สินค้าหมด
                                                    </span>
                                                </div>
                                            )}
                                        </Link>
                                        <div className="p-3 sm:p-4 flex flex-col flex-1">
                                            <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-1.5 gray-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'fill-brand-100 text-brand-100'}`} />
                                                ))}
                                                <span className="text-[8px] sm:text-[10px] text-brand-400 font-bold ml-1">(4.8)</span>
                                            </div>
                                            <Link href={`/products/${product.id}`}>
                                                <h3 className="text-sm sm:text-lg font-bold text-brand-900 mb-0.5 sm:mb-1 group-hover:text-accent-600 transition-colors line-clamp-1">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                                                <p className="text-brand-400 text-[10px] sm:text-xs truncate">
                                                    หน่วย: {product.unit}
                                                </p>
                                                <span className="w-fit text-[8px] sm:text-[10px] text-green-600 font-bold bg-green-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-green-100">
                                                    ขายส่งเริ่ม ฿220
                                                </span>
                                            </div>

                                            <div className="mt-auto flex items-center justify-between pt-3 sm:pt-4 border-t border-brand-50">
                                                <div>
                                                    <p className="text-[8px] sm:text-[10px] text-brand-400 font-bold uppercase tracking-wider">ปลีก</p>
                                                    <p className="text-base sm:text-xl font-bold text-brand-800">
                                                        ฿{product.price.toLocaleString()}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => addToCart(product.id)}
                                                    disabled={addingToCart === product.id || product.stock <= 0}
                                                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl transition-all flex items-center justify-center disabled:opacity-50 ${product.stock <= 0
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-brand-900 text-white hover:bg-accent-600 shadow-lg hover:shadow-accent-500/20 active:scale-95'
                                                        }`}
                                                >
                                                    {addingToCart === product.id ? (
                                                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                                    ) : (
                                                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
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
        </main >
    );
}
