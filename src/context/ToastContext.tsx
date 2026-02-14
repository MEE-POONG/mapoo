'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 w-full max-w-md px-4 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center justify-between gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-10 duration-300 ${toast.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' :
                                toast.type === 'error' ? 'bg-red-50 border-red-100 text-red-800' :
                                    toast.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-800' :
                                        'bg-blue-50 border-blue-100 text-blue-800'
                            }`}
                    >
                        <div className="flex items-center gap-3 font-bold">
                            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                            {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-500" />}
                            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                            <span className="text-sm">{toast.message}</span>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 hover:bg-black/5 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 opacity-50" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
