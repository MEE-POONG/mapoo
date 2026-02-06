'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import {
    ChevronLeft,
    CreditCard,
    Truck,
    User,
    Phone,
    MapPin,
    CheckCircle2,
    ShoppingBag,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { cart, loading: cartLoading, itemCount, refreshCart } = useCart();
    const [submitting, setSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderData, setOrderData] = useState<any>(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        address: ''
    });

    const subtotal = cart?.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) || 0;
    const shipping = subtotal > 0 ? 40 : 0;
    const total = subtotal + shipping;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const order = await res.json();
                setOrderData(order);
                setIsSuccess(true);
                // Refresh order state to clear the cart badge
                refreshCart();
            } else {
                alert('เกิดข้อผิดพลาดในการสั่งซื้อ');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <main className="min-h-screen bg-brand-50">
                <Navbar />
                <div className="max-w-3xl mx-auto px-4 py-32 text-center">
                    <div className="bg-white p-12 rounded-3xl shadow-xl shadow-brand-200/50 border border-brand-100">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 className="w-12 h-12 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-brand-900 mb-4">สั่งซื้อเรียบร้อยแล้ว!</h1>
                        <p className="text-brand-600 mb-8 text-lg">
                            ขอบคุณคุณ <span className="font-bold text-brand-900">{formData.customerName}</span> ที่ไว้วางใจ SiamSausage <br />
                            เจ้าหน้าที่กำลังตรวจสอบข้อมูลและจะจัดส่งสินค้าให้โดยเร็วที่สุด
                        </p>
                        <div className="bg-brand-50 p-6 rounded-2xl mb-8 text-left inline-block w-full max-w-md">
                            <p className="text-brand-500 text-sm mb-2">เลขที่ใบสั่งซื้อ</p>
                            <p className="font-mono font-bold text-brand-900 text-lg mb-4">{orderData?.id}</p>
                            <div className="flex justify-between font-bold text-brand-900 pt-4 border-t border-brand-200">
                                <span>ยอดชำระสุทธิ</span>
                                <span className="text-accent-600 text-xl">฿{orderData?.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                        <div>
                            <Link href="/products" className="bg-brand-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-accent-600 transition-all inline-block shadow-lg shadow-brand-200">
                                กลับไปหน้าสินค้า
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    if (!cartLoading && (!cart || cart.items.length === 0)) {
        router.push('/products');
        return null;
    }

    return (
        <main className="min-h-screen bg-brand-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
                <Link href="/cart" className="inline-flex items-center gap-2 text-brand-600 hover:text-accent-600 font-medium mb-8 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    กลับไปที่ตะกร้าสินค้า
                </Link>

                <h1 className="text-4xl font-bold text-brand-900 mb-10 flex items-center gap-3">
                    <CreditCard className="w-10 h-10 text-accent-600" />
                    ชำระเงินและสั่งซื้อ
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Checkout Form */}
                    <div className="flex-1">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-100">
                                <h3 className="text-xl font-bold text-brand-900 mb-6 flex items-center gap-2">
                                    <User className="w-5 h-5 text-accent-500" />
                                    ข้อมูลผู้ซื้อ
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-brand-700 mb-2">ชื่อ-นามสกุล</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 bg-brand-50 border-none rounded-xl focus:ring-2 focus:ring-accent-500 transition-all"
                                            placeholder="ระบุชื่อจริงสำหรับการจัดส่ง"
                                            value={formData.customerName}
                                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-brand-700 mb-2 flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            เบอร์โทรศัพท์
                                        </label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full px-4 py-3 bg-brand-50 border-none rounded-xl focus:ring-2 focus:ring-accent-500 transition-all"
                                            placeholder="เช่น 081-234-5678"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-100">
                                <h3 className="text-xl font-bold text-brand-900 mb-6 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-accent-500" />
                                    ที่อยู่จัดส่ง
                                </h3>
                                <div>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full px-4 py-3 bg-brand-50 border-none rounded-xl focus:ring-2 focus:ring-accent-500 transition-all"
                                        placeholder="ระบุที่อยู่ บ้านเลขที่ ซอย ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-100">
                                <h3 className="text-xl font-bold text-brand-900 mb-6 flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-accent-500" />
                                    วิธีการจัดส่ง
                                </h3>
                                <div className="p-4 border-2 border-accent-100 bg-accent-50/50 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white p-2 rounded-lg shadow-sm">🚚</div>
                                        <div>
                                            <p className="font-bold text-brand-900">Kerry / Flash Express</p>
                                            <p className="text-xs text-brand-500">ระยะเวลา 1-3 วันทำการ</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-brand-900">฿40</p>
                                </div>
                                <p className="text-xs text-brand-400 mt-4 text-center">
                                    * เราใช้รถห้องเย็นควบคุมอุณหภูมิในบางพื้นที่เพื่อรักษาคุณภาพสินค้า
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-[400px] flex-shrink-0">
                        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-brand-100/50 border border-brand-100 sticky top-32">
                            <h3 className="text-xl font-bold text-brand-900 mb-6 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-accent-500" />
                                สรุปรายการสินค้า
                            </h3>

                            <div className="max-h-[300px] overflow-y-auto mb-6 pr-2 space-y-4">
                                {cart?.items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-brand-50 flex-shrink-0 border border-brand-100">
                                            <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-brand-900 line-clamp-1">{item.product.name}</p>
                                            <p className="text-xs text-brand-500">จำนวน: {item.quantity} {item.product.unit}</p>
                                            <p className="text-sm font-bold text-accent-600 mt-1">฿{(item.product.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 mb-6 pt-6 border-t border-brand-100">
                                <div className="flex justify-between text-brand-600">
                                    <span>ยอดรวมสินค้า</span>
                                    <span className="font-medium">฿{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-brand-600">
                                    <span>ค่าจัดส่ง (เหมาจ่าย)</span>
                                    <span className="font-medium">฿{shipping.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-10 pt-6 border-t border-brand-100">
                                <span className="font-bold text-lg text-brand-900">ยอดชำระสุทธิ</span>
                                <span className="font-bold text-3xl text-accent-600">฿{total.toLocaleString()}</span>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={submitting || cartLoading}
                                className="w-full bg-brand-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-accent-600 transition-all hover:shadow-xl shadow-brand-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        กำลังบันทึกข้อมูล...
                                    </>
                                ) : (
                                    <>
                                        ยืนยันการสั่งซื้อ
                                        <CheckCircle2 className="w-6 h-6" />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs text-brand-400 mt-6">
                                * โดยการกดสั่งซื้อ คุณยอมรับเงื่อนไขการให้บริการ <br /> และนโยบายความเป็นส่วนตัวของเรา
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
