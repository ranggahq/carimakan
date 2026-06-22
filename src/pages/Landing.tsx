/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Utensils, 
  LogIn, 
  BookOpen, 
  Heart, 
  Search, 
  Sparkles, 
  ArrowRight, 
  ListFilter,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect automatically
  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    }
  }, [user, navigate]);

  const scrollToFeatures = () => {
    const element = document.getElementById('landing-features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-grow bg-[#0F0F10] text-[#E4E4E6] flex flex-col font-sans" id="landing-page-root">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden border-b border-gray-800/40">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-600/3 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center z-10 space-y-8 sm:space-y-10">
          {/* Logo Brand Accent with simple animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full text-amber-500 font-bold text-xs tracking-wider uppercase"
          >
            <Utensils className="h-4 w-4 text-amber-500" />
            <span className="font-sans">CariMakan</span>
          </motion.div>

          {/* Headline */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6.5xl font-black tracking-tight text-white leading-[1.1]"
              id="landing-hero-title"
            >
              Temukan Resep <span className="text-amber-500">Favorit Anda</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs sm:text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed"
              id="landing-hero-desc"
            >
              Jelajahi berbagai resep makanan dari berbagai negara dengan panduan memasak yang mudah dipahami.
            </motion.p>
          </div>

          {/* CTA Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            id="hero-actions"
          >
            <Link
              to="/login"
              className="group w-full sm:w-auto bg-amber-500 hover:bg-amber-400 active:scale-97 text-black font-extrabold text-xs tracking-wider uppercase px-8 py-4 rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center space-x-2.5 transition-all duration-300 cursor-pointer"
              id="cta-masuk-sekarang"
            >
              <span>Masuk Sekarang</span>
              <LogIn className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <button
              onClick={scrollToFeatures}
              className="w-full sm:w-auto bg-[#161618] hover:bg-[#1E1E22] border border-gray-800 text-gray-300 px-8 py-4 rounded-xl font-extrabold text-xs tracking-wider uppercase flex items-center justify-center space-x-2 transition-all duration-300 cursor-pointer"
              id="cta-pelajari-lebih"
            >
              <span>Pelajari Lebih Lanjut</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. FITUR UTAMA CARIMAKAN */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-gray-800/40 bg-[#121214]/20" id="landing-features">
        <div className="max-w-5xl mx-auto space-y-14">
          
          {/* Section Header */}
          <div className="text-center max-w-xl mx-auto space-y-4">
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-500 bg-amber-500/10 px-3.5 py-1.5 rounded-full">
              Fitur Utama
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Fitur Utama CariMakan
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Nikmati kenyamanan menjelajahi berbagai fitur interaktif untuk aktivitas memasak harian Anda.
            </p>
          </div>

          {/* Clean 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="features-grid">
            
            {/* Feature 1: Cari Makanan */}
            <div className="bg-[#161618] border border-gray-800 hover:border-amber-500/30 p-8 rounded-2xl space-y-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/1">
              <div className="bg-amber-500/10 text-amber-500 p-3.5 rounded-xl max-w-max">
                <Search className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-white text-base">Cari Makanan</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-normal">
                  Temukan resep makanan dengan cepat menggunakan fitur pencarian.
                </p>
              </div>
            </div>

            {/* Feature 2: Filter Kategori */}
            <div className="bg-[#161618] border border-gray-800 hover:border-amber-500/30 p-8 rounded-2xl space-y-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/1">
              <div className="bg-amber-500/10 text-amber-500 p-3.5 rounded-xl max-w-max">
                <ListFilter className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-white text-base">Filter Kategori</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-normal">
                  Cari makanan berdasarkan kategori seperti Chicken, Beef, Seafood, Dessert, dan lainnya.
                </p>
              </div>
            </div>

            {/* Feature 3: Resep Lengkap */}
            <div className="bg-[#161618] border border-gray-800 hover:border-amber-500/30 p-8 rounded-2xl space-y-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/1">
              <div className="bg-amber-500/10 text-amber-500 p-3.5 rounded-xl max-w-max">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-white text-base">Resep Lengkap</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-normal">
                  Lihat bahan dan langkah memasak secara detail.
                </p>
              </div>
            </div>

            {/* Feature 4: Simpan Favorit */}
            <div className="bg-[#161618] border border-gray-800 hover:border-amber-500/30 p-8 rounded-2xl space-y-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/1">
              <div className="bg-amber-500/10 text-amber-500 p-3.5 rounded-xl max-w-max">
                <Heart className="h-5 w-5 fill-amber-500/10" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-white text-base">Simpan Favorit</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-normal">
                  Simpan resep favorit agar mudah ditemukan kembali.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. TENTANG CARIMAKAN SECTION */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-gray-800/40 relative" id="landing-about">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <span className="text-[10px] uppercase font-black tracking-wider text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full">
            Tentang Kami
          </span>
          
          <h2 className="text-2xl sm:text-3.5xl font-extrabold text-white tracking-tight">
            Tentang CariMakan
          </h2>
          
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-2xl mx-auto font-normal">
            CariMakan merupakan aplikasi pencarian resep makanan yang membantu pengguna menemukan berbagai resep dari berbagai kategori dengan informasi bahan dan langkah memasak yang mudah dipahami.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-4 text-xs font-medium text-gray-450" id="about-qualities">
            <div className="flex items-center space-x-2 text-xs text-gray-300 bg-gray-800/30 px-4 py-2.5 rounded-xl border border-gray-800/40">
              <CheckCircle2 className="h-4.5 w-4.5 text-amber-500 flex-shrink-0" />
              <span>Instruksi Jelas & Rinci</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-300 bg-gray-800/30 px-4 py-2.5 rounded-xl border border-gray-800/40">
              <CheckCircle2 className="h-4.5 w-4.5 text-amber-500 flex-shrink-0" />
              <span>Tampilan Responsif</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-300 bg-gray-800/30 px-4 py-2.5 rounded-xl border border-gray-800/40">
              <CheckCircle2 className="h-4.5 w-4.5 text-amber-500 flex-shrink-0" />
              <span>Mudah Digunakan</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CARA MENGGUNAKAN SECTION */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#121214]/10" id="landing-guide">
        <div className="max-w-5xl mx-auto space-y-14">
          
          {/* Section Header */}
          <div className="text-center max-w-xl mx-auto space-y-4">
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-500 bg-amber-500/10 px-3.5 py-1.5 rounded-full">
              Panduan Penggunaan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cara Menggunakan
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Ikuti empat langkah sederhana berikut untuk mendapatkan pengalaman memasak terbaik.
            </p>
          </div>

          {/* Stepper Timeline Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative" id="guide-steps-grid">
            
            {/* Step 1 */}
            <div className="relative space-y-3 p-5 sm:p-6 bg-[#161618] border border-gray-800/70 rounded-2xl shadow-sm">
              <div className="text-[10px] font-mono font-black tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-md max-w-max uppercase mb-2">
                Langkah 1
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Masuk ke aplikasi menggunakan akun yang tersedia.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative space-y-3 p-5 sm:p-6 bg-[#161618] border border-gray-800/70 rounded-2xl shadow-sm">
              <div className="text-[10px] font-mono font-black tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-md max-w-max uppercase mb-2">
                Langkah 2
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Cari makanan menggunakan fitur pencarian atau filter kategori.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative space-y-3 p-5 sm:p-6 bg-[#161618] border border-gray-800/70 rounded-2xl shadow-sm">
              <div className="text-[10px] font-mono font-black tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-md max-w-max uppercase mb-2">
                Langkah 3
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Buka detail makanan untuk melihat bahan dan instruksi memasak.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative space-y-3 p-5 sm:p-6 bg-[#161618] border border-gray-800/70 rounded-2xl shadow-sm">
              <div className="text-[10px] font-mono font-black tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-md max-w-max uppercase mb-2">
                Langkah 4
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Simpan resep ke favorit atau tambahkan ke keranjang.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION CONTAINER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0F0F10] to-[#0A0A0B]" id="landing-cta">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-amber-500/5 to-amber-600/10 border border-amber-500/10 p-8 sm:p-12 rounded-2xl text-center space-y-6 relative overflow-hidden" id="landing-cta-content">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="inline-flex bg-amber-500 text-black p-3.5 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300">
            <Utensils className="h-5 w-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Mulai Masak Sekarang
          </h2>
          <p className="text-xs text-gray-405 max-w-md mx-auto leading-relaxed text-gray-400">
            Masuk sekarang guna mengakses kumpulan informasi resep masakan teruji dan simpan daftar menu favorit Anda.
          </p>

          <div className="pt-2 flex justify-center">
            <Link
              to="/login"
              className="bg-amber-500 hover:bg-amber-400 active:scale-97 text-black font-extrabold text-xs tracking-wider uppercase px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/15 flex items-center justify-center space-x-2 cursor-pointer transition-all duration-300"
            >
              <span>Masuk Sekarang</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
