import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Check, Star } from "lucide-react";
import FeaturedProducts from "@/components/FeaturedProducts";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "หมูแดดเดียว & ไส้กรอกอีสาน ราคาส่ง | หมูเเดดเดียว mapoo",
    description: "สั่งซื้อหมูแดดเดียวและไส้กรอกอีสานราคาส่ง ออนไลน์ได้ที่นี่ ผลิตสดใหม่ รสดั้งเดิม จัดส่งทั่วประเทศ ยอดขายอันดับ 1 ในตลาดไท",
};

export default function Home() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'หมูเเดดเดียว',
        image: '/2026-02-17 155123.png',
        '@id': 'https://siamsausage.com',
        url: 'https://siamsausage.com',
        telephone: '089-123-4567',
        priceRange: '฿฿',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'ตลาดไท',
            addressLocality: 'Pathum Thani',
            postalCode: '12120',
            addressCountry: 'TH',
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday'
            ],
            opens: '08:00',
            closes: '18:00'
        }
    };

    return (
        <main className="min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            {/* Hero Section */}
            <header className="relative pt-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-32 lg:pb-40">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        {/* Text Content */}
                        <div className="text-center lg:text-left z-10 relative">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-semibold mb-6 border border-orange-200">
                                <span className="mr-2">🔥</span> ยอดขายอันดับ 1 ในตลาดไท
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-brand-900 mb-6 leading-tight">
                                หมูแดดเดียว <br />
                                <span className="text-accent-600 bg-clip-text text-transparent bg-gradient-to-r from-accent-600 to-orange-500">
                                    สูตรแม่ปู
                                </span>
                            </h1>
                            <p className="text-lg sm:text-xl text-brand-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                หมูล้วน มันน้อย เปรี้ยวกำลังดี สูตรลับจากรุ่นสู่รุ่น <br className="hidden sm:block" />
                                เหมาะสำหรับร้านทอด ร้านปิ้งย่าง กำไรดี คืนทุนไว
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start px-4 sm:px-0">
                                <Link
                                    href="/products"
                                    className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-2xl text-white bg-accent-600 hover:bg-accent-700 shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1 w-full sm:w-auto"
                                >
                                    สั่งซื้อราคาส่ง
                                </Link>
                                <Link
                                    href="/reviews"
                                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-brand-200 text-lg font-medium rounded-2xl text-brand-700 bg-white hover:bg-brand-50 hover:border-brand-300 transition-all font-bold w-full sm:w-auto"
                                >
                                    ดูรีวิวลูกค้า ⭐️
                                </Link>
                            </div>

                            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-brand-500 text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-500" />
                                    ผลิตใหม่ทุกวัน
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-500" />
                                    ไม่ใส่สารกันบูด
                                </div>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="mt-12 lg:mt-0 relative">
                            {/* Blob Background */}
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-full h-full bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                            <div className="absolute -bottom-8 -left-20 w-full h-full bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500">
                                <img
                                    src="/2026-02-17 155123.png"
                                    alt="หมูแดดเดียวสูตรแม่ปู ทอดเสร็จใหม่ๆ สวยงามน่ารับประทาน"
                                    className="object-cover w-full h-[400px] sm:h-[500px] lg:h-[600px] hover:scale-105 transition-transform duration-700"
                                />

                                {/* Floating Card */}
                                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-orange-100 max-w-xs">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 p-2 rounded-lg text-green-600">
                                            <Star className="w-6 h-6 fill-current" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-brand-500">กำไรต่อกิโล</p>
                                            <p className="font-bold text-brand-900">฿350 - ฿500</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Category Section */}
            <section className="py-20 bg-white" id="products">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-accent-600 font-semibold tracking-wide uppercase mb-2">
                            สินค้าแนะนำ
                        </h2>
                        <h3 className="text-4xl font-bold text-brand-900">
                            เลือกสินค้าไปทำกำไร
                        </h3>
                    </div>

                    <FeaturedProducts />
                </div>
            </section>

            {/* Value Props */}
            <section className="py-20 bg-brand-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div className="p-6">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">🐷</div>
                            <h4 className="text-lg font-bold mb-2">หมูสดจากฟาร์ม</h4>
                            <p className="text-brand-300 text-sm">คัดสรรวัตถุดิบคุณภาพ เกรด A ส่งตรงจากฟาร์มปิดมาตรฐาน</p>
                        </div>
                        <div className="p-6">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">🌿</div>
                            <h4 className="text-lg font-bold mb-2">สมุนไพรล้วน</h4>
                            <p className="text-brand-300 text-sm">ถึงเครื่องเทศ หอมกระเทียมพริกไทย สูตรลับเฉพาะ</p>
                        </div>
                        <div className="p-6">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">🚚</div>
                            <h4 className="text-lg font-bold mb-2">ส่งทั่วไทย 1-2 วัน</h4>
                            <p className="text-brand-300 text-sm">แพ็คสุญญากาศอย่างดี เก็บได้นาน ส่งรถห้องเย็นได้</p>
                        </div>
                        <div className="p-6">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">💰</div>
                            <h4 className="text-lg font-bold mb-2">ราคาส่งกำไรดี</h4>
                            <p className="text-brand-300 text-sm">มีเรทแม่ค้า เริ่มต้นแค่ 10 กิโลฯ ก็ได้ราคาส่ง</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-accent-600 font-semibold tracking-wide uppercase mb-2">คำถามที่พบบ่อย</h2>
                        <h3 className="text-4xl font-bold text-brand-900">มีเรื่องสงสัยใช่ไหม?</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="group bg-brand-50 p-6 rounded-3xl border border-transparent hover:border-accent-200 transition-all">
                            <h4 className="font-bold text-brand-900 text-lg mb-2 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-accent-500 text-white flex-shrink-0 flex items-center justify-center text-sm">Q</span>
                                สินค้าส่งกี่วันถึง จะเสียไหม?
                            </h4>
                            <p className="text-brand-600 pl-0 sm:pl-11">
                                ทางร้านใช้เวลาจัดส่ง 1-2 วันครับ เราแพ็คสุญญากาศอย่างดีและส่งผ่านรถห้องเย็นในบางพื้นที่
                                รับประกันสินค้าไม่เสีย 100% หากได้รับแล้วมีปัญหา ทางร้านยินดีเคลมให้ทันทีครับ
                            </p>
                        </div>

                        <div className="group bg-brand-50 p-6 rounded-3xl border border-transparent hover:border-accent-200 transition-all">
                            <h4 className="font-bold text-brand-900 text-lg mb-2 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-accent-500 text-white flex-shrink-0 flex items-center justify-center text-sm">Q</span>
                                เก็บไว้ได้นานแค่ไหน?
                            </h4>
                            <p className="text-brand-600 pl-0 sm:pl-11">
                                แช่ตู้เย็นช่องธรรมดาเก็บได้ 1 สัปดาห์ หากแช่ช่องฟรีซ (ช่องแข็ง) จะเก็บได้นานถึง 1-2 เดือนครับ
                                แนะนำให้แบ่งทานเท่าที่ต้องการเพื่อความสดใหม่
                            </p>
                        </div>

                        <div className="group bg-brand-50 p-6 rounded-3xl border border-transparent hover:border-accent-200 transition-all">
                            <h4 className="font-bold text-brand-900 text-lg mb-2 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-accent-500 text-white flex-shrink-0 flex items-center justify-center text-sm">Q</span>
                                สนใจสมัครตัวแทน/ซื้อราคาส่ง ต้องทำอย่างไร?
                            </h4>
                            <p className="text-brand-600 pl-0 sm:pl-11">
                                สามารถดู <Link href="/wholesale" className="text-accent-600 font-bold underline">เรทราคาส่ง</Link> ได้ที่หน้าหลักครับ
                                เริ่มต้นเพียง 10 กิโลกรัมเท่านั้น หรือทักแชทสอบถามแอดมินทาง LINE ได้ตลอดเวลาครับ
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
