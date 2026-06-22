/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, LogOut, Shield, Mail, UserCheck, ArrowRight, LayoutDashboard, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // If not logged in, redirect nicely to login
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex-1 flex flex-col justify-center" id="profile-page">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#161618] border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        id="profile-card"
      >
        {/* Decorative background gradients */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-gray-800">
          <div className="h-20 w-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shadow-md">
            {user.role === 'admin' ? (
              <Shield className="h-10 w-10 stroke-[2.2]" />
            ) : (
              <User className="h-10 w-10 stroke-[2.2]" />
            )}
          </div>
          <div className="text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
              <h2 className="text-2xl font-sans font-extrabold text-white">{user.name}</h2>
              <span className={`inline-flex px-3 py-1 rounded-full text-xxs font-sans font-black tracking-widest uppercase mt-2 sm:mt-0 max-w-max mx-auto sm:mx-0 border ${
                user.role === 'admin' 
                  ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                  : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
              }`}>
                {user.role === 'admin' ? 'Administrator' : 'Pengguna'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1.5 font-sans font-medium">
              Sesi login aktif CariMakan Anda aman & tersinkronisasi
            </p>
          </div>
        </div>

        {/* Credentials detail fields */}
        <div className="mt-8 space-y-5" id="profile-info-grid">
          <h3 className="text-xs font-sans font-black tracking-widest uppercase text-gray-500">
            Detail Informasi Akun
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email field */}
            <div className="p-4 bg-[#1e1e21]/50 border border-gray-800 rounded-2xl flex items-start space-x-3.5">
              <div className="text-gray-400 mt-0.5">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-sans font-bold text-gray-500 uppercase tracking-wider">
                  Alamat Email Resmi
                </p>
                <p className="font-sans font-extrabold text-sm text-gray-250 mt-0.5 break-all select-all">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Role field */}
            <div className="p-4 bg-[#1e1e21]/50 border border-gray-800 rounded-2xl flex items-start space-x-3.5">
              <div className="text-gray-400 mt-0.5">
                {user.role === 'admin' ? <Shield className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-[10px] font-sans font-bold text-gray-500 uppercase tracking-wider">
                  Level Akses Otoritas
                </p>
                <p className="font-sans font-extrabold text-sm text-gray-250 mt-0.5 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Menu Page Link Shortcuts */}
        <div className="mt-8 pt-7 border-t border-gray-800 space-y-4" id="profile-shortcuts">
          <h3 className="text-xs font-sans font-black tracking-widest uppercase text-gray-500">
            Akses Pintas Cepat
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-35">
            {user.role === 'admin' ? (
              <Link
                to="/admin"
                className="flex items-center justify-between p-4 bg-[#1e1e21]/70 hover:bg-[#1e1e21] hover:border-amber-500/30 border border-gray-800 rounded-2xl transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-amber-500 bg-amber-500/10 p-2 rounded-xl">
                    <LayoutDashboard className="h-4 w-4" />
                  </div>
                  <span className="font-sans font-bold text-xs text-gray-200">Dashboard Admin</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
              </Link>
            ) : (
              <Link
                to="/favorites"
                className="flex items-center justify-between p-4 bg-[#1e1e21]/70 hover:bg-[#1e1e21] hover:border-amber-500/30 border border-gray-800 rounded-2xl transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-amber-500 bg-amber-500/10 p-2 rounded-xl">
                    <Heart className="h-4 w-4 fill-amber-500/20" />
                  </div>
                  <span className="font-sans font-bold text-xs text-gray-200">Katalog Favorit Saya</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center justify-between p-4 bg-[#1e1e21]/70 hover:bg-red-500/5 hover:border-red-500/30 border border-gray-800 rounded-2xl transition-all duration-300 text-left cursor-pointer group"
              id="profile-logout-button"
            >
              <div className="flex items-center space-x-3">
                <div className="text-red-500 bg-red-500/10 p-2 rounded-xl group-hover:bg-red-500/15">
                  <LogOut className="h-4 w-4" />
                </div>
                <span className="font-sans font-bold text-xs text-gray-200 group-hover:text-red-400">Keluar dari Sesi</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
