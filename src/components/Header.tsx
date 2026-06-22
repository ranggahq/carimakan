/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Utensils, LogOut, User, Heart, LayoutDashboard, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Calculate total items in the cart
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define core paths dynamically based on identity
  const homePath = !user 
    ? '/' 
    : user.role === 'admin' 
      ? '/admin' 
      : '/home';

  return (
    <header className="sticky top-0 z-50 bg-[#161618]/90 backdrop-blur-md border-b border-gray-800 shadow-lg" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <Link to={homePath} className="flex items-center space-x-2.5 group" id="logo-link">
          <div className="bg-amber-500 text-black p-2 rounded-xl shadow-md group-hover:bg-amber-400 transition-all duration-300 transform group-hover:scale-105">
            <Utensils className="h-5 w-5" />
          </div>
          <span className="font-sans font-extrabold text-xl tracking-tight text-white transition-colors">
            Cari<span className="text-amber-500">Makan</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-4 sm:space-x-6 md:space-x-8" id="nav-menu">
          {/* A. NOT LOGGED IN NAVBAR */}
          {!user ? (
            <>
              <Link 
                to="/" 
                className={`font-sans font-semibold text-xs sm:text-sm transition-colors relative py-1 ${
                  location.pathname === '/' 
                    ? 'text-amber-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
                id="nav-landing-guest"
              >
                Beranda
                {location.pathname === '/' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />
                )}
              </Link>

              <Link 
                to="/login" 
                className={`font-sans font-semibold text-xs sm:text-sm transition-colors relative py-1 flex items-center space-x-1.5 ${
                  location.pathname === '/login' 
                    ? 'text-amber-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
                id="nav-login-guest"
              >
                <LogIn className="h-4 w-4 sm:hidden" />
                <span>Masuk</span>
                {location.pathname === '/login' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />
                )}
              </Link>
            </>
          ) : user.role === 'admin' ? (
            /* B. ADMIN NAVBAR */
            <>
              <Link 
                to="/admin" 
                className={`font-sans font-semibold text-xs sm:text-sm transition-colors relative py-1 flex items-center space-x-1.5 ${
                  location.pathname === '/admin' 
                    ? 'text-amber-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
                id="nav-admin"
              >
                <LayoutDashboard className="h-4 w-4 sm:hidden" />
                <span>Dashboard</span>
                {location.pathname === '/admin' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />
                )}
              </Link>

              <Link 
                to="/profile" 
                className={`font-sans font-semibold text-xs sm:text-sm transition-colors relative py-1 flex items-center space-x-1.5 ${
                  location.pathname === '/profile' 
                    ? 'text-amber-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
                id="nav-profile-admin"
              >
                <User className="h-4 w-4 sm:hidden" />
                <span>Profil Admin</span>
                {location.pathname === '/profile' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="font-sans font-semibold text-xs sm:text-sm text-red-500 hover:text-red-400 transition-colors py-1 flex items-center space-x-1 sm:space-x-1.5 cursor-pointer ml-1 sm:ml-2"
                id="nav-logout-admin"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden xs:inline">Keluar</span>
              </button>
            </>
          ) : (
            /* C. STANDARD USER NAVBAR */
            <>
              <Link 
                to="/home" 
                className={`font-sans font-semibold text-xs sm:text-sm transition-colors relative py-1 ${
                  location.pathname === '/home' 
                    ? 'text-amber-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
                id="nav-home-user"
              >
                Beranda
                {location.pathname === '/home' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />
                )}
              </Link>

              <Link 
                to="/favorites" 
                className={`font-sans font-semibold text-xs sm:text-sm transition-colors relative py-1 flex items-center space-x-1.5 ${
                  location.pathname === '/favorites' 
                    ? 'text-amber-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
                id="nav-favorites-user"
              >
                <Heart className="h-4 w-4 sm:hidden text-amber-500/80 fill-current" />
                <span>Favorit</span>
                {location.pathname === '/favorites' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />
                )}
              </Link>

              <Link 
                to="/cart" 
                className={`font-sans font-semibold text-xs sm:text-sm transition-colors relative py-1 flex items-center space-x-1.5 ${
                  location.pathname === '/cart' 
                    ? 'text-amber-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
                id="nav-cart-user"
              >
                <span>Keranjang</span>
                {totalItems > 0 && (
                  <span className="bg-amber-500 text-black text-[10px] font-sans font-black px-2 py-0.5 rounded-full select-none animate-pulse">
                    {totalItems}
                  </span>
                )}
                {location.pathname === '/cart' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />
                )}
              </Link>

              <Link 
                to="/profile" 
                className={`font-sans font-semibold text-xs sm:text-sm transition-colors relative py-1 flex items-center space-x-1.5 ${
                  location.pathname === '/profile' 
                    ? 'text-amber-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
                id="nav-profile-user"
              >
                <User className="h-4 w-4 sm:hidden" />
                <span>Profil</span>
                {location.pathname === '/profile' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="font-sans font-semibold text-xs sm:text-sm text-red-500 hover:text-red-400 transition-colors py-1 flex items-center space-x-1 sm:space-x-1.5 cursor-pointer ml-1 sm:ml-2"
                id="nav-logout-user"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden xs:inline">Keluar</span>
              </button>
            </>
          )}
        </nav>

      </div>
    </header>
  );
}
