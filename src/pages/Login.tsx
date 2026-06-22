/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Utensils, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Demo accounts are maintained inside src/data/mockUsers.ts
// Admin: admin@carimakan.id / admin123
// User: user@carimakan.id / user123

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Success message passed from registration page
  const successMsg = location.state?.message;

  // If already logged in, redirect based on role
  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Harap masukkan email dan kata sandi Anda.');
      return;
    }

    try {
      setError(null);
      setSubmitting(true);
      const res = await login(email, password);
      if (res.success) {
        // Successful login
        const savedUser = JSON.parse(localStorage.getItem('carimakan_session_user') || '{"role":"user"}');
        if (savedUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        setError(res.error || 'Terjadi kesalahan saat masuk.');
      }
    } catch (err) {
      setError('Masalah koneksi terdeteksi. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0F0F10] text-[#E4E4E6]" id="login-container">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full space-y-8 bg-[#161618] p-8 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden"
        id="login-card"
      >
        {/* Background glow accent */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Logo and title */}
        <div className="text-center">
          <div className="inline-flex bg-amber-500 text-black p-3.5 rounded-2xl shadow-lg mb-4 hover:rotate-6 transition-transform duration-300">
            <Utensils className="h-7 w-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight text-white leading-tight">
            Selamat Datang di <span className="text-amber-500">CariMakan</span>
          </h2>
          <p className="mt-2.5 text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
            Masuk untuk menjelajahi resep makanan, menyimpan favorit, dan mengelola keranjang Anda.
          </p>
        </div>

        {/* Success registration notification */}
        {successMsg && !error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-xl text-xs sm:text-sm font-medium"
            id="login-success-box"
          >
            {successMsg}
          </motion.div>
        )}

        {/* Error notification */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs sm:text-sm font-medium animate-pulse"
            id="login-error-box"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit} id="login-form">
          <div className="space-y-1.5">
            <label className="text-xs font-sans font-bold text-gray-300 block">
              Alamat Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="email-input"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@carimakan.id"
                className="w-full pl-10 pr-4 py-3 bg-[#1e1e21] border border-gray-800 focus:border-amber-500/50 rounded-xl focus:ring-1 focus:ring-amber-500/50 outline-none text-sm transition-all duration-300 text-white placeholder-gray-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-sans font-bold text-gray-300 block">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="password-input"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#1e1e21] border border-gray-800 focus:border-amber-500/50 rounded-xl focus:ring-1 focus:ring-amber-500/50 outline-none text-sm transition-all duration-300 text-white placeholder-gray-600"
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={submitting}
            className="w-full mt-2 bg-amber-500 hover:bg-amber-400 active:scale-98 disabled:opacity-50 text-black py-3.5 rounded-xl font-sans font-extrabold text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            {submitting ? (
              <span>Memproses...</span>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <LogIn className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Register navigation Link */}
        <div className="pt-4 border-t border-gray-800/60 text-center">
          <p className="text-xs text-gray-400 font-sans">
            Belum memiliki akun?{' '}
            <Link to="/register" className="text-amber-500 font-bold hover:underline transition-colors" id="link-ke-register">
              Daftar Di Sini
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
