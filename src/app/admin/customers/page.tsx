'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';
import {
    Users,
    Mail,
    Phone,
    MapPin,
    ShoppingBag,
    DollarSign,
    ChevronLeft,
    Loader2,
    Search,
    Calendar,
    ShieldCheck,
    LogOut,
    CheckCircle,
    Clock,
    ChevronDown
} from 'lucide-react';
import AdminHeader from '@/components/AdminHeader';

interface Customer {
    id: string;
    email: string;
    name: string;
    phone?: string;
    address?: string;
    isVerified: boolean;
    createdAt: string;
    totalOrders: number;
    totalSpent: number;
    recentOrders: Array<{
        id: string;
        totalAmount: number;
        status: string;
        createdAt: string;
    }>;
}

export default function CustomersPage() {
    const router = useRouter();
    const { admin, token, isLoading: authLoading, isAuthenticated, logout } = useAdminAuth();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/admin/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCustomers();
        }
    }, [isAuthenticated]);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/admin/customers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setCustomers(data.customers || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)
    );

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'PENDING': 'bg-yellow-100 text-yellow-700',
            'PROCESSING': 'bg-blue-100 text-blue-700',
            'SHIPPED': 'bg-purple-100 text-purple-700',
            'DELIVERED': 'bg-green-100 text-green-700',
            'CANCELLED': 'bg-red-100 text-red-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 mb-6 md:mb-10">
                    <div className="flex items-center gap-4 md:gap-6">
                        <Link
                            href="/admin"
                            className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 hover:border-gray-900 transition-all group"
                        >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-gray-900" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 md:gap-3 mb-0.5 md:mb-1">
                                <div className="hidden sm:flex w-6 h-6 md:w-8 md:h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                                    <Users className="w-3 h-3 md:w-4 md:h-4 text-purple-600" />
                                </div>
                                <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">รายชื่อลูกค้า</h1>
                            </div>
                            <p className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1 sm:ml-11">{customers.length} Registered Users</p>
                        </div>
                    </div>
                </div>

                {/* Search Box */}
                <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-gray-100 mb-6 md:mb-10 ring-4 ring-gray-100/50">
                    <div className="relative group">
                        <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 md:w-5 md:h-5 group-focus-within:text-gray-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="ค้นหาตามชื่อ, อีเมล หรือ เบอร์โทรศัพท์..."
                            className="w-full pl-11 md:pl-14 pr-5 md:pr-6 py-3 md:py-4 bg-gray-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all font-bold text-sm md:text-base placeholder:font-medium placeholder:text-gray-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Customers Table/List */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 text-gray-900 animate-spin" />
                        </div>
                    ) : filteredCustomers.length > 0 ? (
                        filteredCustomers.map(customer => (
                            <div key={customer.id} className="bg-white rounded-2xl md:rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                                <div
                                    className="p-5 md:p-8 cursor-pointer"
                                    onClick={() => setExpandedId(expandedId === customer.id ? null : customer.id)}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
                                        <div className="flex items-center gap-4 md:gap-6">
                                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl md:rounded-2xl flex items-center justify-center border border-gray-100 shrink-0">
                                                <Users className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 md:gap-3 mb-0.5 md:mb-1">
                                                    <h3 className="text-base md:text-xl font-black text-gray-900 truncate">{customer.name}</h3>
                                                    {customer.isVerified && (
                                                        <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500 shrink-0" />
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-gray-400 font-bold text-[10px] md:text-xs uppercase tracking-wider">
                                                    <span className="flex items-center gap-1.5 truncate max-w-[150px] sm:max-w-none">
                                                        <Mail className="w-3 h-3" />
                                                        {customer.email}
                                                    </span>
                                                    <span className="hidden xs:inline">•</span>
                                                    <span>สั่งซื้อแล้ว {customer.totalOrders} ครั้ง</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between lg:justify-end gap-6 md:gap-8">
                                            <div className="text-left lg:text-right">
                                                <p className="text-[8px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5 md:mb-1">ยอดสั่งซื้อสะสม</p>
                                                <p className="text-lg md:text-2xl font-black text-gray-900">฿{customer.totalSpent.toLocaleString()}</p>
                                            </div>
                                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center bg-gray-50 transition-transform duration-300 ${expandedId === customer.id ? 'rotate-180 bg-gray-900 text-white' : 'text-gray-400'}`}>
                                                <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {expandedId === customer.id && (
                                    <div className="px-5 md:px-8 pb-5 md:pb-8 animate-in slide-in-from-top-4 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 pt-5 md:pt-8 border-t border-gray-50">
                                            <div className="space-y-4 md:space-y-6">
                                                <h4 className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">ข้อมูลติดต่อ</h4>
                                                <div className="bg-gray-50 p-4 md:p-6 rounded-2xl md:rounded-[2rem] space-y-3 md:space-y-4">
                                                    <div className="flex items-center gap-2.5 md:gap-3 text-sm md:text-base text-gray-700 font-bold">
                                                        <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                                                        {customer.phone || 'ไม่ระบุเบอร์โทรศัพท์'}
                                                    </div>
                                                    <div className="flex items-start gap-2.5 md:gap-3 text-sm md:text-base text-gray-700 font-bold">
                                                        <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mt-0.5 md:mt-1" />
                                                        <span className="flex-1 leading-relaxed md:leading-normal">{customer.address || 'ไม่มีข้อมูลที่อยู่'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4 md:space-y-6">
                                                <h4 className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">คำสั่งซื้อล่าสุด</h4>
                                                <div className="space-y-2 md:space-y-3">
                                                    {customer.recentOrders.length > 0 ? (
                                                        customer.recentOrders.map(order => (
                                                            <div key={order.id} className="flex items-center justify-between p-3 md:p-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm">
                                                                <div>
                                                                    <p className="text-xs md:text-sm font-black text-gray-900 mb-0.5 md:mb-1">#{order.id.slice(-6).toUpperCase()}</p>
                                                                    <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase">{new Date(order.createdAt).toLocaleDateString('th-TH')}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-xs md:text-sm font-black text-gray-900 mb-0.5 md:mb-1">฿{order.totalAmount.toLocaleString()}</p>
                                                                    <span className={`text-[8px] md:text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${getStatusColor(order.status)}`}>
                                                                        {order.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-8 md:p-10 text-center bg-gray-50 rounded-2xl md:rounded-[2rem] border-2 border-dashed border-gray-200">
                                                            <p className="text-[10px] md:text-sm text-gray-400 font-bold italic">ยังไม่มีประวัติการสั่งซื้อ</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                            <Users className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                            <h3 className="text-xl font-black text-gray-900 mb-2">ไม่พบรายชื่อลูกค้า</h3>
                            <p className="text-gray-400 font-bold">ข้อมูลลูกค้าจากการสมัครสมาชิกและสั่งซื้อจะปรากฏที่นี่</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
