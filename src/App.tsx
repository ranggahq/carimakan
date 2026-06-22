/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Home from './pages/Home';
import FoodDetail from './pages/FoodDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

// Elegant role-based Protected Route wrapper
function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles: ('user' | 'admin')[];
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0F0F10] text-[#E4E4E6] py-24" id="protected-loader">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-400 font-sans font-bold uppercase tracking-widest">SINKRONISASI KEAMANAN...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect appropriately if unauthorized
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-[#0F0F10]" id="app-root">
            
            {/* Main navigation header */}
            <Header />
            
            {/* Main application router space */}
            <main className="flex-grow flex flex-col">
              <Routes>
                {/* 1. Public Paths */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* 2. User Protected Paths */}
                <Route path="/home" element={<ProtectedRoute allowedRoles={['user']}><Home /></ProtectedRoute>} />
                <Route path="/detail/:id" element={<ProtectedRoute allowedRoles={['user']}><FoodDetail /></ProtectedRoute>} />
                <Route path="/favorites" element={<ProtectedRoute allowedRoles={['user']}><Favorites /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute allowedRoles={['user']}><Cart /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Profile /></ProtectedRoute>} />
                
                {/* 3. Admin Protected Paths */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                
                {/* Fallback layout routing */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            
            {/* Application footer */}
            <Footer />

          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
