'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
    Search,
    Package,
    X,
    Image as ImageIcon,
    Tag,
    DollarSign,
    Box
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
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        unit: '',
        imageUrl: '',
        category: 'ไส้กรอกอีสาน',
        tags: [] as string[],
        isFeatured: false
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product: Product | null = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                unit: product.unit,
                imageUrl: product.imageUrl,
                category: product.category,
                tags: product.tags,
                isFeatured: product.isFeatured
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: 0,
                unit: '',
                imageUrl: '',
                category: 'ไส้กรอกอีสาน',
                tags: [],
                isFeatured: false
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const url = editingProduct
                ? `/api/products/${editingProduct.id}`
                : '/api/products';
            const method = editingProduct ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchProducts();
            } else {
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('ยืนยันการลบสินค้านี้? ไม่สามารถย้อนกลับได้')) return;
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchProducts();
            } else {
                alert('เกิดข้อผิดพลาดในการลบสินค้า');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-gray-50/50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                            <Package className="w-8 h-8 text-accent-600" />
                            จัดการสินค้า
                        </h1>
                        <p className="text-gray-500">จัดการข้อมูลสินค้า ราคา และหมวดหมู่</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-brand-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent-600 transition-all shadow-lg shadow-brand-200 hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5" />
                        เพิ่มสินค้าใหม่
                    </button>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm mb-1">สินค้าทั้งหมด</p>
                        <p className="text-2xl font-bold text-gray-900">{products.length} รายการ</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm mb-1">แยกเป็นหมวดหมู่</p>
                        <p className="text-2xl font-bold text-gray-900">{new Set(products.map(p => p.category)).size} หมวด</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm mb-1">สินค้าแนะนำ</p>
                        <p className="text-2xl font-bold text-accent-600">{products.filter(p => p.isFeatured).length} รายการ</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm mb-1">ราคาเฉลี่ย</p>
                        <p className="text-2xl font-bold text-gray-900">฿{products.length > 0 ? (products.reduce((acc, p) => acc + p.price, 0) / products.length).toFixed(2) : '0'}</p>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="ค้นหาตามชื่อสินค้า หรือ หมวดหมู่..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-accent-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 text-accent-500 animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/80 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">สินค้า</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">หมวดหมู่</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">ราคา</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">การจัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredProducts.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 line-clamp-1">{p.name}</p>
                                                        <p className="text-xs text-gray-400 line-clamp-1">{p.unit}</p>
                                                        {p.isFeatured && (
                                                            <span className="inline-block mt-1 px-2 py-0.5 bg-accent-100 text-accent-700 text-[10px] font-bold rounded-full uppercase">Recommend</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-sm font-medium">
                                                    {p.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900">฿{p.price}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(p)}
                                                        className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                                                        title="แก้ไข"
                                                    >
                                                        <Pencil className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(p.id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        title="ลบ"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                ไม่พบข้อมูลสินค้าที่ค้นหา
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 max-h-[80vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-gray-400" />
                                        ชื่อสินค้า
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                                        placeholder="เช่น ไส้กรอกอีสาน หมูล้วน"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-gray-400" />
                                        หมวดหมู่
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="ไส้กรอกอีสาน">ไส้กรอกอีสาน</option>
                                        <option value="หมูแดดเดียว">หมูแดดเดียว</option>
                                        <option value="แหนมเนือง">แหนมเนือง</option>
                                        <option value="อื่นๆ">อื่นๆ</option>
                                    </select>
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                        ราคา (บาท)
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                                        placeholder="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    />
                                </div>

                                {/* Unit */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Box className="w-4 h-4 text-gray-400" />
                                        หน่วยสินค้า
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                                        placeholder="เช่น แพ็ค 1 กก. / 50 ลูก"
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    />
                                </div>

                                {/* isFeatured */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="isFeatured"
                                        className="w-5 h-5 rounded text-accent-600 focus:ring-accent-500 border-gray-300"
                                        checked={formData.isFeatured}
                                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    />
                                    <label htmlFor="isFeatured" className="text-sm font-bold text-gray-700 cursor-pointer">
                                        เป็นสินค้าแนะนำ
                                    </label>
                                </div>

                                {/* Image URL */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-gray-400" />
                                        URL รูปภาพ
                                    </label>
                                    <input
                                        required
                                        type="url"
                                        className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                                        placeholder="https://images.unsplash.com/..."
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    />
                                    {formData.imageUrl && (
                                        <div className="mt-4 w-32 h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Search className="w-4 h-4 text-gray-400" />
                                        รายละเอียด
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                                        placeholder="อธิบายรายละเอียดสินค้า..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="mt-10 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-4 border-2 border-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="flex-1 px-6 py-4 bg-accent-600 text-white rounded-xl font-bold hover:bg-accent-700 shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {editingProduct ? 'อัปเดตข้อมูล' : 'บันทึกสินค้าใหม่'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}
