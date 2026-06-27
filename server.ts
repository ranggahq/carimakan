/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { fetchPopularMeals, searchMeals, fetchMealById } from './src/services/mealService.js';
import { getCartItems, addToCart, removeFromCart, clearCart } from './src/db/cartDb.js';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // JSON Body Parser Middleware
  app.use(express.json());

  // API Endpoints
  
  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', datetime: new Date().toISOString() });
  });

  // 2. GET /api/meals (Gets default popular meals or filtered list)
  app.get('/api/meals', async (req, res) => {
    try {
      const query = (req.query.q || '') as string;
      const category = (req.query.category || '') as string;
      if (query || category) {
        const meals = await searchMeals(query, category);
        res.json(meals);
      } else {
        const meals = await fetchPopularMeals();
        res.json(meals);
      }
    } catch (error: any) {
      console.error('Error in GET /api/meals:', error);
      res.status(500).json({ error: 'Gagal mengambil daftar makanan', details: error.message });
    }
  });

  // 3. GET /api/meals/search?q=
  app.get('/api/meals/search', async (req, res) => {
    try {
      const query = (req.query.q || '') as string;
      const category = (req.query.category || '') as string;
      const meals = await searchMeals(query, category);
      res.json(meals);
    } catch (error: any) {
      console.error('Error in GET /api/meals/search:', error);
      res.status(500).json({ error: 'Gagal mencari makanan', details: error.message });
    }
  });

  // 4. GET /api/meals/:id
  app.get('/api/meals/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const meal = await fetchMealById(id);
      if (!meal) {
        res.status(404).json({ error: 'Makanan tidak ditemukan' });
        return; // Fixed void compile issue
      }
      res.json(meal);
    } catch (error: any) {
      console.error(`Error in GET /api/meals/${req.params.id}:`, error);
      res.status(500).json({ error: 'Gagal mengambil detail makanan', details: error.message });
    }
  });

  // 5. GET /api/cart
  app.get('/api/cart', async (req, res) => {
    try {
      const items = await getCartItems();
      res.json(items);
    } catch (error: any) {
      console.error('Error in GET /api/cart:', error);
      res.status(500).json({ error: 'Gagal mengambil keranjang', details: error.message });
    }
  });

  // 6. POST /api/cart
  app.post('/api/cart', async (req, res) => {
    try {
      const { mealId, name, thumbnail, category, area, quantity } = req.body;
      if (!mealId || !name || !thumbnail) {
        res.status(400).json({ error: 'Format data tidak valid. mealId, name, dan thumbnail wajib diisi.' });
        return; // Fixed void compile issue
      }
      const item = await addToCart({
        mealId,
        name,
        thumbnail,
        category: category || 'Lainnya',
        area: area || 'Umum',
        quantity: quantity ? parseInt(quantity.toString(), 10) : 1
      });
      res.status(201).json(item);
    } catch (error: any) {
      console.error('Error in POST /api/cart:', error);
      res.status(500).json({ error: 'Gagal menambahkan menu ke keranjang', details: error.message });
    }
  });

  // 7. DELETE /api/cart/:id
  app.delete('/api/cart/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const item = await removeFromCart(id);
      if (!item) {
        res.status(404).json({ error: 'Item keranjang tidak ditemukan' });
        return; // Fixed void compile issue
      }
      res.json({ message: 'Item berhasil dihapus dari keranjang', item });
    } catch (error: any) {
      console.error(`Error in DELETE /api/cart/${req.params.id}:`, error);
      res.status(500).json({ error: 'Gagal menghapus item dari keranjang', details: error.message });
    }
  });

  // 8. DELETE /api/cart (Optional help route to clear cart fully)
  app.delete('/api/cart', async (req, res) => {
    try {
      await clearCart();
      res.json({ message: 'Keranjang berhasil dikosongkan' });
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ error: 'Gagal mengosongkan keranjang' });
    }
  });

  // Integrate Vite for dev, or static asset delivery in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to port 3000 and the correct host 0.0.0.0
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CariMakan Server] http://localhost:${PORT} (${process.env.NODE_ENV || 'development'} mode)`);
  });
}

startServer();
