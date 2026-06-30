/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
  addToCart: (meal: { mealId: string; name: string; thumbnail: string; category: string; area: string }, quantity?: number) => Promise<void>;
  updateCartQuantity: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('cartItems');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get<CartItem[]>('/api/cart');
      setCartItems(response.data);
      try {
        localStorage.setItem('cartItems', JSON.stringify(response.data));
      } catch (e) {
        console.error('Failed to save cart to localStorage:', e);
      }
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch cart:', err);
      setError('Gagal memuat barang keranjang.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (meal: { mealId: string; name: string; thumbnail: string; category: string; area: string }, quantity: number = 1) => {
    try {
      setError(null);
      await axios.post('/api/cart', {
        mealId: meal.mealId,
        name: meal.name,
        thumbnail: meal.thumbnail,
        category: meal.category,
        area: meal.area,
        quantity: quantity
      });
      // Synchronize with server state
      await refreshCart();
    } catch (err: any) {
      console.error('Failed to add to cart:', err);
      setError('Gagal menambahkan item ke keranjang.');
      throw err;
    }
  };

  const updateCartQuantity = async (id: string, quantity: number) => {
    try {
      setError(null);
      await axios.put(`/api/cart/${id}`, { quantity });
      await refreshCart();
    } catch (err: any) {
      console.error('Failed to update cart quantity:', err);
      setError('Gagal memperbarui jumlah item.');
      throw err;
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      setError(null);
      await axios.delete(`/api/cart/${id}`);
      // Synchronize with server state
      await refreshCart();
    } catch (err: any) {
      console.error('Failed to remove from cart:', err);
      setError('Gagal menghapus item dari keranjang.');
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      await axios.delete('/api/cart');
      setCartItems([]);
      try {
        localStorage.setItem('cartItems', JSON.stringify([]));
      } catch (e) {
        console.error('Failed to clear cart localStorage:', e);
      }
    } catch (err: any) {
      console.error('Failed to clear cart:', err);
      setError('Gagal mengosongkan keranjang.');
      throw err;
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, loading, error, addToCart, updateCartQuantity, removeFromCart, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
