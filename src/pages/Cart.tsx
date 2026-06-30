/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, ShoppingBag, ArrowLeft, Trash, BookOpen, Clock, CreditCard, ChevronRight, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { translateCategory, translateArea, getMealPrice, formatPrice } from '../utils';
import Swal from 'sweetalert2';

export default function Cart() {
  const { cartItems, loading, updateCartQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  // Total items and sum
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  // Calculate total price based on our category helper
  const grandTotal = cartItems.reduce((acc, item) => {
    const price = getMealPrice(item.category);
    return acc + (price * item.quantity);
  }, 0);

  const handleIncrement = async (id: string, currentQty: number) => {
    try {
      await updateCartQuantity(id, currentQty + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecrement = async (id: string, currentQty: number) => {
    if (currentQty <= 1) return;
    try {
      await updateCartQuantity(id, currentQty - 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = () => {
    Swal.fire({
      title: 'Konfirmasi Checkout',
      text: 'Apakah Anda yakin ingin melakukan checkout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b', // amber-500
      cancelButtonColor: '#3f3f46', // zinc-700
      confirmButtonText: 'Ya, Checkout',
      cancelButtonText: 'Batal',
      background: '#161618',
      color: '#ffffff'
    }).then((result) => {
      if (result.isConfirmed) {
        setIsCheckingOut(true);
        // Show loading state with SweetAlert
        Swal.fire({
          title: 'Memproses Pesanan...',
          text: 'Mohon tunggu sejenak.',
          allowOutsideClick: false,
          showConfirmButton: false,
          background: '#161618',
          color: '#ffffff',
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Simulate checkout process
        setTimeout(async () => {
          try {
            await clearCart();
            setIsCheckingOut(false);
            
            Swal.fire({
              icon: 'success',
              title: 'Pesanan Berhasil',
              text: 'Terima kasih telah menggunakan CariMakan. Selamat mencoba resep pilihan Anda.',
              confirmButtonColor: '#f59e0b',
              background: '#161618',
              color: '#ffffff'
            }).then(() => {
              navigate('/home');
            });
          } catch (err) {
            setIsCheckingOut(false);
            Swal.fire({
              icon: 'error',
              title: 'Terjadi Kesalahan',
              text: 'Gagal memproses checkout Anda.',
              confirmButtonColor: '#ef4444',
              background: '#161618',
              color: '#ffffff'
            });
          }
        }, 1500);
      }
    });
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4 bg-[#0F0F10] min-h-screen" id="cart-loading">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="font-sans text-sm text-gray-400 font-semibold">Memuat Daftar Resep Pilihan...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F10] text-gray-100 py-10 sm:py-14 animate-fade-in" id="cart-page-root">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="cart-header">
          <div>
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-white tracking-tight flex items-center space-x-3">
              <ShoppingBag className="h-7 w-7 text-amber-500" />
              <span>Keranjang Belanja Resep</span>
            </h1>
            <p className="font-sans text-gray-400 text-sm mt-1.5">
              Kelola daftar belanjaan makanan andalan Anda dan nikmati proses memasak profesional.
            </p>
          </div>

          <Link 
            to="/home" 
            className="inline-flex items-center space-x-2 text-xs font-sans font-bold text-gray-400 hover:text-amber-500 transition-colors bg-[#161618] hover:bg-gray-800 border border-gray-850 px-4 py-2.5 rounded-xl self-start sm:self-center"
            id="back-home-favorites"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tambah Resep Lainnya</span>
          </Link>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#161618] border border-gray-850 rounded-2xl p-10 sm:p-16 text-center max-w-md mx-auto shadow-md space-y-6"
            id="cart-empty"
          >
            <div className="bg-amber-500/10 text-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-sans font-bold text-white text-lg">Keranjang Masih Kosong</h3>
              <p className="font-sans text-gray-400 text-sm leading-relaxed">
                Anda belum memilih menu makanan apa pun. Mari kembali menjelajahi ribuan kuliner pilihan kami!
              </p>
            </div>
            <Link 
              to="/home" 
              className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-sans font-bold text-xs rounded-xl transition-all duration-300"
              id="back-home-link"
            >
              <ArrowLeft className="h-4 w-4 text-black" />
              <span>Mulai Cari Makanan</span>
            </Link>
          </motion.div>
        ) : (
          /* Cart items layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="cart-fill">
            
            {/* LEFT COLUMN: Item Lists */}
            <div className="lg:col-span-8 space-y-4" id="cart-list-pane">
              <div className="flex items-center justify-between px-1" id="list-status">
                <span className="font-sans text-sm text-gray-400 font-medium">
                  Daftar Belanja ({cartItems.length} menu, {totalItemsCount} porsi)
                </span>
                
                {/* Clear All Trigger */}
                <button
                  onClick={clearCart}
                  className="cursor-pointer font-sans font-bold text-xs text-red-400 hover:text-red-500 flex items-center space-x-1.5 transition-all"
                  id="clear-all-btn"
                >
                  <Trash className="h-3.5 w-3.5" />
                  <span>Kosongkan Keranjang</span>
                </button>
              </div>

              {/* Items Cards list */}
              <div className="space-y-4" id="cards-stack">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => {
                    const itemUnitPrice = getMealPrice(item.category);
                    const itemSubtotal = itemUnitPrice * item.quantity;
                    const indonesianCategory = translateCategory(item.category);

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        className="bg-[#161618] rounded-2xl border border-gray-850 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-md hover:border-gray-800 transition-all duration-200"
                        id={`cart-card-${item.id}`}
                      >
                        {/* Food image */}
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-900 flex-shrink-0 mx-auto sm:mx-0">
                          <img 
                            src={item.thumbnail} 
                            alt={item.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Food info */}
                        <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                          <Link to={`/detail/${item.mealId}`} className="inline-block hover:text-amber-500 transition-colors">
                            <h4 className="font-sans font-extrabold text-white text-base leading-snug tracking-tight">
                              {item.name}
                            </h4>
                          </Link>
                          
                          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-sans text-gray-400">
                            <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded text-[10px] font-bold">{indonesianCategory}</span>
                            <span>•</span>
                            <span className="text-gray-400 font-sans font-medium text-xs">{formatPrice(itemUnitPrice)} / porsi</span>
                          </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex flex-row sm:flex-row items-center justify-between sm:justify-end gap-6 sm:gap-8 border-t border-gray-850 sm:border-t-0 pt-4 sm:pt-0">
                          {/* Unit Subtotal (Mobile view helper) */}
                          <div className="text-left sm:text-right sm:hidden">
                            <p className="text-xxs text-gray-500 uppercase font-bold tracking-wider">Subtotal</p>
                            <p className="text-amber-500 font-sans font-extrabold text-sm">{formatPrice(itemSubtotal)}</p>
                          </div>

                          {/* Minus/Plus controller */}
                          <div className="flex items-center bg-[#1F1F22] rounded-xl border border-gray-800 p-1">
                            <button
                              onClick={() => handleDecrement(item.id, item.quantity)}
                              disabled={item.quantity <= 1}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                item.quantity <= 1 
                                  ? 'text-gray-600 cursor-not-allowed' 
                                  : 'text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer'
                              }`}
                              aria-label="Kurangi porsi"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="font-sans font-extrabold text-white text-sm w-7 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncrement(item.id, item.quantity)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:bg-gray-800 hover:text-white transition-all cursor-pointer"
                              aria-label="Tambah porsi"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Item Subtotal (Desktop view) */}
                          <div className="text-right hidden sm:block min-w-[95px]">
                            <p className="text-xxs text-gray-500 uppercase font-bold tracking-wider">Subtotal</p>
                            <p className="text-amber-500 font-sans font-extrabold text-sm mt-0.5">{formatPrice(itemSubtotal)}</p>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="cursor-pointer text-gray-400 hover:text-red-500 p-2 rounded-xl bg-gray-800/40 hover:bg-red-500/10 transition-all border border-gray-800 hover:border-red-500/20"
                            aria-label="Hapus menu ini"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT COLUMN: Total Summary & Checkout */}
            <div className="lg:col-span-4 space-y-6" id="cart-summary-pane">
              {/* Order Summary Card */}
              <div className="bg-[#161618] border border-gray-850 rounded-2xl p-6 sm:p-7 shadow-lg space-y-6">
                <div className="flex items-center space-x-2.5 text-amber-500 pb-2 border-b border-gray-850">
                  <CreditCard className="h-5 w-5" />
                  <h3 className="font-sans font-bold text-white text-base tracking-tight">Ringkasan Belanja</h3>
                </div>

                <div className="space-y-3.5 text-sm font-sans">
                  <div className="flex justify-between text-gray-400">
                    <span>Total Resep Unik:</span>
                    <span className="font-bold text-white">{cartItems.length} menu</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Total Porsi Masakan:</span>
                    <span className="font-bold text-white">{totalItemsCount} porsi</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Metode Pembayaran:</span>
                    <span className="font-bold text-amber-400">Bayar Tunai / COD</span>
                  </div>
                  
                  <div className="border-t border-gray-850 pt-4 mt-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-white font-bold text-sm">Total Bayar:</span>
                      <span className="text-amber-500 font-sans font-black text-2xl tracking-tight">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-sans font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/10 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                  id="checkout-trigger-btn"
                >
                  <span>Lanjutkan ke Checkout</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Cooking Guidance Information */}
              <div className="bg-[#161618] border border-gray-850 rounded-2xl p-6 shadow-md space-y-4">
                <div className="flex items-center space-x-2 text-gray-300">
                  <BookOpen className="h-4.5 w-4.5 text-amber-500" />
                  <h4 className="font-sans font-bold text-white text-xs uppercase tracking-wider">Panduan Memasak Anda</h4>
                </div>
                <p className="font-sans text-[11px] text-gray-400 leading-relaxed">
                  Semua bahan segar dan takaran porsi masakan yang Anda pesan siap dipersiapkan oleh koki andalan kami. Silakan saksikan instruksi video detail memasak di halaman deskripsi makanan setelah checkout.
                </p>
                <div className="text-[10px] text-gray-500 flex items-center gap-1.5 pt-1 border-t border-gray-850">
                  <Clock className="h-3.5 w-3.5 text-amber-500/50" />
                  <span>Dibuat segar dengan resep pilihan dunia</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
