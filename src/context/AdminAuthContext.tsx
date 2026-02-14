'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Admin {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface AdminAuthContextType {
    admin: Admin | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load auth state from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('admin_token');
        const savedAdmin = localStorage.getItem('admin_data');

        if (savedToken && savedAdmin) {
            setToken(savedToken);
            setAdmin(JSON.parse(savedAdmin));

            // Sync cookie if missing
            if (!document.cookie.includes('admin_token=')) {
                document.cookie = `admin_token=${savedToken}; path=/; max-age=86400; samesite=lax`;
            }

            // Verify token is still valid
            verifyToken(savedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    const verifyToken = async (tokenToVerify: string) => {
        try {
            const res = await fetch('/api/admin/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${tokenToVerify}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setAdmin(data.admin);
            } else {
                // Token invalid, clear storage
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_data');
                setAdmin(null);
                setToken(null);
            }
        } catch (error) {
            console.error('Token verification error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch('/api/admin/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setToken(data.token);
                setAdmin(data.admin);
                localStorage.setItem('admin_token', data.token);
                localStorage.setItem('admin_data', JSON.stringify(data.admin));

                // Set cookie for middleware
                document.cookie = `admin_token=${data.token}; path=/; max-age=86400; samesite=lax`;

                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' };
        }
    };

    const logout = () => {
        setAdmin(null);
        setToken(null);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        // Clear cookie
        document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    };

    return (
        <AdminAuthContext.Provider value={{
            admin,
            token,
            isLoading,
            isAuthenticated: !!admin && !!token,
            login,
            logout
        }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
}
