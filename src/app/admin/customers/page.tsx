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
    const { admin, isLoading: authLoading, isAuthenticated, logout } = useAdminAuth();
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
            const res = await fetch('/api/admin/customers');
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
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin"
                            className="p-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <Users className="w-7 h-7 text-blue-600" />
                                จัดการลูกค้า
                            </h1>
                            <p className="text-gray-500">ลูกค้าทั้งหมด {customers.length} คน</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อ, อีเมล, เบอร์โทร..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Customer List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    </div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                        <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">ไม่พบลูกค้า</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredCustomers.map((customer) => (
                            <div
                                key={customer.id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                            >
                                <div
                                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => setExpandedId(expandedId === customer.id ? null : customer.id)}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                                {customer.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                                    {customer.name}
                                                    {customer.isVerified && (
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                    )}
                                                </h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                                    <Mail className="w-3 h-3" />
                                                    {customer.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-6">
                                            <div className="text-center">
                                                <p className="text-xs text-gray-400 font-medium">คำสั่งซื้อ</p>
                                                <p className="font-bold text-gray-900">{customer.totalOrders}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs text-gray-400 font-medium">ยอดรวม</p>
                                                <p className="font-bold text-green-600">฿{customer.totalSpent.toLocaleString()}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs text-gray-400 font-medium">วันที่สมัคร</p>
                                                <p className="font-medium text-gray-700 text-sm">
                                                    {new Date(customer.createdAt).toLocaleDateString('th-TH')}
                                                </p>
                                            </div>
                                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === customer.id ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedId === customer.id && (
                                    <div className="px-6 pb-6 border-t border-gray-100 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Contact Info */}
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <h4 className="font-bold text-gray-700 mb-3 text-sm">ข้อมูลติดต่อ</h4>
                                                <div className="space-y-2 text-sm">
                                                    <p className="flex items-center gap-2 text-gray-600">
                                                        <Phone className="w-4 h-4 text-gray-400" />
                                                        {customer.phone || 'ไม่ระบุ'}
                                                    </p>
                                                    <p className="flex items-start gap-2 text-gray-600">
                                                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                                        {customer.address || 'ไม่ระบุที่อยู่'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Recent Orders */}
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <h4 className="font-bold text-gray-700 mb-3 text-sm">คำสั่งซื้อล่าสุด</h4>
                                                {customer.recentOrders.length === 0 ? (
                                                    <p className="text-gray-400 text-sm">ยังไม่มีคำสั่งซื้อ</p>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {customer.recentOrders.map((order) => (
                                                            <div key={order.id} className="flex items-center justify-between text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                                        {order.status}
                                                                    </span>
                                                                    <span className="text-gray-500">
                                                                        {new Date(order.createdAt).toLocaleDateString('th-TH')}
                                                                    </span>
                                                                </div>
                                                                <span className="font-bold text-gray-900">
                                                                    ฿{order.totalAmount.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
