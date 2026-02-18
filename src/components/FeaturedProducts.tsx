'use client';

import { useState, useEffect } from 'react';
import { Plus, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

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

export default function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart: contextAddToCart } = useCart();
    const [addingToCart, setAddingToCart] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch('/api/products?featured=true');
                const data = await res.json();
                setProducts(data.slice(0, 3)); // Only take top 3 for featured cards
            } catch (error) {
                console.error('Error fetching featured products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    const addToCart = async (productId: string) => {
        setAddingToCart(productId);
        const success = await contextAddToCart(productId);
        if (!success) {
            alert('เกิดข้อผิดพลาดในการเพิ่มสินค้า');
        }
        setAddingToCart(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-accent-500 animate-spin" />
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product, index) => (
                <div
                    key={product.id}
                    className={`group bg-white rounded-3xl p-4 shadow-xl shadow-brand-100/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 border border-brand-50 hover:border-orange-100 relative ${index === 1 ? 'top-0 md:-top-8' : 'top-0'}`}
                >
                    <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                        {product.tags?.[0] && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm">
                                {product.tags[0]}
                            </div>
                        )}
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div className="px-2 pb-4">
                        <h4 className="text-xl font-bold text-brand-900 mb-2 truncate">{product.name}</h4>
                        <p className="text-brand-500 text-sm mb-4 line-clamp-2 min-h-[40px]">{product.description}</p>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xs text-brand-400">ราคาส่งเริ่มต้น</p>
                                <p className="text-2xl font-bold text-accent-600">฿{product.price}<span className="text-sm font-normal text-brand-400">/{product.unit.split(' ')[1] || 'กก.'}</span></p>
                            </div>
                            <button
                                onClick={() => addToCart(product.id)}
                                disabled={addingToCart === product.id}
                                className="w-12 h-12 rounded-full bg-brand-100 hover:bg-accent-500 hover:text-white text-brand-800 flex items-center justify-center transition-all disabled:opacity-50"
                            >
                                {addingToCart === product.id ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <span className="text-2xl font-light leading-none pb-1">+</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
