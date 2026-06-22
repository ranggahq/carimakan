/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Utensils, Flame, Sparkles } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import FoodCard from '../components/FoodCard';
import { Meal } from '../types';
import { translateCategory } from '../utils';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [popularMeals, setPopularMeals] = useState<Meal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { incrementSearchActivity } = useAuth();

  // Available categories list
  const categories = ["All", "Chicken", "Beef", "Vegetarian", "Dessert", "Seafood", "Pasta", "Breakfast"];

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 450);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Load meals based on search input and selected category filter working together
  const loadMeals = async (query: string = '', category: string = 'All') => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '/api/meals';
      const params: string[] = [];
      if (query.trim() !== '') {
        params.push(`q=${encodeURIComponent(query.trim())}`);
        incrementSearchActivity();
      }
      if (category !== 'All') {
        params.push(`category=${encodeURIComponent(category)}`);
      }
      
      if (params.length > 0) {
        url = `/api/meals?${params.join('&')}`;
      }
      
      const response = await axios.get<Meal[]>(url);
      setMeals(response.data);
    } catch (err: any) {
      console.error('Error fetching filtered meals:', err);
      setError('Gagal memuat resep makanan. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch standard popular meals for the popular foods section
  const loadPopularMeals = async () => {
    try {
      const response = await axios.get<Meal[]>('/api/meals');
      // Take a distinct pool of 4 meals for the Makanan Populer section
      setPopularMeals(response.data.slice(4, 12));
    } catch (err) {
      console.error('Error fetching popular meals:', err);
    }
  };

  // Synchronize dynamic queries
  useEffect(() => {
    loadMeals(debouncedQuery, selectedCategory);
  }, [debouncedQuery, selectedCategory]);

  // On mount, load initial popular grid
  useEffect(() => {
    loadPopularMeals();
  }, []);

  const handleRetry = () => {
    loadMeals(searchQuery, selectedCategory);
    loadPopularMeals();
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
  };

  return (
    <div className="min-h-screen bg-[#0F0F10] text-gray-100 flex flex-col" id="home-page-root">
      
      {/* 1. Hero Section */}
      <section className="bg-gradient-to-b from-[#161618] to-[#0F0F10] border-b border-gray-800/60 py-16 sm:py-20 px-4 flex items-center justify-center relative overflow-hidden" id="home-hero">
        <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-amber-500/10 rounded-full text-amber-500 font-sans font-bold text-xs uppercase tracking-wider border border-amber-500/20"
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>Temukan Makanan Favorit Anda</span>
          </motion.div>

          <h1 className="font-sans font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            Jelajahi Aneka Resep dan <br className="hidden sm:inline" />
            <span className="text-amber-500 font-bold">Kuliner Pilihan Dunia</span>
          </h1>

          <p className="font-sans text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Jelajahi berbagai resep dan makanan pilihan dari seluruh dunia. Temukan bahan-bahan masakan, ikuti petunjuk memasak, dan simpan resep favorit keluarga Anda dengan praktis.
          </p>
        </div>
      </section>

      {/* 2. Search Bar Section */}
      <section className="px-4 -mt-7 sm:-mt-8 relative z-20" id="home-search-section">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Cari menu, resep, atau bahan kuliner..."
          onSubmit={(e) => {
            e.preventDefault();
            loadMeals(searchQuery, selectedCategory);
          }}
        />
      </section>

      {/* Main content layout with sections 3, 4, and 5 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16" id="home-main">
        
        {/* 3. Kategori Populer (Popular Categories) */}
        <section className="space-y-4" id="kategori-populer">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <h2 className="font-sans font-bold text-white text-lg sm:text-xl tracking-tight">
              Kategori Populer
            </h2>
          </div>
          
          {/* Categories chip list with horizontal scroll support */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none" id="categories-chips-container">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`cursor-pointer px-4 sm:px-5 py-2 rounded-full font-sans text-xs sm:text-sm font-semibold transition-all duration-300 transform active:scale-95 whitespace-nowrap border ${
                    isActive
                      ? 'bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/10'
                      : 'bg-[#161618] text-gray-400 hover:text-white border-gray-800 hover:border-gray-700'
                  }`}
                  id={`chip-${cat}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Rekomendasi Untuk Anda (Recommendations for You) */}
        <section className="space-y-6" id="rekomendasi-makanan">
          <div className="flex items-center justify-between" id="rekomendasi-head">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500">
                <Utensils className="h-4.5 w-4.5" />
              </div>
              <h2 className="font-sans font-bold text-white text-lg sm:text-xl tracking-tight">
                Rekomendasi Untuk Anda
              </h2>
              {debouncedQuery.trim() !== '' && (
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 font-sans font-bold text-xxs px-2.5 py-0.5 rounded-full">
                  {meals.length} resep ditemukan
                </span>
              )}
            </div>
          </div>

          {/* Render Meals Grid */}
          {loading ? (
            // Skeleton loader grid
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="skeleton-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-[#161618] border border-gray-800 rounded-2xl p-4 space-y-4 shadow-md animate-pulse">
                  <div className="bg-zinc-800 aspect-video rounded-xl w-full" />
                  <div className="space-y-2.5">
                    <div className="h-4 bg-zinc-800 rounded w-1/3" />
                    <div className="h-6 bg-zinc-800 rounded w-5/6" />
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-gray-800">
                    <div className="h-9 bg-zinc-800 rounded-xl flex-1" />
                    <div className="h-9 bg-zinc-800 rounded-xl flex-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="bg-[#161618] border border-red-500/10 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-lg space-y-5" id="error-box">
              <div className="bg-red-500/10 text-red-500 w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <RefreshCw className="h-6 w-6 animate-spin-reverse" />
              </div>
              <div className="space-y-2">
                <h3 className="font-sans font-bold text-white text-lg">Terjadi Kesalahan</h3>
                <p className="font-sans text-gray-400 text-sm leading-relaxed">{error}</p>
              </div>
              <button
                onClick={handleRetry}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-sans font-bold text-sm rounded-xl transition-all duration-300 cursor-pointer"
              >
                Coba Lagi
              </button>
            </div>
          ) : meals.length === 0 ? (
            // Empty State
            <div className="bg-[#161618] border border-gray-800 rounded-2xl p-10 sm:p-14 text-center max-w-md mx-auto shadow-md space-y-5" id="empty-box">
              <div className="bg-amber-500/10 text-amber-500 w-14 h-14 rounded-full flex items-center justify-center mx-auto">
                <Utensils className="h-6 w-6" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="font-sans font-bold text-white text-base">Menu Tidak Ditemukan</h3>
                <p className="font-sans text-gray-400 text-xs sm:text-sm leading-relaxed">
                  Maaf, resep makanan {searchQuery ? `"${searchQuery}"` : ''} di kategori {translateCategory(selectedCategory)} tidak ditemukan. Coba masukkan kata kunci yang berbeda.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDebouncedQuery('');
                  setSelectedCategory('All');
                }}
                className="px-5 py-2.5 bg-[#222225] hover:bg-[#2c2c30] text-gray-200 font-sans font-bold text-xs rounded-xl transition-all duration-300"
              >
                Atur Ulang Pencarian & Filter
              </button>
            </div>
          ) : (
            // Result list grid
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7"
              id="meals-container"
            >
              <AnimatePresence mode="popLayout">
                {meals.map((meal) => (
                  <FoodCard key={meal.id} meal={meal} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

        {/* 5. Makanan Populer (Popular Foods) */}
        <section className="space-y-6 pt-4 border-t border-gray-850" id="makanan-populer">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500">
              <Flame className="h-4.5 w-4.5" />
            </div>
            <h2 className="font-sans font-bold text-white text-lg sm:text-xl tracking-tight">
              Makanan Populer
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7" id="popular-meals-container">
            {popularMeals.length > 0 ? (
              popularMeals.map((meal) => (
                <FoodCard key={`pop-${meal.id}`} meal={meal} />
              ))
            ) : (
              // Skeletal loading for the popular list
              Array.from({ length: 4 }).map((_, i) => (
                <div key={`skew-pop-${i}`} className="bg-[#161618] border border-gray-800 rounded-2xl p-4 space-y-4 shadow-md animate-pulse">
                  <div className="bg-zinc-800 aspect-video rounded-xl w-full" />
                  <div className="space-y-2.5">
                    <div className="h-4 bg-zinc-800 rounded w-1/3" />
                    <div className="h-6 bg-zinc-800 rounded w-5/6" />
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-gray-800">
                    <div className="h-9 bg-zinc-800 rounded-xl flex-1" />
                    <div className="h-9 bg-zinc-800 rounded-xl flex-1" />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
