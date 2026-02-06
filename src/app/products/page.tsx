'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus, Loader2 } from "lucide-react";
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
}

import { useCart } from "@/context/CartContext";

export default function ProductsPage() {
    const { addToCart: contextAddToCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [filter]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const query = filter !== 'All' ? `?category=${filter}` : '';
            const res = await fetch(`/api/products${query}`);
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error(error);
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

            {/* Header */}
            <header className="bg-brand-100 py-12 pt-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-brand-900 mb-2">สินค้าทั้งหมด</h1>
                    <p className="text-brand-600">
                        คัดสรรความอร่อย สูตรหมูแดดเดียว ไส้กรอกอีสาน ราคาส่ง
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 sticky top-24">
                            <h3 className="font-bold text-lg mb-4 text-brand-800">
                                หมวดหมู่สินค้า
                            </h3>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={filter === 'All'}
                                        onChange={() => setFilter('All')}
                                        className="form-radio h-5 w-5 text-accent-600 border-brand-300 focus:ring-accent-500"
                                    />
                                    <span className="text-brand-600 group-hover:text-accent-600 transition-colors">
                                        ทั้งหมด
                                    </span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={filter === 'ไส้กรอกอีสาน'}
                                        onChange={() => setFilter('ไส้กรอกอีสาน')}
                                        className="form-radio h-5 w-5 text-accent-600 border-brand-300 focus:ring-accent-500"
                                    />
                                    <span className="text-brand-600 group-hover:text-accent-600 transition-colors">
                                        ไส้กรอกอีสาน
                                    </span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={filter === 'หมูแดดเดียว'}
                                        onChange={() => setFilter('หมูแดดเดียว')}
                                        className="form-radio h-5 w-5 text-accent-600 border-brand-300 focus:ring-accent-500"
                                    />
                                    <span className="text-brand-600 group-hover:text-accent-600 transition-colors">
                                        หมูแดดเดียว
                                    </span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={filter === 'แหนมเนือง'}
                                        onChange={() => setFilter('แหนมเนือง')}
                                        className="form-radio h-5 w-5 text-accent-600 border-brand-300 focus:ring-accent-500"
                                    />
                                    <span className="text-brand-600 group-hover:text-accent-600 transition-colors">
                                        แหนมเนือง
                                    </span>
                                </label>
                            </div>
                        </div>
                    </aside>

                    {/* Grid */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-brand-500 text-sm">ค้นพบ {products.length} รายการ</span>
                            <select className="border-brand-200 rounded-lg text-sm text-brand-700 bg-white shadow-sm focus:border-accent-500 focus:ring-accent-500 p-2">
                                <option>เรียงตาม: ยอดนิยม</option>
                                <option>เรียงตาม: ราคา ต่ำ-สูง</option>
                                <option>เรียงตาม: ราคา สูง-ต่ำ</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-10 h-10 text-accent-500 animate-spin" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-brand-100 flex flex-col h-full">
                                        <div className="relative pt-[100%] bg-gray-100 overflow-hidden">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {(product.tags || []).map((tag, i) => (
                                                <div key={i} className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm">
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-4 flex flex-col flex-1">
                                            <h3 className="text-lg font-bold text-brand-900 mb-1 group-hover:text-accent-600 transition-colors line-clamp-1">
                                                {product.name}
                                            </h3>
                                            <p className="text-brand-400 text-xs mb-3 line-clamp-1">
                                                {product.unit}
                                            </p>
                                            <div className="mt-auto flex items-center justify-between">
                                                <span className="text-xl font-bold text-brand-800">
                                                    ฿{product.price}
                                                </span>
                                                <button
                                                    onClick={() => addToCart(product.id)}
                                                    disabled={addingToCart === product.id}
                                                    className="bg-brand-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors flex items-center gap-1 disabled:opacity-50"
                                                >
                                                    {addingToCart === product.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Plus className="w-4 h-4" />
                                                    )}
                                                    เพิ่ม
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {!loading && products.length === 0 && (
                            <div className="text-center py-20 text-brand-400">
                                ไม่พบสินค้าในหมวดหมู่นี้
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
