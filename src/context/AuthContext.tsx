/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Meal } from '../types';
import { authService } from '../services/authService';

export interface User {
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  favorites: Meal[];
  addToFavorites: (meal: Meal) => void;
  removeFromFavorites: (mealId: string) => void;
  isFavorite: (mealId: string) => boolean;
  searchActivityCount: number;
  incrementSearchActivity: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<Meal[]>([]);
  const [searchActivityCount, setSearchActivityCount] = useState<number>(0);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      // 1. Get logged in user session
      const storedUser = localStorage.getItem('carimakan_session_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // 2. Get favorites list
      const storedFavs = localStorage.getItem('carimakan_favorites');
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }

      // 3. Get search activity count
      const storedSearches = localStorage.getItem('carimakan_search_activity');
      if (storedSearches) {
        setSearchActivityCount(parseInt(storedSearches, 10) || 0);
      }
    } catch (err) {
      console.error('Error initializing AuthState from LocalStorage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync favorites with local storage
  const addToFavorites = (meal: Meal) => {
    setFavorites(prev => {
      const exists = prev.some(item => item.id === meal.id);
      if (exists) return prev;
      const updated = [...prev, meal];
      localStorage.setItem('carimakan_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromFavorites = (mealId: string) => {
    setFavorites(prev => {
      const updated = prev.filter(item => item.id !== mealId);
      localStorage.setItem('carimakan_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (mealId: string) => {
    return favorites.some(item => item.id === mealId);
  };

  // Sync search activity count with local storage
  const incrementSearchActivity = () => {
    setSearchActivityCount(prev => {
      const updated = prev + 1;
      localStorage.setItem('carimakan_search_activity', updated.toString());
      return updated;
    });
  };

  // Login handler
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const res = await authService.login(email, password);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  // Logout handler
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      searchActivityCount,
      incrementSearchActivity
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
