/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart, Check, Tag, Globe, ListChecks, MessageSquare, Play, Sparkles, AlertCircle, Heart } from 'lucide-react';
import { Meal } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { translateCategory, translateArea } from '../utils';

// High-performance client-side in-memory cache to save loaded meals
const clientDetailCache: Record<string, Meal> = {};

export default function FoodDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { user, addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  
  // Find preloaded card data from navigation state if available
  const preloadedMeal = location.state?.meal as Meal | undefined;
  
  // Try retrieving full translated meal from client memory first
  const initialMeal = (id && clientDetailCache[id]) || preloadedMeal || null;

  const [meal, setMeal] = useState<Meal | null>(initialMeal);
  const [loading, setLoading] = useState<boolean>(!initialMeal);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [addingState, setAddingState] = useState<boolean>(false);

  // Checks if active recipe is stored inside favorite catalog
  const hasFavorited = meal ? isFavorite(meal.id) : false;

  const handleToggleFavorite = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!meal) return;
    if (hasFavorited) {
      removeFromFavorites(meal.id);
    } else {
      addToFavorites(meal);
    }
  };

  useEffect(() => {
    const loadMealDetail = async () => {
      if (!id) return;
      
      // If we already have the fully detailed, processed meal cached in memory, skip remote fetch!
      if (clientDetailCache[id]) {
        setMeal(clientDetailCache[id]);
        setLoading(false);
        return;
      }

      try {
        if (!initialMeal) {
          setLoading(true);
        }
        setError(null);
        const response = await axios.get<Meal>(`/api/meals/${id}`);
        const data = response.data;
        
        // Save to client cache
        clientDetailCache[id] = data;
        setMeal(data);
      } catch (err: any) {
        console.error('Error fetching meal detail:', err);
        // Only trigger error page if we literally have no recipe data at all (neither cached nor preloaded)
        if (!meal && !preloadedMeal) {
          setError('Gagal memuat resep detail makanan. Silakan cek koneksi internet Anda.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadMealDetail();
  }, [id, initialMeal]);

  const handleIncrement = () => {
    if (quantity < 10) setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCart = async () => {
    if (!meal) return;
    try {
      setAddingState(true);
      await addToCart({
        mealId: meal.id,
        name: meal.name,
        thumbnail: meal.thumbnail,
        category: meal.category,
        area: meal.area
      }, quantity);
      
      setTimeout(() => {
        setAddingState(false);
      }, 1500);
    } catch {
      setAddingState(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-[#0F0F10] min-h-screen" id="detail-skeleton">
        <div className="flex items-center space-x-2 mb-8 animate-pulse">
          <div className="h-5 w-5 bg-zinc-850 rounded" />
          <div className="h-4 bg-zinc-850 rounded w-20" />
        </div>
        <div className="space-y-12 animate-pulse">
          {/* Top part skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            <div className="md:col-span-5">
              <div className="bg-[#161618] border border-gray-800 rounded-3xl aspect-video md:aspect-square w-full" />
            </div>
            <div className="md:col-span-7 space-y-6 flex flex-col justify-center">
              <div className="h-4 bg-[#161618] border border-gray-800 rounded w-1/4" />
              <div className="h-10 bg-[#161618] border border-gray-800 rounded w-3/4" />
              <div className="h-12 bg-[#161618] border border-gray-800 rounded-xl w-1/3" />
            </div>
          </div>
          {/* Bottom part skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 h-60 bg-[#161618] border border-gray-800 rounded-2xl" />
            <div className="md:col-span-8 h-80 bg-[#161618] border border-gray-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center bg-[#0F0F10] min-h-screen" id="detail-error">
        <div className="bg-[#161618] border border-gray-800 rounded-2xl p-10 max-w-md mx-auto shadow-lg space-y-6">
          <div className="text-red-500 bg-red-500/10 p-4 rounded-full w-14 h-14 flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-sans font-bold text-white text-lg">Terjadi Kesalahan</h3>
            <p className="font-sans text-gray-400 text-sm leading-relaxed">
              {error || 'Resep makanan tidak ditemukan atau ID tidak sah.'}
            </p>
          </div>
          <button 
            onClick={() => navigate('/home')} 
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-sans font-bold text-xs rounded-xl transition-all duration-300 shadow-md cursor-pointer"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const indonesianCategory = translateCategory(meal.category);
  const indonesianArea = translateArea(meal.area, meal.name);

  return (
    <div className="min-h-screen bg-[#0F0F10] text-gray-100 py-10 sm:py-14" id="detail-page-root">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back navigation button */}
        <button 
          onClick={() => navigate(-1)}
          className="cursor-pointer group inline-flex items-center space-x-2.5 text-gray-400 hover:text-white font-sans font-semibold text-sm transition-colors"
          id="back-btn"
        >
          <div className="bg-[#161618] group-hover:bg-gray-800 p-20 rounded-xl border border-gray-850 shadow-md transition-all duration-300">
            <ArrowLeft className="h-4 w-4 text-amber-500" />
          </div>
          <span>Kembali ke Pencarian</span>
        </button>

        {/* ========================================================= */}
        {/* LENGKAP BAGIAN ATAS: split Foto (kiri) & Detail/Cart (kanan) */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center" id="detail-top-section">
          
          {/* SISI KIRI: Foto Makanan */}
          <div className="md:col-span-5" id="detail-photo-pane">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-[#161618] p-3 rounded-3xl border border-gray-850 shadow-2xl relative overflow-hidden group"
              id="detail-img-frame"
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-900 relative">
                <img 
                  src={meal.thumbnail} 
                  alt={meal.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  id="detail-food-img"
                />
                
                {meal.youtube && (
                  <div className="absolute inset-x-0 bottom-4 flex justify-center">
                    <a 
                      href={meal.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-xs py-2 px-4 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105"
                      title="Saksikan Video Resep di YouTube"
                      id="youtube-anchor"
                    >
                      <Play className="h-4 w-4 fill-white" />
                      <span>Putar Video Instruksi</span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* SISI KANAN: Penjelasan, Metadata, & Tombol Tambah ke Keranjang */}
          <div className="md:col-span-7 space-y-6 flex flex-col justify-center" id="detail-metadata-pane">
            
            {/* Tag Kategori & Asal Makanan */}
            <div className="flex flex-wrap gap-2" id="detail-title-badges">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-xs font-sans font-bold text-amber-400 border border-amber-500/20">
                <Tag className="h-3.5 w-3.5" />
                <span>Kategori: {indonesianCategory}</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gray-800 text-xs font-sans font-bold text-gray-300 border border-gray-700">
                <Globe className="h-3.5 w-3.5" />
                <span>Asal Makanan: {indonesianArea}</span>
              </span>
            </div>

            {/* Nama Makanan */}
            <h1 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight" id="detail-food-name">
              {meal.name}
            </h1>

            {/* Deskripsi Singkat Pengantar */}
            <p className="font-sans text-xs sm:text-sm text-gray-400 leading-relaxed">
              Resep hidangan legendaris bercita rasa khas yang digemari banyak orang. Anda dapat menambahkan menu ini ke keranjang resep pilihan Anda untuk memudahkan pengaturan menu harian dapur Anda.
            </p>

            {/* Porsi Selector + Tambah ke Keranjang Panel */}
            <div className="bg-[#161618] p-4 sm:p-5 rounded-2xl border border-gray-850 space-y-4" id="add-to-cart-box">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Quantity configurer */}
                <div className="flex items-center space-x-3.5">
                  <span className="font-sans font-bold text-gray-300 text-xs uppercase tracking-wider">Porsi Resep:</span>
                  <div className="flex items-center space-x-3 bg-[#1F1F22] px-2.5 py-1.5 rounded-xl border border-gray-800">
                    <button
                      onClick={handleDecrement}
                      className="cursor-pointer w-7 h-7 bg-[#161618] hover:bg-gray-800 text-gray-300 rounded-lg flex items-center justify-center font-bold text-sm transition-all focus:outline-none"
                      aria-label="Kurangi Porsi"
                      id="qty-decrement"
                    >
                      -
                    </button>
                    <span className="font-sans font-extrabold text-white text-sm w-5 text-center" id="qty-text">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="cursor-pointer w-7 h-7 bg-[#161618] hover:bg-gray-800 text-gray-300 rounded-lg flex items-center justify-center font-bold text-sm transition-all focus:outline-none"
                      aria-label="Tambah Porsi"
                      id="qty-increment"
                    >
                      +
                    </button>
                  </div>
                </div>

                <span className="font-sans text-xxs text-gray-500 italic max-w-[200px] border-l border-gray-850 pl-3 leading-snug sm:block hidden">
                  Porsi menentukan pengali takaran bahan masakan Anda.
                </span>
              </div>

              {/* Add to basket trigger button */}
              <button 
                onClick={handleAddToCart}
                disabled={addingState}
                className={`cursor-pointer w-full py-3.5 rounded-xl font-sans font-bold text-xs tracking-wider uppercase transition-all duration-350 flex items-center justify-center space-x-2 ${
                  addingState 
                    ? 'bg-green-500 text-black' 
                    : 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/10'
                }`}
                id="add-to-cart-submit"
              >
                {addingState ? (
                  <>
                    <Check className="h-4.5 w-4.5 animate-pulse" />
                    <span>Resep Berhasil Ditambahkan!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4.5 w-4.5" />
                    <span>Tambahkan ke Keranjang Resep</span>
                  </>
                )}
              </button>

              {/* Save to Favorites toggle button (Hidden for Admins) */}
              {(!user || user.role === 'user') && (
                <button
                  onClick={handleToggleFavorite}
                  className={`cursor-pointer w-full py-3.5 rounded-xl font-sans font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2 border mt-3 ${
                    hasFavorited
                      ? 'bg-red-500/15 text-red-500 border-red-500/25 hover:bg-red-500/20'
                      : 'bg-transparent text-gray-300 border-gray-800 hover:text-white hover:bg-gray-800'
                  }`}
                  id="toggle-favorite-btn"
                >
                  <Heart className={`h-4.5 w-4.5 ${hasFavorited ? 'fill-red-500 text-red-500 animate-pulse' : 'text-gray-400'}`} />
                  <span>{hasFavorited ? 'Tersimpan di Favorit Saya' : 'Simpan ke Favorit Saya'}</span>
                </button>
              )}
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* LENGKAP BAGIAN BAWAH: Bahan resep, Instruksi memasak, Info tambahan */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-gray-850" id="detail-bottom-section">
          
          {/* KOLOM 1: Daftar Bahan-Bahan Resep (col-span-12 lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4" id="detail-ingredients-pane">
            <div className="bg-[#161618] rounded-2xl border border-gray-850 p-6 shadow-md space-y-4">
              <h2 className="font-sans font-bold text-white text-base tracking-tight flex items-center space-x-2 border-b border-gray-850 pb-3" id="ing-header">
                <ListChecks className="h-5 w-5 text-amber-500" />
                <span>Bahan-Bahan ({meal.ingredients ? meal.ingredients.length : 0})</span>
              </h2>
              
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin" id="ingredients-list">
                {meal.ingredients && meal.ingredients.length > 0 ? (
                  meal.ingredients.map((ing, k) => (
                    <div 
                      key={k} 
                      className="flex justify-between items-center text-xs p-2 rounded-xl bg-[#1D1D20]/45 hover:bg-[#1D1D20] border border-transparent hover:border-gray-800 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                        <span className="font-bold text-white uppercase tracking-tight">{ing.name || 'Informasi bahan belum tersedia.'}</span>
                      </div>
                      {ing.measure && (
                        <span className="text-gray-400 font-sans font-medium px-2 py-0.5 rounded-md bg-gray-800/80 text-[10px]">
                          {ing.measure}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic text-xs py-3" id="no-ingredients-text">Informasi bahan belum tersedia.</p>
                )}
              </div>
            </div>
          </div>

          {/* KOLOM 2: Langkah Instruksi Memasak (col-span-12 lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-4" id="detail-instructions-pane">
            <div className="bg-[#161618] rounded-2xl border border-gray-850 p-6 sm:p-7 shadow-md space-y-5">
              
              <div className="flex items-center justify-between border-b border-gray-850 pb-3" id="inst-header">
                <h2 className="font-sans font-bold text-white text-base tracking-tight flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-amber-500" />
                  <span>Petunjuk Instruksi Memasak</span>
                </h2>
                
                {/* Small, elegant, non-intrusive automatic translation info badge */}
                <div className="flex items-center space-x-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/15 text-[10px] px-2.5 py-1 rounded-full shadow-sm hover:scale-102 transition-transform duration-200">
                  <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
                  <span className="font-sans font-bold uppercase tracking-wider">Terjemahan Otomatis</span>
                </div>
              </div>

              {/* Display Paragraph steps in natural Indonesian */}
              <div className="space-y-4 font-sans text-xs sm:text-sm text-gray-300 leading-relaxed" id="instructions-container">
                {meal.instructions && meal.instructions.trim() && meal.instructions !== 'Petunjuk memasak belum tersedia.' ? (
                  meal.instructions.split(/\r?\n/).filter(p => p.trim() !== '').map((para, i) => {
                    const displayPara = para.replace(/^Langkah\s+\d+\s*[-:.]\s*/i, '').trim();
                    return (
                      <div 
                        key={i} 
                        className="bg-[#1E1E21]/45 hover:bg-[#1E1E21] p-5 border border-gray-800/40 rounded-2xl transition-all duration-300 flex flex-col space-y-2 group shadow-sm"
                      >
                        <div className="font-sans font-black text-amber-500 text-xs tracking-wider uppercase">
                          Langkah {i + 1}
                        </div>
                        <p className="text-gray-200 font-sans text-xs sm:text-sm leading-relaxed tracking-normal">{displayPara}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 italic text-xs py-3" id="no-instructions-text">Petunjuk memasak belum tersedia.</p>
                )}
              </div>
            </div>

            {/* Informasi Tambahan (YouTube & AI Translation details) */}
            <div className="bg-[#161618] rounded-2xl border border-gray-850 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-gray-400" id="detail-info-footer">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-amber-500 flex-shrink-0" />
                <p>
                  Sistem kami menerjemahkan instruksi memasak {meal.name} secara otomatis ke dalam <span className="font-sans font-bold text-white">Bahasa Indonesia</span> yang alami.
                </p>
              </div>
              {meal.youtube && (
                <a 
                  href={meal.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold text-amber-500 hover:text-amber-400 hover:underline transition-all flex items-center space-x-1 flex-shrink-0"
                >
                  <span>Lihat Video YouTube</span>
                  <span>→</span>
                </a>
              )}
            </div>
            
          </div>

        </section>

      </div>
    </div>
  );
}
