'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from 'next/link';
import { useCart } from "@/context/CartContext";
import {
    ArrowLeft,
    Loader2,
    Plus,
    Minus,
    ShoppingCart,
    Package,
    Tag,
    Check,
    Truck,
    Shield
} from "lucide-react";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    unit: string;
    imageUrl: string;
    category: string;
    tags: string[];
    isFeatured: boolean;
    stock: number;
}

export default function ProductDetailClient({ params, initialProduct }: { params: { id: string }, initialProduct?: Product }) {
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(initialProduct || null);
    const [loading, setLoading] = useState(!initialProduct);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [addedSuccess, setAddedSuccess] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products`);
                const products = await res.json();
                const found = products.find((p: Product) => p.id === params.id);
                setProduct(found || null);

                if (found) {
                    const related = products
                        .filter((p: Product) => p.category === found.category && p.id !== found.id)
                        .slice(0, 4);
                    setRelatedProducts(related);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [params.id]);

    const handleAddToCart = async () => {
        if (!product) return;
        setAddingToCart(true);
        await addToCart(product.id, quantity);
        setAddingToCart(false);
        setAddedSuccess(true);
        setTimeout(() => setAddedSuccess(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-50">
                <Navbar />
                <div className="flex items-center justify-center pt-40">
                    <Loader2 className="w-8 h-8 text-accent-500 animate-spin" />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-brand-50">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 pt-32 text-center">
                    <Package className="w-16 h-16 text-brand-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-brand-800 mb-2">ไม่พบสินค้า</h1>
                    <p className="text-brand-500 mb-6">สินค้าที่คุณค้นหาไม่มีอยู่ในระบบ</p>
                    <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> กลับไปหน้าสินค้า
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-50">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 pt-28 pb-16">
                <nav className="flex items-center gap-2 text-sm text-brand-500 mb-8">
                    <Link href="/" className="hover:text-accent-600 transition-colors">หน้าแรก</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-accent-600 transition-colors">สินค้าทั้งหมด</Link>
                    <span>/</span>
                    <span className="text-brand-800 font-medium">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="relative">
                        <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-brand-900/10 border border-brand-100 aspect-square">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {product.isFeatured && (
                            <div className="absolute top-4 left-4 bg-gradient-to-r from-accent-500 to-brand-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                                ⭐ สินค้าแนะนำ
                            </div>
                        )}
                        {product.stock <= 0 && (
                            <div className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center">
                                <span className="text-white text-2xl font-bold bg-red-500 px-6 py-3 rounded-2xl">สินค้าหมด</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-1 bg-accent-50 text-accent-700 rounded-lg text-sm font-medium">
                                {product.category}
                            </span>
                            {product.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-brand-100 text-brand-600 rounded-lg text-sm font-medium flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-bold text-brand-900">{product.name}</h1>

                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-accent-600">฿{product.price.toLocaleString()}</span>
                            <span className="text-lg text-brand-500">/ {product.unit}</span>
                        </div>

                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${product.stock > 10
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : product.stock > 0
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            <Package className="w-4 h-4" />
                            {product.stock > 0 ? `มีสินค้า ${product.stock} ${product.unit}` : 'สินค้าหมด'}
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-brand-100">
                            <h3 className="font-bold text-brand-800 mb-2">รายละเอียดสินค้า</h3>
                            <p className="text-brand-600 leading-relaxed whitespace-pre-line">{product.description}</p>
                        </div>

                        {product.stock > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="font-medium text-brand-700">จำนวน:</span>
                                    <div className="flex items-center border border-brand-200 rounded-xl overflow-hidden bg-white">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-4 py-3 hover:bg-brand-50 transition-colors"
                                        >
                                            <Minus className="w-4 h-4 text-brand-600" />
                                        </button>
                                        <span className="px-6 py-3 font-bold text-brand-900 min-w-[60px] text-center border-x border-brand-200">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="px-4 py-3 hover:bg-brand-50 transition-colors"
                                        >
                                            <Plus className="w-4 h-4 text-brand-600" />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-3 ${addedSuccess
                                        ? 'bg-green-500 text-white shadow-green-500/30'
                                        : 'bg-gradient-to-r from-accent-500 to-brand-600 text-white shadow-accent-500/30 hover:shadow-accent-500/40'
                                        }`}
                                >
                                    {addingToCart ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /> กำลังเพิ่ม...</>
                                    ) : addedSuccess ? (
                                        <><Check className="w-5 h-5" /> เพิ่มลงตะกร้าแล้ว!</>
                                    ) : (
                                        <><ShoppingCart className="w-5 h-5" /> เพิ่มลงตะกร้า</>
                                    )}
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-brand-100">
                                <Truck className="w-5 h-5 text-accent-500" />
                                <div>
                                    <p className="text-sm font-bold text-brand-800">จัดส่งรวดเร็ว</p>
                                    <p className="text-xs text-brand-500">ส่งทั่วประเทศ</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-brand-100">
                                <Shield className="w-5 h-5 text-green-500" />
                                <div>
                                    <p className="text-sm font-bold text-brand-800">สินค้าคุณภาพ</p>
                                    <p className="text-xs text-brand-500">มาตรฐาน อย.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-brand-900 mb-6">สินค้าที่เกี่ยวข้อง</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {relatedProducts.map(p => (
                                <Link
                                    key={p.id}
                                    href={`/products/${p.id}`}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
                                >
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={p.imageUrl}
                                            alt={p.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-brand-800 text-sm truncate">{p.name}</h3>
                                        <p className="text-accent-600 font-bold mt-1">฿{p.price.toLocaleString()}/{p.unit}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
