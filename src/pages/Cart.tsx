/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, ShoppingBag, ArrowLeft, Trash, BookOpen, Clock, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { translateCategory, translateArea } from '../utils';

export default function Cart() {
  const { cartItems, loading, removeFromCart, clearCart } = useCart();

  // Total items in the user selection list
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (loading && cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4 bg-[#0F0F10] min-h-screen" id="cart-loading">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="font-sans text-sm text-gray-400 font-semibold">Memuat Daftar Resep Pilihan...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F10] text-gray-100 py-10 sm:py-14" id="cart-page-root">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title Header */}
        <div className="mb-8" id="cart-header">
          <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-white tracking-tight flex items-center space-x-3">
            <ShoppingBag className="h-7 w-7 text-amber-500" />
            <span>Resep Pilihan Anda</span>
          </h1>
          <p className="font-sans text-gray-400 text-sm mt-1.5">
            Kelola kumpulan menu makanan pilihan yang ingin Anda buat resepnya hari ini.
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#161618] border border-gray-850 rounded-2xl p-10 sm:p-16 text-center max-w-md mx-auto shadow-md space-y-6"
            id="cart-empty"
          >
            <div className="bg-amber-500/10 text-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-sans font-bold text-white text-lg">Keranjang Masih Kosong</h3>
              <p className="font-sans text-gray-400 text-sm leading-relaxed">
                Anda belum memilih menu resep makanan apa pun. Mari kembali menjelajahi ribuan resep pilihan kami!
              </p>
            </div>
            <Link 
              to="/home" 
              className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-sans font-bold text-xs rounded-xl transition-all duration-300"
              id="back-home-link"
            >
              <ArrowLeft className="h-4 w-4 text-black" />
              <span>Jelajahi Berbagai Resep</span>
            </Link>
          </motion.div>
        ) : (
          /* Cart items and preparation info section */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="cart-fill">
            
            {/* LEFT CONTAINER: Selected Foods List */}
            <div className="lg:col-span-7 space-y-4" id="cart-list-pane">
              <div className="flex items-center justify-between" id="list-status">
                <span className="font-sans text-sm text-gray-450">
                  Daftar Pilihan ({cartItems.length} resep)
                </span>
                
                {/* Clear All Trigger */}
                <button
                  onClick={clearCart}
                  className="cursor-pointer font-sans font-bold text-xs text-red-400 hover:text-red-500 flex items-center space-x-1.5 hover:underline transition-all"
                  id="clear-all-btn"
                >
                  <Trash className="h-3.5 w-3.5" />
                  <span>Kosongkan Semua</span>
                </button>
              </div>

              {/* Items Cards list */}
              <div className="space-y-4" id="cards-stack">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => {
                    const indonesianCategory = translateCategory(item.category);
                    const indonesianArea = translateArea(item.area);

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="bg-[#161618] rounded-2xl border border-gray-850 p-4 sm:p-5 flex items-center justify-between gap-4 sm:gap-6 shadow-md group animate-fade-in"
                        id={`cart-card-${item.id}`}
                      >
                        <img 
                          src={item.thumbnail} 
                          alt={item.name} 
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-gray-900 flex-shrink-0"
                        />
                        
                        <div className="flex-1 min-w-0 space-y-1">
                          <Link to={`/detail/${item.mealId}`} className="block">
                            <h4 className="font-sans font-extrabold text-white text-sm sm:text-base leading-snug tracking-tight hover:text-amber-500 transition-colors truncate">
                              {item.name}
                            </h4>
                          </Link>
                          
                          <div className="flex items-center space-x-2 text-xs font-sans text-gray-400">
                            <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded text-[10px] font-medium">{indonesianCategory}</span>
                            <span>•</span>
                            <span className="text-gray-300 bg-gray-800 px-2 py-0.5 rounded text-[10px] font-medium">{indonesianArea}</span>
                          </div>

                          <p className="font-sans text-gray-500 text-[11px] pt-1">
                            Disimpan dalam daftar resep andalan
                          </p>
                        </div>

                        {/* Delete Actions */}
                        <div className="flex flex-col items-end flex-shrink-0" id={`cart-card-actions-${item.id}`}>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="cursor-pointer text-gray-400 hover:text-red-400 p-2 rounded-xl bg-gray-800/50 hover:bg-red-500/10 transition-all border border-gray-800 hover:border-red-500/20"
                            aria-label="Hapus resep ini"
                            id={`del-btn-${item.id}`}
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>

                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT CONTAINER: Cooking Guidance Information (Non-Marketplace alternative) */}
            <div className="lg:col-span-5" id="cart-guidance-pane">
              <div className="bg-[#161618] border border-gray-850 rounded-2xl p-6 sm:p-8 shadow-lg space-y-6" id="guidance-card">
                
                <div className="flex items-center space-x-2.5 text-amber-500">
                  <BookOpen className="h-5 w-5" />
                  <h3 className="font-sans font-bold text-white text-base tracking-tight">Panduan Memasak Anda</h3>
                </div>
                
                <p className="font-sans text-xs text-gray-400 leading-relaxed">
                  Semua menu yang Anda simpan di dalam keranjang resep siap untuk dicoba. Berikut langkah mudah untuk memulai petualangan dapur Anda:
                </p>

                <div className="space-y-4 border-t border-b border-gray-850 py-5 text-xs font-sans" id="guidance-steps">
                  <div className="flex items-start space-x-3">
                    <div className="bg-amber-500/10 text-amber-500 w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-white text-xs">Pahami Detail Resep</h4>
                      <p className="text-gray-400">Klik nama masakan untuk melihat bahan-bahan lengkap dan petunjuk memasak langkah demi langkah.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-amber-500/10 text-amber-500 w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-white text-xs">Belanja Bahan Segar</h4>
                      <p className="text-gray-400">Gunakan daftar bahan belanja terjemahan kami sebagai daftar belanja di pasar terdekat.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-amber-500/10 text-amber-500 w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-white text-xs">Ikuti Langkah Tepat</h4>
                      <p className="text-gray-400">Nikmati petunjuk instruksi dalam Bahasa Indonesia yang diterjemahkan pintar menggunakan teknologi AI.</p>
                    </div>
                  </div>
                </div>

                {/* Return button */}
                <Link
                  to="/home"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-sans font-bold text-xs rounded-xl shadow-md transition-all duration-300 flex items-center justify-center space-x-2"
                  id="add-more-recipes-btn"
                >
                  <span>Cari Inspirasi Resep Lainnya</span>
                </Link>

                <div className="text-center font-sans text-[10px] text-gray-500 flex items-center justify-center gap-1.5" id="guidance-footer">
                  <Clock className="h-3.5 w-3.5 text-amber-500/70" />
                  <span>Cari resep favorit pemicu masakan lezat!</span>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
