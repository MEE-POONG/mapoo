'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('กรุณากรอกอีเมลและรหัสผ่าน');
            return;
        }

        setIsLoading(true);
        const result = await login(formData.email, formData.password);
        setIsLoading(false);

        if (result.success) {
            const params = new URLSearchParams(window.location.search);
            const redirect = params.get('redirect');
            router.push(redirect || '/account');
        } else {
            setError(result.error || 'เกิดข้อผิดพลาด');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent-400/20 to-brand-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-brand-400/20 to-accent-400/20 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md relative">
                {/* Back button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-brand-700 rounded-xl font-bold shadow-sm border border-brand-100 hover:text-accent-600 hover:border-accent-200 transition-all active:scale-95 group mb-6"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>กลับหน้าหลัก</span>
                </Link>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-brand-900/10 p-8 border border-white/50">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-500 to-brand-600 rounded-2xl mb-4 shadow-lg shadow-accent-500/30">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-brand-900">เข้าสู่ระบบ</h1>
                        <p className="text-brand-600 mt-2">ยินดีต้อนรับกลับมา!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-brand-700 mb-2">อีเมล</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-brand-50/50 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                                    placeholder="example@email.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-brand-700 mb-2">รหัสผ่าน</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-12 py-3 bg-brand-50/50 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                                    placeholder="กรอกรหัสผ่าน"
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

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-200">
                                {error}
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-accent-500 to-brand-600 text-white font-semibold rounded-xl hover:from-accent-600 hover:to-brand-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-accent-500/30 hover:shadow-xl hover:shadow-accent-500/40 hover:-translate-y-0.5"
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    กำลังเข้าสู่ระบบ...
                                </span>
                            ) : (
                                'เข้าสู่ระบบ'
                            )}
                        </button>
                    </form>

                    {/* Forgot password & Register links */}
                    <div className="text-center mt-6 space-y-3">
                        <Link
                            href="/forgot-password"
                            className="block text-sm text-brand-500 hover:text-accent-600 transition-colors"
                        >
                            ลืมรหัสผ่าน?
                        </Link>
                        <p className="text-brand-600">
                            ยังไม่มีบัญชี?{' '}
                            <Link
                                href={`/register${typeof window !== 'undefined' && window.location.search ? window.location.search : ''}`}
                                className="text-accent-600 font-semibold hover:text-accent-700 hover:underline"
                            >
                                สมัครสมาชิก
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
