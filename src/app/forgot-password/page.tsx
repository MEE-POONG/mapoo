'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Mail, Phone, Lock, ArrowLeft, Loader2,
    CheckCircle, Eye, EyeOff, KeyRound
} from "lucide-react";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !phone || !newPassword || !confirmPassword) {
            setError('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if (newPassword.length < 6) {
            setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, phone, newPassword })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'เกิดข้อผิดพลาด');
            } else {
                setStep('success');
            }
        } catch {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50">
            <Navbar />

            <main className="max-w-md mx-auto px-4 pt-32 pb-16">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 mb-6 group transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    กลับไปหน้าเข้าสู่ระบบ
                </Link>

                {step === 'form' ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-brand-900/10 p-8 border border-white/50">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-500 to-brand-600 rounded-2xl mb-4 shadow-lg shadow-accent-500/30">
                                <KeyRound className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-brand-900">ลืมรหัสผ่าน</h1>
                            <p className="text-brand-500 mt-2 text-sm">กรอกอีเมลและเบอร์โทรเพื่อยืนยันตัวตน</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-brand-700 mb-2">อีเมล</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="กรอกอีเมลที่ใช้สมัครสมาชิก"
                                        className="w-full pl-12 pr-4 py-3 bg-brand-50/50 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-brand-700 mb-2">เบอร์โทรศัพท์</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="เบอร์โทรที่ลงทะเบียนไว้"
                                        className="w-full pl-12 pr-4 py-3 bg-brand-50/50 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-brand-700 mb-2">รหัสผ่านใหม่</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="อย่างน้อย 6 ตัวอักษร"
                                        className="w-full pl-12 pr-12 py-3 bg-brand-50/50 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-brand-700 mb-2">ยืนยันรหัสผ่านใหม่</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                                        className="w-full pl-12 pr-4 py-3 bg-brand-50/50 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-gradient-to-r from-accent-500 to-brand-600 text-white font-bold rounded-xl hover:from-accent-600 hover:to-brand-700 disabled:opacity-50 transition-all shadow-lg shadow-accent-500/30 hover:shadow-xl hover:-translate-y-0.5"
                            >
                                {loading ? (
                                    <span className="inline-flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        กำลังดำเนินการ...
                                    </span>
                                ) : (
                                    'เปลี่ยนรหัสผ่าน'
                                )}
                            </button>
                        </form>
                    </div>
                ) : (
                    /* Success State */
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-brand-900/10 p-8 border border-white/50 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-brand-900 mb-2">เปลี่ยนรหัสผ่านสำเร็จ!</h2>
                        <p className="text-brand-500 mb-6">คุณสามารถใช้รหัสผ่านใหม่เข้าสู่ระบบได้แล้ว</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="w-full py-3.5 bg-gradient-to-r from-accent-500 to-brand-600 text-white font-bold rounded-xl hover:from-accent-600 hover:to-brand-700 transition-all shadow-lg shadow-accent-500/30"
                        >
                            ไปหน้าเข้าสู่ระบบ
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
