'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
    TrendingUp,
    Calendar,
    Download,
    DollarSign,
    ShoppingBag,
    Users,
    ChevronLeft,
    ChevronRight,
    Loader2,
    ShieldCheck,
    LogOut
} from "lucide-react";
import Link from 'next/link';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { format, addDays, subDays, addMonths, subMonths, addYears, subYears } from 'date-fns';
import { th } from 'date-fns/locale';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function SalesReportPage() {
    const router = useRouter();
    const { admin, isLoading: authLoading, isAuthenticated, logout } = useAdminAuth();

    const [period, setPeriod] = useState<'day' | 'month' | 'year'>('month');
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const dateInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/admin/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [period, date, isAuthenticated]);

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/reports/sales?period=${period}&date=${date.toISOString()}`);
            const result = await res.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching sales data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrev = () => {
        if (period === 'day') setDate(subDays(date, 1));
        else if (period === 'month') setDate(subMonths(date, 1));
        else setDate(subYears(date, 1));
    };

    const handleNext = () => {
        if (period === 'day') setDate(addDays(date, 1));
        else if (period === 'month') setDate(addMonths(date, 1));
        else setDate(addYears(date, 1));
    };

    const handleCalendarClick = () => {
        if (dateInputRef.current) {
            try {
                // Modern browsers support showPicker()
                if ('showPicker' in HTMLInputElement.prototype) {
                    dateInputRef.current.showPicker();
                } else {
                    dateInputRef.current.click();
                }
            } catch (e) {
                dateInputRef.current.click();
            }
        }
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' as const },
                bodyFont: { size: 13 },
                displayColors: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    callback: (value: any) => '฿' + value.toLocaleString()
                }
            },
            x: {
                grid: {
                    display: false,
                }
            }
        }
    };

    const chartData = {
        labels: data?.chartData?.map((d: any) => d.label) || [],
        datasets: [
            {
                label: 'ยอดขาย',
                data: data?.chartData?.map((d: any) => d.revenue) || [],
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#f97316',
            }
        ]
    };

    const getPeriodText = () => {
        if (period === 'day') return format(date, 'd MMMM yyyy', { locale: th });
        if (period === 'month') return format(date, 'MMMM yyyy', { locale: th });
        return format(date, 'yyyy', { locale: th });
    };

    if (authLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Admin Header */}
            <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900">Admin Panel</h1>
                                <p className="text-xs text-gray-500">SiamSausage</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-700">{admin?.name}</p>
                                <p className="text-xs text-gray-400">{admin?.role}</p>
                            </div>
                            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <TrendingUp className="w-7 h-7 text-orange-600" />
                                สรุปยอดขาย
                            </h1>
                            <p className="text-gray-500">ติดตามภาพรวมรายได้และประสิทธิภาพการขาย</p>
                        </div>
                    </div>

                    <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                        {(['day', 'month', 'year'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${period === p
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {p === 'day' ? 'รายวัน' : p === 'month' ? 'รายเดือน' : 'รายปี'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date Navigation */}
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-brand-100 mb-8 flex items-center justify-between">
                    <button onClick={handlePrev} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-accent-500">
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div
                        onClick={handleCalendarClick}
                        className="relative group cursor-pointer flex items-center gap-3 bg-gray-50 px-6 py-2 rounded-2xl border border-gray-100 hover:border-accent-200 transition-all select-none active:scale-95"
                    >
                        <Calendar className="w-5 h-5 text-accent-500" />
                        <span className="text-lg font-black text-gray-900">{getPeriodText()}</span>

                        {period === 'year' ? (
                            <select
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                value={date.getFullYear()}
                                onChange={(e) => {
                                    const newDate = new Date(date);
                                    newDate.setFullYear(parseInt(e.target.value));
                                    setDate(newDate);
                                }}
                            >
                                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
                                    <option key={y} value={y}>{y + 543} (พ.ศ.) / {y}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                ref={dateInputRef}
                                type={period === 'month' ? 'month' : 'date'}
                                className="absolute inset-0 opacity-0 pointer-events-none w-full h-full"
                                value={
                                    period === 'month' ? format(date, 'yyyy-MM') :
                                        format(date, 'yyyy-MM-dd')
                                }
                                onChange={(e) => {
                                    if (!e.target.value) return;
                                    const selectedDate = new Date(e.target.value);
                                    if (!isNaN(selectedDate.getTime())) {
                                        setDate(selectedDate);
                                    }
                                }}
                            />
                        )}
                    </div>

                    <button onClick={handleNext} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-accent-500">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-gray-100">
                        <Loader2 className="w-12 h-12 text-accent-500 animate-spin mb-4" />
                        <p className="text-gray-400 font-bold italic">กำลังวิเคราะห์ข้อมูลยอดขาย...</p>
                    </div>
                ) : (
                    <>
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                                        <DollarSign className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">ยอดขายรวม</p>
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">฿{data?.summary?.totalRevenue.toLocaleString()}</h2>
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                        <ShoppingBag className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">จำนวนออเดอร์</p>
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{data?.summary?.totalOrders.toLocaleString()} ออเดอร์</h2>
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-green-500" />
                                    </div>
                                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">กำไรสุทธิ</p>
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">฿{data?.summary?.totalProfit.toLocaleString()}</h2>
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                                        <Users className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">ค่าเฉลี่ย/ออเดอร์</p>
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">฿{Math.round(data?.summary?.avgOrderValue).toLocaleString()}</h2>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-8">
                            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
                                <div className="w-2 h-6 bg-accent-500 rounded-full"></div>
                                กราฟแสดงแนวโน้มยอดขาย
                            </h3>
                            <div className="h-[400px] w-full">
                                <Line options={chartOptions} data={chartData} />
                            </div>
                        </div>

                        {/* Order Table */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                    <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                                    รายการสั่งซื้อในระบบ
                                </h3>
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-100 transition-all">
                                    <Download className="w-4 h-4" />
                                    ส่งออก Excel
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ออเดอร์ ID</th>
                                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">วันที่</th>
                                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ชื่อลูกค้า</th>
                                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ยอดรวม</th>
                                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ส่วนลด</th>
                                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">สถานะ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data?.orders.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic font-bold">ไม่พบข้อมูลการขายในรอบที่เลือก</td>
                                            </tr>
                                        ) : (
                                            data?.orders.map((order: any) => (
                                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-8 py-4 text-sm font-black text-gray-500 font-mono">{order.id.slice(-6)}</td>
                                                    <td className="px-8 py-4 text-sm font-bold text-gray-700">{format(new Date(order.createdAt), 'dd MMM yy HH:mm', { locale: th })}</td>
                                                    <td className="px-8 py-4 text-sm font-black text-gray-900">{order.customerName}</td>
                                                    <td className="px-8 py-4 text-sm font-black text-accent-600">฿{order.totalAmount.toLocaleString()}</td>
                                                    <td className="px-8 py-4">
                                                        {order.discountAmount > 0 ? (
                                                            <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                                                -฿{order.discountAmount.toLocaleString()}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-300">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {order.status === 'COMPLETED' ? 'สำเร็จ' : order.status === 'PENDING' ? 'รอดำเนินการ' : order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
