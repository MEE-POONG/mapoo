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
    clearStorageAndReload: () => void;
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
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        try {
            const res = await fetch('/api/admin/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${tokenToVerify}`
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                setAdmin(data.admin);
            } else {
                // Token invalid, clear storage
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_data');
                setAdmin(null);
                setToken(null);
                // Clear cookie
                document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            }
        } catch (error) {
            console.error('Token verification error:', error);
            // On error (timeout), we still want to stop loading
            // We might want to keep the local state if it's just a temporary network blip
            // but for safety, if we can't verify, we might want to stay in loading or just proceed
        } finally {
            clearTimeout(timeoutId);
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

    const clearStorageAndReload = () => {
        logout();
        window.location.href = '/admin/login';
    };

    return (
        <AdminAuthContext.Provider value={{
            admin,
            token,
            isLoading,
            isAuthenticated: !!admin && !!token,
            login,
            logout,
            clearStorageAndReload
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
