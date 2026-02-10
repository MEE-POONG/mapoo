'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
        imageUrl: string;
        unit: string;
    }
}

interface Cart {
    id: string;
    items: CartItem[];
}

interface CartContextType {
    cart: Cart | null;
    loading: boolean;
    refreshCart: () => Promise<void>;
    addToCart: (productId: string, quantity?: number) => Promise<boolean>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshCart = useCallback(async () => {
        try {
            const res = await fetch('/api/cart');
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (error) {
            console.error('Error refreshing cart:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const addToCart = async (productId: string, quantity: number = 1) => {
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity }),
            });
            const data = await res.json();
            if (res.ok) {
                setCart(data);
                return true;
            } else {
                alert(data.error || 'ไม่สามารถเพิ่มสินค้าลงในตะกร้าได้');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
        return false;
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        try {
            const res = await fetch('/api/cart', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity }),
            });
            const data = await res.json();
            if (res.ok) {
                setCart(data);
            } else {
                alert(data.error || 'ไม่สามารถปรับจำนวนสินค้าได้');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
    };

    const removeItem = async (productId: string) => {
        try {
            const res = await fetch(`/api/cart?productId=${productId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const clearCart = async () => {
        try {
            const res = await fetch('/api/cart', {
                method: 'DELETE',
            });
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const itemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            refreshCart,
            addToCart,
            updateQuantity,
            removeItem,
            clearCart,
            itemCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
