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
    Loader2
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
import { Line } from 'react-chartjs-2';
import { format, addDays, subDays, addMonths, subMonths, addYears, subYears } from 'date-fns';
import { th } from 'date-fns/locale';
import AdminHeader from '@/components/AdminHeader';

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
    const { admin, token, isLoading: authLoading, isAuthenticated, logout } = useAdminAuth();

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

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/reports/sales?period=${period}&date=${date.toISOString()}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
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
        dateInputRef.current?.showPicker();
    };

    const getPeriodText = () => {
        if (period === 'day') return format(date, 'd MMMM yyyy', { locale: th });
        if (period === 'month') return format(date, 'MMMM yyyy', { locale: th });
        return format(date, 'yyyy', { locale: th });
    };

    const chartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#111827',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                displayColors: false,
                callbacks: {
                    label: (context: any) => `ยอดขาย: ฿${context.raw.toLocaleString()}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f3f4f6',
                },
                ticks: {
                    callback: (value: any) => `฿${value.toLocaleString()}`
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

    if (authLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8F9FB]">
            <AdminHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/admin"
                            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 hover:border-gray-900 transition-all group"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-gray-900" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-amber-600" />
                                </div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">รายงานยอดขาย</h1>
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-11">Sales Analytics & Data Visualization / {period.toUpperCase()} View</p>
                        </div>
                    </div>

                    <button
                        onClick={() => window.print()}
                        className="bg-white text-gray-900 border-2 border-gray-900 px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:bg-gray-900 hover:text-white transition-all shadow-xl shadow-gray-200"
                    >
                        <Download className="w-6 h-6" />
                        ส่งออกรายงาน
                    </button>
                </div>

                {/* Period & Date Controller */}
                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row items-stretch md:items-center gap-6 ring-4 ring-gray-100/50">
                    <div className="flex bg-gray-50 p-1.5 rounded-2xl">
                        {(['day', 'month', 'year'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${period === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-900'}`}
                            >
                                {p === 'day' ? 'รายวัน' : p === 'month' ? 'รายเดือน' : 'รายปี'}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 flex items-center justify-between md:justify-end gap-6 relative">
                        <button
                            onClick={handlePrev}
                            className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-400" />
                        </button>

                        <div
                            className="flex items-center gap-4 cursor-pointer group"
                            onClick={handleCalendarClick}
                        >
                            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg shadow-gray-200">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-gray-900">{getPeriodText()}</p>
                            </div>
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

                        <button
                            onClick={handleNext}
                            className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-gray-100">
                        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
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
                                <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
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
                                                    <td className="px-8 py-4 text-sm font-black text-gray-500 font-mono">{order.id.slice(-6).toUpperCase()}</td>
                                                    <td className="px-8 py-4 text-sm font-bold text-gray-700">{format(new Date(order.createdAt), 'dd MMM yy HH:mm', { locale: th })}</td>
                                                    <td className="px-8 py-4 text-sm font-black text-gray-900">{order.customerName}</td>
                                                    <td className="px-8 py-4 text-sm font-black text-amber-600">฿{order.totalAmount.toLocaleString()}</td>
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
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {order.status}
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
