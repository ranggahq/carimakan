/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Database, 
  Heart, 
  ShoppingBag, 
  Search, 
  Utensils, 
  User, 
  Calendar,
  Activity,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
}

function StatCard({ title, value, description, icon, colorClass }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-[#161618] border border-gray-800 p-6 rounded-3xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/2 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-sans font-bold text-gray-400 uppercase tracking-widest">{title}</p>
          <h3 className="text-3xl font-sans font-extrabold text-white mt-2 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3.5 rounded-2xl ${colorClass}`}>
          {icon}
        </div>
      </div>
      <p className="text-xxs text-gray-500 mt-4 font-medium leading-relaxed uppercase tracking-wider">{description}</p>
    </motion.div>
  );
}

interface Order {
  id: string;
  userEmail: string;
  userName: string;
  items: any[];
  totalAmount: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user, favorites, searchActivityCount } = useAuth();
  const { cartItems, refreshCart } = useCart();
  const navigate = useNavigate();

  const [apiMealsCount, setApiMealsCount] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);

  // 1. ROUTE PROTECTION: Redirect if not admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/login'); // Redirect unauthorized user
    }
  }, [user, navigate]);

  // Synchronize stats and count available recipes
  useEffect(() => {
    const fetchApiStats = async () => {
      try {
        setLoadingStats(true);
        // Refresh Cart Context to fetch latest cart state from backend db
        await refreshCart();
        
        // Fetch standard catalog meals count
        const response = await axios.get<any[]>('/api/meals');
        if (response.data && Array.isArray(response.data)) {
          setApiMealsCount(response.data.length);
        } else {
          setApiMealsCount(12); // fallback count of initial standard meals
        }

        // Fetch user orders
        const ordersResponse = await axios.get<Order[]>('/api/orders');
        if (ordersResponse.data && Array.isArray(ordersResponse.data)) {
          setOrders(ordersResponse.data);
        }
      } catch (err) {
        console.error('Failed to fetch api stats for dashboard:', err);
        setApiMealsCount(12); // standard count fallback
      } finally {
        setLoadingStats(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchApiStats();
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return null; // Return null while redirect action executes
  }

  // Calculate stats
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const formattedRevenue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalRevenue);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-grow flex flex-col" id="admin-dashboard-root">
      
      {/* Dashboard Top Intro Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-sans font-black tracking-widest text-[#E63946] bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 shadow-xs flex items-center gap-1.5">
              <ShieldAlert className="h-3 w-3 animate-pulse text-[#E63946]" />
              Sesi Administrator Aktif
            </span>
          </div>
          <h1 className="text-3xl font-sans font-extrabold text-white mt-3.5 select-none flex items-center gap-2.5">
            <LayoutDashboard className="h-7 w-7 text-amber-500" />
            Dashboard Admin CariMakan
          </h1>
          <p className="text-xs text-gray-400 mt-1.5">
            Informasi metrik global, daftar pesanan masuk dari pelanggan, statistik omset penjualan, dan resep terfavorit pengguna
          </p>
        </div>
        
        {/* Profile details shortcut indicator */}
        <div className="bg-[#161618] border border-gray-800 px-4 py-3 rounded-2xl flex items-center space-x-3.5 self-start sm:self-center">
          <div className="h-9 w-9 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center">
            <User className="h-4.5 w-4.5" />
          </div>
          <div className="text-left font-sans">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sedang Mengelola</p>
            <p className="text-xs font-extrabold text-white mt-0.5">{user.name}</p>
          </div>
        </div>
      </div>

      {/* Grid of Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10" id="stats-grid">
        <StatCard 
          title="Total Makanan dari API"
          value={`${apiMealsCount} Makanan`}
          description="Resep populer terindeks dari server"
          icon={<Database className="h-5.5 w-5.5 text-blue-500" />}
          colorClass="bg-blue-500/10 text-blue-500"
        />

        <StatCard 
          title="Total Item Favorit"
          value={`${favorites.length} Item`}
          description="Disimpan dalam bookmark pengguna"
          icon={<Heart className="h-5.5 w-5.5 text-emerald-500 fill-emerald-500/10" />}
          colorClass="bg-emerald-500/10 text-emerald-500"
        />

        <StatCard 
          title="Total Pesanan Selesai"
          value={`${totalOrdersCount} Pesanan`}
          description="Berhasil dicheckout oleh pelanggan"
          icon={<ShoppingBag className="h-5.5 w-5.5 text-amber-500" />}
          colorClass="bg-amber-500/10 text-amber-500"
        />

        <StatCard 
          title="Total Omset Penjualan"
          value={formattedRevenue}
          description="Akumulasi pendapatan checkout"
          icon={<Search className="h-5.5 w-5.5 text-indigo-500" />}
          colorClass="bg-indigo-500/10 text-indigo-500"
        />
      </div>

      {/* Incoming Orders Section */}
      <div className="bg-[#161618] border border-gray-800 rounded-3xl p-6 sm:p-7 mb-10" id="incoming-orders-section">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
          <div>
            <h3 className="font-sans font-extrabold text-lg text-white flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-amber-500" />
              <span>Daftar Pesanan Masuk (Real-time)</span>
            </h3>
            <p className="text-xxs sm:text-xs text-gray-400 mt-1">
              Daftar seluruh transaksi pemesanan menu resep kuliner yang dicheckout aktif oleh pelanggan CariMakan.
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold font-mono bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            Live Monitor
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-sans" id="no-orders-placeholder">
            <ShoppingBag className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="font-bold text-sm text-gray-300">Belum Ada Pesanan Masuk</p>
            <p className="text-xs text-gray-500 mt-1">Transaksi checkout dari pelanggan akan otomatis tampil secara real-time di sini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto" id="orders-table-wrapper">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">ID Pesanan</th>
                  <th className="py-3 px-4">Pelanggan</th>
                  <th className="py-3 px-4">Menu yang Dipesan</th>
                  <th className="py-3 px-4 text-right">Total Bayar</th>
                  <th className="py-3 px-4">Waktu Transaksi</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {orders.map((order) => {
                  const orderDate = new Date(order.createdAt).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  return (
                    <tr key={order.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-amber-500">{order.id}</td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-white">{order.userName}</div>
                        <div className="text-gray-500 text-[10px]">{order.userEmail}</div>
                      </td>
                      <td className="py-4 px-4 max-w-[280px]">
                        <div className="space-y-1">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-1 text-gray-300">
                              <span className="font-bold text-amber-500">{item.quantity}x</span>
                              <span className="truncate">{item.name}</span>
                              <span className="text-gray-500 text-[10px]">({item.category})</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-extrabold text-emerald-400">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.totalAmount)}
                      </td>
                      <td className="py-4 px-4 text-gray-400 font-medium">{orderDate}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Sukses
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Audit Log / Monitoring section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="dashboard-monitoring-section">
        {/* Left 2 Columns: System Audit Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#161618] border border-gray-800 rounded-3xl p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-5">
              <h3 className="font-sans font-extrabold text-base text-white flex items-center space-x-2">
                <Activity className="h-5 w-5 text-amber-500" />
                <span>Pemantauan Alur Data CariMakan</span>
              </h3>
              <span className="text-[10px] uppercase font-mono bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-md">
                Status: Real-time
              </span>
            </div>

            <div className="space-y-4 text-xs font-sans text-gray-300 leading-relaxed">
              <div className="p-4 bg-[#1e1e21]/40 border border-gray-800/60 rounded-2xl flex items-start space-x-3.5">
                <div className="p-1 px-1.5 font-bold uppercase text-[9px] bg-emerald-500/10 text-emerald-500 rounded-md mt-0.5 border border-emerald-500/20">
                  INFO
                </div>
                <div>
                  <p className="font-extrabold text-gray-200">Sistem Integrasi TheMealDB API Berjalan Lancar</p>
                  <p className="text-gray-450 mt-1 select-none leading-relaxed">
                    Setiap resep, kategori, dan negara asal terhubung dan diterjemahkan penuh ke dalam Bahasa Indonesia. Sistem cache aktif menyimpan hasil untuk mempercepat navigasi.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#1e1e21]/40 border border-gray-800/60 rounded-2xl flex items-start space-x-3.5">
                <div className="p-1 px-1.5 font-bold uppercase text-[9px] bg-blue-500/10 text-blue-500 rounded-md mt-0.5 border border-blue-500/20">
                  DASH
                </div>
                <div>
                  <p className="font-extrabold text-gray-200">Data Transaksi Keranjang & Favorit Pengguna</p>
                  <p className="text-gray-450 mt-1 select-none leading-relaxed">
                    Keranjang diatur melalui `/api/cart` dengan persistensi level basis data, sehingga sinkronisasi tetap terjadi secara harmonis sewaktu Anda menambah atau menghapus menu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Shortcut Guide */}
        <div className="bg-[#161618] border border-gray-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-extrabold text-white text-sm uppercase tracking-wide border-b border-gray-800 pb-3 mb-4 flex items-center space-x-2">
              <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
              <span>Menu Otoritas Admin</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Sebagai Administrator, Anda berhak memantau keseluruhan aktivitas CariMakan dan mengakses semua konten global.
            </p>
            
            <div className="space-y-3">
              <Link 
                to="/profile"
                className="flex items-center justify-between p-3.5 bg-[#1e1e21]/60 hover:bg-[#1e1e21] border border-gray-800 hover:border-amber-500/30 rounded-xl font-sans font-bold text-xs text-gray-300 hover:text-white transition-all duration-300"
              >
                <span>Lihat Profil Admin</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link 
                to="/"
                className="flex items-center justify-between p-3.5 bg-[#1e1e21]/60 hover:bg-[#1e1e21] border border-gray-800 hover:border-amber-500/30 rounded-xl font-sans font-bold text-xs text-gray-300 hover:text-white transition-all duration-300"
              >
                <span>Pergi ke Beranda</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-800 mt-6 text-[10px] text-gray-500 font-sans tracking-wide uppercase font-bold text-center">
            Hak Akses Terjamin © CariMakan
          </div>
        </div>
      </div>
    </div>
  );
}
