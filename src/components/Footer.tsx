/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0B] text-gray-400 font-sans border-t border-gray-800 w-full" id="app-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12" id="footer-grid">
          
          {/* Logo & Slogan */}
          <div className="flex flex-col space-y-4" id="footer-about">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="bg-amber-500 text-black p-2 rounded-xl">
                <Utensils className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Cari<span className="text-amber-500">Makan</span>
              </span>
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Aplikasi pencarian resep makanan berbasis TheMealDB.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-3" id="footer-links">
            <h3 className="text-white font-semibold text-xs sm:text-sm tracking-wide uppercase">Menu</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li>
                <Link to="/" className="hover:text-amber-500 transition-colors">Beranda</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-500 transition-colors">Masuk</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Clean and elegant copyright section */}
        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4" id="footer-copyright-bar">
          <div className="text-xs text-gray-500">
            <p>© {currentYear} CariMakan. Hak Cipta Dilindungi.</p>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <span>Dibuat dengan</span>
            <Heart className="h-3.5 w-3.5 text-amber-500 mx-1 fill-amber-500 animate-pulse" />
            <span>untuk pecinta resep kuliner</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
