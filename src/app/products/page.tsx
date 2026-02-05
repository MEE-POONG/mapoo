import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus } from "lucide-react";

export default function ProductsPage() {
    return (
        <main className="min-h-screen bg-brand-50">
            <Navbar />

            {/* Header */}
            <header className="bg-brand-100 py-12 pt-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-brand-900 mb-2">สินค้าทั้งหมด</h1>
                    <p className="text-brand-600">
                        คัดสรรความอร่อย สูตรหมูแดดเดียว ไส้กรอกอีสาน ราคาส่ง
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 sticky top-24">
                            <h3 className="font-bold text-lg mb-4 text-brand-800">
                                หมวดหมู่สินค้า
                            </h3>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="form-checkbox h-5 w-5 text-accent-600 rounded border-brand-300 focus:ring-accent-500"
                                    />
                                    <span className="text-brand-600 group-hover:text-accent-600 transition-colors">
                                        ทั้งหมด
                                    </span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-5 w-5 text-accent-600 rounded border-brand-300 focus:ring-accent-500"
                                    />
                                    <span className="text-brand-600 group-hover:text-accent-600 transition-colors">
                                        ไส้กรอกอีสาน
                                    </span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-5 w-5 text-accent-600 rounded border-brand-300 focus:ring-accent-500"
                                    />
                                    <span className="text-brand-600 group-hover:text-accent-600 transition-colors">
                                        หมูแดดเดียว
                                    </span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-5 w-5 text-accent-600 rounded border-brand-300 focus:ring-accent-500"
                                    />
                                    <span className="text-brand-600 group-hover:text-accent-600 transition-colors">
                                        แหนมเนือง
                                    </span>
                                </label>
                            </div>
                        </div>
                    </aside>

                    {/* Grid */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-brand-500 text-sm">ค้นพบ 12 รายการ</span>
                            <select className="border-brand-200 rounded-lg text-sm text-brand-700 bg-white shadow-sm focus:border-accent-500 focus:ring-accent-500 p-2">
                                <option>เรียงตาม: ยอดนิยม</option>
                                <option>เรียงตาม: ราคา ต่ำ-สูง</option>
                                <option>เรียงตาม: ราคา สูง-ต่ำ</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Product 1 */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-brand-100">
                                <div className="relative pt-[100%] bg-gray-100 overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1551248429-40975aa4de74?w=500"
                                        alt="Product"
                                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="mb-2">
                                        <span className="text-xs text-accent-600 font-bold uppercase tracking-wider bg-orange-50 px-2 py-1 rounded-full">
                                            ขายดี
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-brand-900 mb-1 group-hover:text-accent-600 transition-colors">
                                        ไส้กรอกอีสาน หมูล้วน
                                    </h3>
                                    <p className="text-brand-400 text-xs mb-3">
                                        50 ลูก / 1 กิโลกรัม
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-brand-800">
                                            ฿120
                                        </span>
                                        <button className="bg-brand-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors flex items-center gap-1">
                                            <Plus className="w-4 h-4" />
                                            เพิ่ม
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Product 2 */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-brand-100">
                                <div className="relative pt-[100%] bg-gray-100 overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500"
                                        alt="Product"
                                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="mb-2">
                                        <span className="text-xs text-brand-400 font-bold uppercase tracking-wider bg-brand-50 px-2 py-1 rounded-full">
                                            สูตรดั้งเดิม
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-brand-900 mb-1 group-hover:text-accent-600 transition-colors">
                                        ไส้กรอกอีสาน ติดมัน
                                    </h3>
                                    <p className="text-brand-400 text-xs mb-3">
                                        50 ลูก / 1 กิโลกรัม
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-brand-800">
                                            ฿95
                                        </span>
                                        <button className="bg-brand-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors flex items-center gap-1">
                                            <Plus className="w-4 h-4" />
                                            เพิ่ม
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Product 3 */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-brand-100">
                                <div className="relative pt-[100%] bg-gray-100 overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=500"
                                        alt="Product"
                                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="mb-2">
                                        <span className="text-xs text-brand-400 font-bold uppercase tracking-wider bg-brand-50 px-2 py-1 rounded-full">
                                            ใหม่
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-brand-900 mb-1 group-hover:text-accent-600 transition-colors">
                                        หมูแดดเดียว พริกไทย
                                    </h3>
                                    <p className="text-brand-400 text-xs mb-3">
                                        แพ็ค 500 กรัม
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-brand-800">
                                            ฿150
                                        </span>
                                        <button className="bg-brand-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors flex items-center gap-1">
                                            <Plus className="w-4 h-4" />
                                            เพิ่ม
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
