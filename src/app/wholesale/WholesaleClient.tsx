'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, Star, DollarSign, Package, Loader2 } from "lucide-react";

interface Rate {
    id: string;
    minQuantity: number;
    pricePerKg: number;
    costPerUnit: number;
    discountLabel: string;
    isPopular: boolean;
}

export default function WholesalePage() {
    const [rates, setRates] = useState<Rate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/wholesale')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRates(data);
                } else {
                    console.error('Wholesale rates data is not an array:', data);
                    setRates([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setRates([]);
                setLoading(false);
            });
    }, []);

    return (
        <main className="min-h-screen bg-brand-50">
            <Navbar />

            {/* Header */}
            <header className="bg-brand-900 text-white py-20 pt-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">เรทราคาส่ง ตัวแทนจำหน่าย</h1>
                    <p className="text-brand-200 text-lg max-w-2xl mx-auto">
                        ยิ่งสั่งเยอะ ยิ่งกำไรเยอะ เริ่มต้นง่ายๆ ทุนไม่จม พร้อมให้คำปรึกษาสำหรับร้านค้ามือใหม่
                    </p>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-100 text-center">
                        <div className="w-14 h-14 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <DollarSign className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-900 mb-2">กำไร 40-60%</h3>
                        <p className="text-brand-500">ส่วนต่างราคาดีมาก ขายง่าย คืนทุนไวภายในวันเดียว</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-100 text-center">
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-900 mb-2">แพ็คเกจมาตรฐาน</h3>
                        <p className="text-brand-500">ซีนสุญญากาศอย่างดี เก็บได้นาน 1 เดือน มีวันผลิต-หมดอายุชัดเจน</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-100 text-center">
                        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Star className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-900 mb-2">รับประกันความอร่อย</h3>
                        <p className="text-brand-500">สูตรต้นตำรับกว่า 20 ปี ลูกค้ายืนยัน ทานแล้วติดใจกลับมาซื้อซ้ำ</p>
                    </div>
                </div>

                {/* Price Table */}
                <div className="bg-white rounded-3xl shadow-lg border border-brand-100 overflow-hidden mb-16">
                    <div className="bg-accent-600 p-6 text-white text-center">
                        <h2 className="text-2xl font-bold">ตารางเรทราคาไส้กรอกอีสาน</h2>
                        <p className="opacity-90">คละสูตรได้ (หมูล้วน / ติดมัน / วุ้นเส้น)</p>
                    </div>
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-12 flex justify-center text-brand-400">
                                <Loader2 className="animate-spin w-8 h-8" />
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-brand-50 border-b border-brand-100">
                                        <th className="px-6 py-4 font-bold text-brand-700">จำนวนสั่งซื้อ (กิโลกรัม)</th>
                                        <th className="px-6 py-4 font-bold text-brand-700">ราคาต่อกิโลกรัม</th>
                                        <th className="px-6 py-4 font-bold text-brand-700 hidden sm:table-cell">ต้นทุนต่อลูก (โดยประมาณ)</th>
                                        <th className="px-6 py-4 font-bold text-brand-700 text-right">ประหยัด</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-100">
                                    {rates.map((rate) => (
                                        <tr key={rate.id} className={`hover:bg-brand-50/50 transition-colors ${rate.isPopular ? 'bg-orange-50/30' : ''}`}>
                                            <td className="px-6 py-4 font-medium text-brand-900">
                                                ขั้นต่ำ {rate.minQuantity} กก.
                                                {rate.isPopular && <span className="inline-block bg-accent-100 text-accent-700 px-2 py-0.5 rounded text-xs ml-2">นิยมสุด</span>}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-lg text-accent-600">฿{rate.pricePerKg}</td>
                                            <td className="px-6 py-4 text-brand-500 hidden sm:table-cell">{rate.costPerUnit ? `฿${rate.costPerUnit.toFixed(2)}` : '-'}</td>
                                            <td className={`px-6 py-4 text-right font-medium ${rate.discountLabel ? 'text-green-600' : 'text-brand-500'}`}>
                                                {rate.discountLabel || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Steps */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-brand-900 mb-10">เริ่มต้นง่ายๆ เพียง 3 ขั้นตอน</h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-900 text-white flex items-center justify-center font-bold text-xl">1</div>
                            <div>
                                <h4 className="text-lg font-bold text-brand-900">เลือกสินค้าและจำนวน</h4>
                                <p className="text-brand-600">ดูเรทราคาที่ต้องการ สามารถคละสินค้าได้ทั้งไส้กรอก หมูแดดเดียว แหนมเนือง</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-900 text-white flex items-center justify-center font-bold text-xl">2</div>
                            <div>
                                <h4 className="text-lg font-bold text-brand-900">แอด LINE สั่งซื้อ/ชำระเงิน</h4>
                                <p className="text-brand-600">ทักแชทหาแอดมิน ยืนยันออเดอร์ และชำระเงิน (มีบริการเก็บเงินปลายทาง +3%)</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-900 text-white flex items-center justify-center font-bold text-xl">3</div>
                            <div>
                                <h4 className="text-lg font-bold text-brand-900">รอรับของหน้าบ้าน</h4>
                                <p className="text-brand-600">จัดส่งรถห้องเย็นทั่วประเทศ สินค้าไม่เสีย รับประกันเคลมได้ 100% รอรับภายใน 1-2 วัน</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <Footer />
        </main>
    );
}
