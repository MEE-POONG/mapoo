import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, MessageCircle, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-brand-900 text-white pt-20 pb-10 overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center text-white font-bold font-serif text-xl border-2 border-white/20">S</div>
                            <span className="font-bold text-2xl tracking-tight text-white">SiamSausage</span>
                        </Link>
                        <p className="text-brand-300 text-sm leading-relaxed mb-6">
                            ต้นตำรับไส้กรอกอีสานและหมูแดดเดียว สูตรลับกว่า 20 ปี
                            คัดสรรวัตถุดิบชั้นดี เพื่อส่งมอบความอร่อยระดับพรีเมียมถึงมือคุณ
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent-500 transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent-500 transition-all">
                                <MessageCircle className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent-500 transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 border-b border-white/10 pb-2 inline-block">เมนูหลัก</h4>
                        <ul className="space-y-4 text-brand-300 text-sm">
                            <li><Link href="/" className="hover:text-accent-400 transition-colors">หน้าแรก</Link></li>
                            <li><Link href="/products" className="hover:text-accent-400 transition-colors">สินค้าทั้งหมด</Link></li>
                            <li><Link href="/wholesale" className="hover:text-accent-400 transition-colors">เรทราคาส่ง</Link></li>
                            <li><Link href="/reviews" className="hover:text-accent-400 transition-colors">รีวิวจากลูกค้า</Link></li>
                            <li><Link href="/track-order" className="hover:text-accent-400 transition-colors">ติดตามออเดอร์</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 border-b border-white/10 pb-2 inline-block">ช่วยเหลือ</h4>
                        <ul className="space-y-4 text-brand-300 text-sm">
                            <li><Link href="/contact" className="hover:text-accent-400 transition-colors">ติดต่อเรา</Link></li>
                            <li><Link href="/register" className="hover:text-accent-400 transition-colors">สมัครสมาชิก</Link></li>
                            <li><Link href="/admin" className="text-accent-400 font-bold hover:text-accent-300 transition-colors underline underline-offset-4">จัดการหลังบ้าน</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 border-b border-white/10 pb-2 inline-block">ติดต่อเรา</h4>
                        <ul className="space-y-4 text-brand-300 text-sm">
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-accent-500 flex-shrink-0" />
                                <span>089-123-4567<br /><span className="text-[10px] opacity-60">(08:00 - 20:00 น.)</span></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-accent-500 flex-shrink-0" />
                                <span>contact@siamsausage.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-accent-500 flex-shrink-0" />
                                <span>ตลาดไท จ.ปทุมธานี<br />ประเทศไทย</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-400">
                    <p>&copy; 2024 SiamSausage & Co. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</a>
                        <a href="#" className="hover:text-white transition-colors">เงื่อนไขการให้บริการ</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

