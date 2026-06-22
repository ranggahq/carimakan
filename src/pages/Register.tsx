/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Utensils, Mail, Lock, User, UserPlus } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect automatically
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
    setError(null);

    // Frontend validations
    if (!name.trim()) {
      setError('Nama Lengkap wajib diisi.');
      return;
    }
    if (!email.trim()) {
      setError('Email wajib diisi.');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal terdiri dari 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await authService.register(name, email, password);
      if (res.success) {
        // Redirect to Login Page with custom success state message
        navigate('/login', { 
          state: { 
            message: 'Pendaftaran berhasil. Silakan masuk menggunakan akun Anda.' 
          } 
        });
      } else {
        setError(res.error || 'Pendaftaran gagal.');
      }
    } catch (err) {
      setError('Terjadi masalah koneksi. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0F0F10] text-[#E4E4E6]" id="register-container">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full space-y-8 bg-[#161618] p-8 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden"
        id="register-card"
      >
        {/* Background glow decorator */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header / Brand identity */}
        <div className="text-center">
          <Link to="/" className="inline-flex bg-[#1E1E22] border border-gray-800 p-3 rounded-2xl hover:scale-105 transition-transform duration-300 mb-4">
            <Utensils className="h-6 w-6 text-amber-500" />
          </Link>
          <h2 className="text-2xl sm:text-3xl font-sans font-black tracking-tight text-white leading-tight">
            Daftar Akun Baru
          </h2>
          <p className="mt-2 text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
            Buat akun baru untuk menikmati pencarian resep, filter kategori instan, serta menyimpan hidangan favorit.
          </p>
        </div>

        {/* Error notification banner */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/20 text-red-500 bg-opacity-10 p-3.5 rounded-xl text-xs sm:text-sm font-medium"
            id="register-error-box"
          >
            {error}
          </motion.div>
        )}

        {/* Register Form */}
        <form className="space-y-4 pt-1" onSubmit={handleSubmit} id="register-form">
          <div className="space-y-1.5">
            <label className="text-xs font-sans font-bold text-gray-300 block">
              Nama Lengkap
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                <User className="h-4 w-4" />
              </span>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Lengkap Anda"
                className="w-full pl-10 pr-4 py-3 bg-[#1e1e21] border border-gray-800 focus:border-amber-500/50 rounded-xl focus:ring-1 focus:ring-amber-500/50 outline-none text-sm transition-all duration-300 text-white placeholder-gray-650"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-sans font-bold text-gray-300 block">
              Alamat Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-3 bg-[#1e1e21] border border-gray-800 focus:border-amber-500/50 rounded-xl focus:ring-1 focus:ring-amber-500/50 outline-none text-sm transition-all duration-300 text-white placeholder-gray-650"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-sans font-bold text-gray-300 block">
              Kata Sandi (Min. 6 Karakter)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#1e1e21] border border-gray-800 focus:border-amber-500/50 rounded-xl focus:ring-1 focus:ring-amber-500/50 outline-none text-sm transition-all duration-300 text-white placeholder-gray-650"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-sans font-bold text-gray-300 block">
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#1e1e21] border border-gray-800 focus:border-amber-500/50 rounded-xl focus:ring-1 focus:ring-amber-500/50 outline-none text-sm transition-all duration-300 text-white placeholder-gray-650"
              />
            </div>
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            disabled={submitting}
            className="w-full mt-2 bg-amber-500 hover:bg-amber-400 active:scale-98 disabled:opacity-50 text-black py-3.5 rounded-xl font-sans font-extrabold text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            {submitting ? (
              <span>Memproses...</span>
            ) : (
              <>
                <span>Daftar Sekarang</span>
                <UserPlus className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Navigation to Login */}
        <div className="pt-4 border-t border-gray-800/60 text-center">
          <p className="text-xs text-gray-400 font-sans">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="text-amber-500 font-bold hover:underline transition-colors" id="tab-ke-login">
              Masuk Di Sini
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
}
