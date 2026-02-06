import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
    return (
        <main className="min-h-screen bg-brand-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
                <h1 className="text-3xl font-bold text-brand-900 mb-8">ตะกร้าสินค้าของฉัน</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="flex-1 space-y-4">
                        {/* Item 1 */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-100 flex gap-4 items-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1551248429-40975aa4de74?w=200" alt="Product" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-brand-900 text-lg">ไส้กรอกอีสาน หมูล้วน</h3>
                                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-sm text-brand-500 mb-4">แพ็ค 1 กก. (50 ลูก)</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3 bg-brand-50 rounded-lg p-1">
                                        <button className="w-8 h-8 rounded-md bg-white text-brand-600 flex items-center justify-center hover:bg-brand-100 transition-colors shadow-sm">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-bold text-brand-900 w-4 text-center">2</span>
                                        <button className="w-8 h-8 rounded-md bg-white text-brand-600 flex items-center justify-center hover:bg-brand-100 transition-colors shadow-sm">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="font-bold text-lg text-accent-600">฿240</p>
                                </div>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-100 flex gap-4 items-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=200" alt="Product" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-brand-900 text-lg">หมูแดดเดียว พริกไทย</h3>
                                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-sm text-brand-500 mb-4">แพ็ค 500 กรัม</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3 bg-brand-50 rounded-lg p-1">
                                        <button className="w-8 h-8 rounded-md bg-white text-brand-600 flex items-center justify-center hover:bg-brand-100 transition-colors shadow-sm">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-bold text-brand-900 w-4 text-center">1</span>
                                        <button className="w-8 h-8 rounded-md bg-white text-brand-600 flex items-center justify-center hover:bg-brand-100 transition-colors shadow-sm">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="font-bold text-lg text-accent-600">฿150</p>
                                </div>
                            </div>
                        </div>

                        <Link href="/products" className="inline-flex items-center gap-2 text-brand-600 hover:text-accent-600 font-medium mt-4 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            เลือกซื้อสินค้าต่อ
                        </Link>
                    </div>

                    {/* Summary */}
                    <div className="w-full lg:w-96 flex-shrink-0">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 sticky top-24">
                            <h3 className="font-bold text-lg mb-6 text-brand-900 border-b border-brand-100 pb-4">สรุปคำสั่งซื้อ</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-brand-600">
                                    <span>ยอดรวมสินค้า</span>
                                    <span className="font-medium">฿390</span>
                                </div>
                                <div className="flex justify-between text-brand-600">
                                    <span>ค่าจัดส่ง (เหมาจ่าย)</span>
                                    <span className="font-medium">฿40</span>
                                </div>
                                <div className="flex justify-between text-brand-600">
                                    <span>ส่วนลด</span>
                                    <span className="font-medium text-green-600">-฿0</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-8 border-t border-brand-100 pt-4">
                                <span className="font-bold text-lg text-brand-900">ยอดสุทธิ</span>
                                <span className="font-bold text-2xl text-accent-600">฿430</span>
                            </div>

                            <button className="w-full bg-brand-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent-600 transition-all hover:shadow-lg shadow-accent-200">
                                สั่งซื้อสินค้า
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <p className="text-xs text-brand-400 text-center mt-4">
                                * ชำระเงินปลายทาง หรือ โอนผ่านธนาคาร
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
