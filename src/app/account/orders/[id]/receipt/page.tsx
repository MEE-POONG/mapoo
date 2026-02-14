'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Printer, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export default function ReceiptPage() {
    const { id } = useParams();
    const { token, isLoading } = useAuth();
    const isAuthenticated = !!token;
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (isAuthenticated && id) {
            fetchOrder();
        }
    }, [isAuthenticated, isLoading, id]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/customer/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            const found = data.orders.find((o: any) => o.id === id);
            if (found) {
                setOrder(found);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!order) return <div className="text-center py-20">ไม่พบข้อมูลใบสั่งซื้อ</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 print:bg-white print:py-0">
            {/* Control Bar */}
            <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
                    <ArrowLeft className="w-4 h-4" /> กลับ
                </button>
                <button
                    onClick={() => window.print()}
                    className="bg-brand-900 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg"
                >
                    <Printer className="w-4 h-4" /> พิมพ์ใบเสร็จ
                </button>
            </div>

            {/* Receipt Card */}
            <div id="receipt" className="max-w-3xl mx-auto bg-white p-10 md:p-16 rounded-3xl shadow-xl border border-gray-100 print:shadow-none print:border-none print:p-0">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12 pb-12 border-b-2 border-dashed border-gray-100">
                    <div>
                        <h1 className="text-4xl font-black text-brand-900 mb-2">SiamSausage</h1>
                        <p className="text-gray-500 font-medium">ไส้กรอกอีสาน & หมูแดดเดียวพรีเมียม</p>
                        <div className="mt-4 text-sm text-gray-400 space-y-1">
                            <p>123 หมู่ 4 ต.ในเมือง อ.เมือง จ.ขอนแก่น 40000</p>
                            <p>โทร: 089-123-4567 | LINE: @siamsausage</p>
                        </div>
                    </div>
                    <div className="text-right md:text-right w-full md:w-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">ใบรับรองคำสั่งซื้อ</h2>
                        <p className="text-brand-600 font-mono font-bold tracking-wider">#{order.id.slice(-8).toUpperCase()}</p>
                        <p className="text-gray-400 text-sm mt-2">วันที่สั่งซื้อ: {format(new Date(order.createdAt), 'dd MMMM yyyy', { locale: th })}</p>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">ข้อมูลผู้ซื้อ</h3>
                        <p className="text-lg font-bold text-gray-900">{order.customerName}</p>
                        <p className="text-gray-600 mt-1">{order.phone}</p>
                        <p className="text-gray-500 text-sm mt-2 leading-relaxed">{order.address}</p>
                    </div>
                    <div className="md:text-right">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">สถานะการชำระเงิน</h3>
                        <div className={`inline-block px-4 py-1.5 rounded-full font-bold text-sm ${order.status === 'CANCELLED' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                            }`}>
                            {order.status === 'PENDING' ? 'รอตรวจสอบการชำระเงิน' : 'ชำระเงินเรียบร้อยแล้ว'}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="mb-12">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-gray-100">
                                <th className="py-4 font-bold text-gray-800">รายการสินค้า</th>
                                <th className="py-4 px-4 font-bold text-gray-800 text-center">จำนวน</th>
                                <th className="py-4 font-bold text-gray-800 text-right">ราคาหน่วย</th>
                                <th className="py-4 font-bold text-gray-800 text-right text-accent-600">ราคารวม</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item: any) => (
                                <tr key={item.id} className="border-b border-gray-50">
                                    <td className="py-6 font-medium text-gray-900">{item.product.name}</td>
                                    <td className="py-6 px-4 text-center font-bold text-gray-600">{item.quantity}</td>
                                    <td className="py-6 text-right text-gray-500">฿{item.price.toLocaleString()}</td>
                                    <td className="py-6 text-right font-bold text-gray-900">฿{(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                <div className="flex flex-col items-end gap-3 pt-6 border-t-2 border-gray-100">
                    <div className="flex justify-between w-full max-w-xs text-gray-500">
                        <span>รวมราคาปกติ:</span>
                        <span className="font-bold">฿{(order.totalAmount + (order.discountAmount || 0) - (order.totalAmount < 2200 ? 0 : 0)).toLocaleString()}</span>
                    </div>
                    {order.discountAmount > 0 && (
                        <div className="flex justify-between w-full max-w-xs text-red-500">
                            <span>ส่วนลด:</span>
                            <span className="font-bold">- ฿{order.discountAmount.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="flex justify-between w-full max-w-xs text-gray-500">
                        <span>ค่าจัดส่ง:</span>
                        <span className="font-bold">{order.totalAmount >= 2200 || order.items.reduce((acc: any, i: any) => acc + i.quantity, 0) >= 10 ? 'ฟรี' : '฿40'}</span>
                    </div>
                    <div className="flex justify-between w-full max-w-xs mt-4 pt-4 border-t-2 border-double border-gray-200">
                        <span className="text-xl font-bold text-gray-900">ยอดชำระสุทธิ:</span>
                        <span className="text-3xl font-black text-brand-900">฿{order.totalAmount.toLocaleString()}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-20 text-center">
                    <p className="text-gray-300 text-xs italic mb-4">ขอบคุณที่อุดหนุนสินค้าจากเรา ความพึงพอใจของคุณคือความภูมิใจของเรา</p>
                    <div className="w-16 h-1 bg-brand-100 mx-auto rounded-full"></div>
                </div>
            </div>
        </div>
    );
}
