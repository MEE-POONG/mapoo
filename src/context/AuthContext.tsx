'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Customer {
    id: string;
    email: string;
    name: string;
    phone?: string;
    address?: string;
}

interface AuthContextType {
    customer: Customer | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    updateProfile: (data: Partial<Customer>) => Promise<{ success: boolean; error?: string }>;
}

interface RegisterData {
    email: string;
    password: string;
    name: string;
    phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load auth state from localStorage on mount and verify with server
    useEffect(() => {
        const verifyAuth = async () => {
            const savedToken = localStorage.getItem('auth_token');
            const savedCustomer = localStorage.getItem('auth_customer');

            if (savedToken && savedCustomer) {
                try {
                    const res = await fetch('/api/auth/profile', {
                        headers: { 'Authorization': `Bearer ${savedToken}` }
                    });

                    if (res.ok) {
                        const data = await res.json();
                        setToken(savedToken);
                        setCustomer(data.customer);
                        localStorage.setItem('auth_customer', JSON.stringify(data.customer));
                    } else {
                        // Token expired or invalid
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('auth_customer');
                    }
                } catch {
                    // Network error - use cached data
                    setToken(savedToken);
                    setCustomer(JSON.parse(savedCustomer));
                }
            }
            setIsLoading(false);
        };

        verifyAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                return { success: false, error: data.error };
            }

            // Save to state and localStorage
            setToken(data.token);
            setCustomer(data.customer);
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('auth_customer', JSON.stringify(data.customer));

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' };
        }
    };

    const register = async (data: RegisterData) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (!res.ok) {
                return { success: false, error: result.error };
            }

            // Auto login after register
            setToken(result.token);
            setCustomer(result.customer);
            localStorage.setItem('auth_token', result.token);
            localStorage.setItem('auth_customer', JSON.stringify(result.customer));

            return { success: true };
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' };
        }
    };

    const logout = () => {
        setToken(null);
        setCustomer(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_customer');
    };

    const updateProfile = async (data: Partial<Customer>) => {
        if (!token) {
            return { success: false, error: 'กรุณาเข้าสู่ระบบ' };
        }

        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (!res.ok) {
                return { success: false, error: result.error };
            }

            setCustomer(result.customer);
            localStorage.setItem('auth_customer', JSON.stringify(result.customer));

            return { success: true };
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, error: 'เกิดข้อผิดพลาดในการอัพเดท' };
        }
    };

    return (
        <AuthContext.Provider value={{
            customer,
            token,
            isLoading,
            login,
            register,
            logout,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
