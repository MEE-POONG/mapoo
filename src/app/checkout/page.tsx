'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
    ChevronLeft,
    CreditCard,
    Truck,
    User,
    Phone,
    MapPin,
    CheckCircle2,
    ShoppingBag,
    Loader2,
    Ticket,
    X,
    Tag,
    Plus
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

export default function CheckoutPage() {
    const { cart, loading: cartLoading, itemCount, refreshCart } = useCart();
    const { customer, token } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderData, setOrderData] = useState<any>(null);
    const router = useRouter();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        address: ''
    });

    // Auto-fill from logged in customer
    useEffect(() => {
        if (customer) {
            setFormData(prev => ({
                customerName: prev.customerName || customer.name || '',
                phone: prev.phone || customer.phone || '',
                address: prev.address || customer.address || ''
            }));
        }
    }, [customer]);

    const [discountInput, setDiscountInput] = useState('');
    const [validatingCode, setValidatingCode] = useState(false);
    const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
    const [discountError, setDiscountError] = useState('');

    const [wholesaleRates, setWholesaleRates] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/wholesale')
            .then(res => res.json())
            .then(data => setWholesaleRates(data))
            .catch(err => console.error(err));
    }, []);

    const wholesaleItemsCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
    const applicableRate = [...wholesaleRates]
        .sort((a, b) => b.minQuantity - a.minQuantity)
        .find(rate => wholesaleItemsCount >= rate.minQuantity);

    const subtotal = cart?.items.reduce((acc, item) => {
        const price = applicableRate ? applicableRate.pricePerKg : item.product.price;
        return acc + (price * item.quantity);
    }, 0) || 0;

    const shipping = subtotal > 0 && wholesaleItemsCount < 10 ? 40 : 0;

    // Calculate discount
    let discountAmount = 0;
    if (appliedDiscount) {
        if (appliedDiscount.type === 'PERCENTAGE') {
            discountAmount = (subtotal * appliedDiscount.discountValue) / 100;
        } else {
            discountAmount = appliedDiscount.discountValue;
        }
    }

    const total = Math.max(0, subtotal + shipping - discountAmount);

    const handleApplyDiscount = async () => {
        if (!discountInput) return;
        setValidatingCode(true);
        setDiscountError('');
        try {
            const res = await fetch('/api/discounts/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: discountInput,
                    subtotal,
                    phone: formData.phone // Send phone if available
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setAppliedDiscount(data);
                setDiscountInput('');
            } else {
                setDiscountError(data.error || 'โค้ดส่วนลดไม่ถูกต้อง');
            }
        } catch (error) {
            setDiscountError('เกิดข้อผิดพลาดในการตรวจสอบโค้ด');
        } finally {
            setValidatingCode(false);
        }
    };

    const handleRemoveDiscount = () => {
        setAppliedDiscount(null);
    };

    // Re-validate discount if subtotal changes
    useEffect(() => {
        if (appliedDiscount && appliedDiscount.minPurchaseAmount && subtotal < appliedDiscount.minPurchaseAmount) {
            setAppliedDiscount(null);
            setDiscountError(`ยอดซื้อขั้นต่ำไม่ถึง ฿${appliedDiscount.minPurchaseAmount.toLocaleString()}`);
        }
    }, [subtotal, appliedDiscount]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final Validation
        if (!formData.phone.match(/^[0-9]{10}$/)) {
            showToast('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)', 'warning');
            return;
        }

        setSubmitting(true);
        setDiscountError('');

        try {
            // 1. Final re-validation of discount if applied
            if (appliedDiscount) {
                const valRes = await fetch('/api/discounts/validate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        code: appliedDiscount.code,
                        subtotal,
                        phone: formData.phone
                    }),
                });

                if (!valRes.ok) {
                    const errorData = await valRes.json();
                    setDiscountError(errorData.error || 'โค้ดส่วนลดไม่สามารถใช้งานได้ในขณะนี้');
                    setAppliedDiscount(null);
                    setSubmitting(false);
                    // Scroll to discount error
                    return;
                }
            }

            // 2. Create Order
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    ...formData,
                    discountCode: appliedDiscount?.code
                }),
            });

            if (res.ok) {
                const order = await res.json();
                setOrderData(order);
                setIsSuccess(true);
                // Refresh order state to clear the cart badge
                refreshCart();
                showToast('สั่งซื้อสินค้าเรียบร้อยแล้ว', 'success');
            } else {
                const errorData = await res.json();
                showToast(errorData.error || 'เกิดข้อผิดพลาดในการสั่งซื้อ', 'error');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            showToast('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // Give context a bit of time to initialize token
            if (token === null && !localStorage.getItem('auth_token')) {
                // Not authenticated
                setCheckingAuth(false);
            } else {
                setCheckingAuth(false);
            }
        };
        checkAuth();
    }, [token]);

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
                            ขอบคุณคุณ <span className="font-bold text-brand-900">{formData.customerName}</span> ที่ไว้วางใจ หมูเเดดเดียว mapoo <br />
                            กรุณาโอนเงินตามยอดด้านล่างและแจ้งชำระเงินเพื่อดำเนินการจัดส่ง
                        </p>

                        <div className="bg-brand-900 text-white p-6 rounded-2xl mb-8 text-left w-full max-w-md mx-auto shadow-xl">
                            <p className="text-brand-300 text-sm mb-4 border-b border-brand-800 pb-2 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                ช่องทางการโอนเงิน
                            </p>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-white p-2 rounded-lg">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c4/K_Bank_logo.png" alt="KBank" className="h-6" />
                                </div>
                                <div>
                                    <p className="font-bold">ธนาคารกสิกรไทย (KBank)</p>
                                    <p className="text-sm text-brand-300">หมูเเดดเดียว mapoo</p>
                                    <p className="text-xl font-mono font-bold text-accent-400 tracking-wider">123-4-56789-0</p>
                                </div>
                            </div>
                            <div className="bg-brand-800 p-4 rounded-xl space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-brand-400">เลขที่ใบสั่งซื้อ</span>
                                    <span className="font-mono font-bold text-brand-100 italic">{orderData?.id.slice(-8).toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-brand-700">
                                    <span className="text-brand-100 font-bold">ยอดที่ต้องโอน</span>
                                    <span className="text-2xl font-black text-accent-500">฿{orderData?.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Link href="/account" className="w-full max-w-md bg-accent-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-accent-600 transition-all inline-flex items-center justify-center gap-2 shadow-lg shadow-accent-200">
                                <Plus className="w-5 h-5" />
                                อัปโหลดสลิปที่หน้าบัญชีของฉัน
                            </Link>
                            <br />
                            <Link href="/products" className="text-brand-500 hover:text-brand-900 font-bold transition-all inline-block">
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

    if (checkingAuth) {
        return (
            <div className="min-h-screen bg-brand-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-accent-500 animate-spin" />
            </div>
        );
    }

    if (!token) {
        return (
            <main className="min-h-screen bg-brand-50">
                <Navbar />
                <div className="max-w-xl mx-auto px-4 py-32 text-center">
                    <div className="bg-white p-12 rounded-3xl shadow-xl shadow-brand-200/50 border border-brand-100">
                        <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-8">
                            <User className="w-10 h-10 text-accent-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-brand-900 mb-4">กรุณาเข้าสู่ระบบก่อนสั่งซื้อ</h1>
                        <p className="text-brand-600 mb-8">
                            เพื่อให้คุณสามารถติดตามสถานะออเดอร์และดูประวัติการสั่งซื้อได้ <br />
                            กรุณาเข้าสู่ระบบหรือสมัครสมาชิกเพื่อดำเนินการต่อ
                        </p>
                        <div className="space-y-4">
                            <Link
                                href="/login?redirect=/checkout"
                                className="w-full bg-brand-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent-600 transition-all shadow-lg"
                            >
                                เข้าสู่ระบบ
                            </Link>
                            <Link
                                href="/register?redirect=/checkout"
                                className="w-full bg-white text-brand-900 border-2 border-brand-900 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-50 transition-all"
                            >
                                สมัครสมาชิกใหม่
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        );
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
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-sm font-bold text-accent-600">
                                                    ฿{((applicableRate ? applicableRate.pricePerKg : item.product.price) * item.quantity).toLocaleString()}
                                                </p>
                                                {applicableRate && (
                                                    <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">ราคาส่ง</span>
                                                )}
                                            </div>
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
                                {appliedDiscount && (
                                    <div className="flex flex-col gap-1 bg-green-50 p-3 rounded-lg border border-green-100 animate-in fade-in zoom-in duration-300">
                                        <div className="flex justify-between text-green-600 font-bold">
                                            <span className="flex items-center gap-1 text-sm">
                                                <Tag className="w-3 h-3" />
                                                ส่วนลด ({appliedDiscount.code})
                                            </span>
                                            <span>- ฿{discountAmount.toLocaleString()}</span>
                                        </div>
                                        {appliedDiscount.description && (
                                            <p className="text-[10px] text-green-700 font-medium italic">
                                                * {appliedDiscount.description}
                                            </p>
                                        )}
                                        <p className="text-[9px] text-green-600/70 font-bold">
                                            (ลด {appliedDiscount.type === 'PERCENTAGE' ? `${appliedDiscount.discountValue}%` : `฿${appliedDiscount.discountValue.toLocaleString()}`})
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Discount Input */}
                            {!appliedDiscount ? (
                                <div className="mb-8">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                placeholder="โค้ดส่วนลด"
                                                className="w-full pl-9 pr-3 py-2.5 bg-brand-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-accent-500 font-bold uppercase"
                                                value={discountInput}
                                                onChange={(e) => setDiscountInput(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleApplyDiscount}
                                            disabled={validatingCode || !discountInput}
                                            className="px-4 py-2.5 bg-brand-100 text-brand-700 rounded-xl text-sm font-bold hover:bg-brand-200 transition-all disabled:opacity-50"
                                        >
                                            {validatingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ใช้'}
                                        </button>
                                    </div>
                                    {discountError && (
                                        <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{discountError}</p>
                                    )}
                                </div>
                            ) : (
                                <div className="mb-8 bg-brand-50 p-3 rounded-2xl flex items-center justify-between border border-brand-100 border-dashed animate-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-green-100 p-2 rounded-lg">
                                            <Ticket className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-brand-500 font-bold uppercase tracking-widest">ใช้โค้ดแล้ว</p>
                                            <p className="text-sm font-black text-brand-900">{appliedDiscount.code}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleRemoveDiscount}
                                        className="text-brand-300 hover:text-red-500 transition-colors p-1"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

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
