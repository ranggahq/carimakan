/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Search, Utensils, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FoodCard from '../components/FoodCard';

export default function Favorites() {
  const { favorites } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 flex flex-col" id="favorites-page">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-800 pb-6 mb-8 gap-4">
        <div>
          <span className="text-[10px] uppercase font-sans font-black tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full shadow-xs">
            Halaman Favorit Anda
          </span>
          <h1 className="text-3xl font-sans font-extrabold text-white mt-3 select-none flex items-center gap-2">
            <Heart className="h-7 w-7 text-amber-500 fill-amber-500" />
            Favorit Saya
          </h1>
          <p className="text-xs text-gray-400 mt-1.5">
            Daftar resep pilihan yang telah Anda simpan untuk dimasak di lain waktu
          </p>
        </div>
        
        <Link 
          to="/home" 
          className="inline-flex items-center space-x-2 text-xs font-sans font-bold text-gray-400 hover:text-amber-500 transition-colors bg-gray-800/40 hover:bg-gray-800/70 border border-gray-800 px-4 py-2.5 rounded-xl self-start sm:self-center"
          id="back-home-favorites"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#161618] border border-gray-800/80 rounded-3xl"
          id="favorites-empty-state"
        >
          <div className="bg-amber-500/10 p-5 rounded-2xl mb-4.5 text-amber-500">
            <Heart className="h-9 w-9 stroke-2" />
          </div>
          <h3 className="font-sans font-extrabold text-white text-lg sm:text-xl">
            Belum ada resep favorit disimpan
          </h3>
          <p className="text-gray-450 text-xs sm:text-sm mt-2 max-w-sm leading-relaxed">
            Anda belum menyelamatkan resep apapun ke dalam daftar favorit. Cari aneka resep menarik di beranda dan klik tombol "Simpan Favorit" pada detail makanan!
          </p>
          <Link
            to="/home"
            className="mt-6 bg-amber-500 hover:bg-amber-400 active:scale-95 text-black px-6 py-3 rounded-xl font-sans font-extrabold text-xs tracking-wide transition-all duration-300 shadow-md shadow-amber-500/10 cursor-pointer"
          >
            Mulai Cari Makanan
          </Link>
        </motion.div>
      ) : (
        /* Favorites Grid */
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7"
          id="favorites-grid"
        >
          {favorites.map((meal) => (
            <FoodCard key={meal.id} meal={meal} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
