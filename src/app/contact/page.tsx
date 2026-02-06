'use client';
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone, MessageCircle, Send, Loader2 } from "lucide-react";

export default function ContactPage() {
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus('LOADING');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message'),
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                setStatus('SUCCESS');
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus('ERROR');
            }
        } catch (error) {
            setStatus('ERROR');
        }
    }

    return (
        <main className="min-h-screen bg-brand-50">
            <Navbar />

            {/* Header */}
            <header className="bg-white py-8 pt-24 border-b border-brand-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold text-brand-900 mb-2">ติดต่อเรา</h1>
                    <p className="text-brand-600">
                        สอบถามข้อมูลสินค้า สมัครตัวแทน หรือสั่งซื้อจำนวนมาก
                    </p>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div>
                        <div className="bg-brand-900 text-white rounded-3xl p-8 lg:p-12 shadow-xl relative overflow-hidden h-full">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

                            <h3 className="text-2xl font-bold mb-8 relative z-10">ข้อมูลติดต่อ</h3>

                            <div className="space-y-8 relative z-10">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-accent-400" />
                                    </div>
                                    <div>
                                        <p className="text-brand-300 text-sm mb-1">เบอร์โทรศัพท์</p>
                                        <p className="text-xl font-semibold">089-123-4567</p>
                                        <p className="text-sm text-brand-400 mt-1">ทุกวัน 08:00 - 20:00 น.</p>
                                    </div>
                                </div>
                                {/* ... Other info hardcoded for now ... */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <MessageCircle className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-brand-300 text-sm mb-1">LINE Official</p>
                                        <p className="text-xl font-semibold">@siamsausage</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-brand-100">
                        <h3 className="text-2xl font-bold text-brand-900 mb-4">ส่งข้อความถึงเรา</h3>
                        {status === 'SUCCESS' ? (
                            <div className="bg-green-50 text-green-800 p-6 rounded-xl border border-green-200 text-center">
                                <p className="font-bold text-lg mb-2">ส่งข้อความเรียบร้อย</p>
                                <p>ขอบคุณที่ติดต่อมา เราจะรีบติดต่อกลับโดยเร็วที่สุด</p>
                                <button onClick={() => setStatus('IDLE')} className="mt-4 text-sm text-green-600 underline">ส่งข้อความใหม่</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-brand-700 mb-2">ชื่อ - นามสกุล</label>
                                        <input required name="name" type="text" className="w-full rounded-xl border-brand-200 focus:border-accent-500 focus:ring-accent-500" placeholder="ระบุชื่อของคุณ" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-brand-700 mb-2">เบอร์โทรศัพท์</label>
                                        <input required name="phone" type="tel" className="w-full rounded-xl border-brand-200 focus:border-accent-500 focus:ring-accent-500" placeholder="08x-xxx-xxxx" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-brand-700 mb-2">หัวข้อเรื่อง</label>
                                    <select name="subject" className="w-full rounded-xl border-brand-200 focus:border-accent-500 focus:ring-accent-500">
                                        <option>สอบถามสินค้า / ราคา</option>
                                        <option>สนใจเป็นตัวแทนจำหน่าย</option>
                                        <option>แจ้งปัญหา / เคลมสินค้า</option>
                                        <option>อื่นๆ</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-brand-700 mb-2">ข้อความ</label>
                                    <textarea required name="message" rows={4} className="w-full rounded-xl border-brand-200 focus:border-accent-500 focus:ring-accent-500" placeholder="รายละเอียดที่ต้องการสอบถาม..."></textarea>
                                </div>

                                <button type="submit" disabled={status === 'LOADING'} className="w-full py-4 px-6 rounded-xl bg-accent-600 hover:bg-accent-700 text-white font-bold text-lg shadow-lg shadow-accent-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                                    {status === 'LOADING' ? <Loader2 className="animate-spin" /> : <><Send className="w-5 h-5" /> ส่งข้อความ</>}
                                </button>
                                {status === 'ERROR' && <p className="text-red-500 text-center">เกิดข้อผิดพลาด กรุณาลองใหม่</p>}
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
