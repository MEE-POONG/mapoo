'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
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

        // Validations
        if (!formData.name || !formData.email || !formData.password) {
            setError('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if (formData.password.length < 6) {
            setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }

        setIsLoading(true);
        const result = await register({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
        });

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
                    className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 mb-6 group transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>กลับหน้าหลัก</span>
                </Link>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-brand-900/10 p-8 border border-white/50">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-500 to-brand-600 rounded-2xl mb-4 shadow-lg shadow-accent-500/30">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-brand-900">สมัครสมาชิก</h1>
                        <p className="text-brand-600 mt-2">สร้างบัญชีเพื่อติดตามคำสั่งซื้อ</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-brand-700 mb-2">ชื่อ-นามสกุล</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-brand-50/50 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                                    placeholder="กรอกชื่อ-นามสกุล"
                                />
                            </div>
                        </div>

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

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-brand-700 mb-2">เบอร์โทรศัพท์ (ไม่บังคับ)</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-brand-50/50 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                                    placeholder="08X-XXX-XXXX"
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
                                    placeholder="อย่างน้อย 6 ตัวอักษร"
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
                            <label className="block text-sm font-medium text-brand-700 mb-2">ยืนยันรหัสผ่าน</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-brand-50/50 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                                />
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
                                    กำลังสมัคร...
                                </span>
                            ) : (
                                'สมัครสมาชิก'
                            )}
                        </button>
                    </form>

                    {/* Login link */}
                    <p className="text-center mt-6 text-brand-600">
                        มีบัญชีอยู่แล้ว?{' '}
                        <Link
                            href={`/login${typeof window !== 'undefined' && window.location.search ? window.location.search : ''}`}
                            className="text-accent-600 font-semibold hover:text-accent-700 hover:underline"
                        >
                            เข้าสู่ระบบ
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
