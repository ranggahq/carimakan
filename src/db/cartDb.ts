/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { promises as fs } from 'fs';
import path from 'path';
import { CartItem } from '../types.js';
import { getMealPrice } from '../utils/priceHelper.js';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'cart.json');

async function ensureDbInitialized(): Promise<void> {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
    try {
      await fs.access(DB_FILE);
    } catch {
      // Create empty cart storage
      await fs.writeFile(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Failed to initialize local Cart DB:', error);
  }
}

export async function getCartItems(): Promise<CartItem[]> {
  await ensureDbInitialized();
  try {
    const rawData = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(rawData) as CartItem[];
  } catch (error) {
    console.error('Failed to read Cart DB:', error);
    return [];
  }
}

export async function saveCartItems(items: CartItem[]): Promise<void> {
  await ensureDbInitialized();
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write to Cart DB:', error);
  }
}

export async function addToCart(meal: Omit<CartItem, 'id' | 'quantity' | 'price'> & { quantity?: number }): Promise<CartItem> {
  const items = await getCartItems();
  
  // Check if item already exists by mealId
  const existingIndex = items.findIndex(item => item.mealId === meal.mealId);
  const qtyToAdd = meal.quantity || 1;
  const price = getMealPrice(meal.category);

  if (existingIndex !== -1) {
    items[existingIndex].quantity += qtyToAdd;
    await saveCartItems(items);
    return items[existingIndex];
  } else {
    const newItem: CartItem = {
      id: meal.mealId, // Use mealId as unique ID for consistency
      mealId: meal.mealId,
      name: meal.name,
      thumbnail: meal.thumbnail,
      category: meal.category,
      area: meal.area,
      quantity: qtyToAdd,
      price: price
    };
    items.push(newItem);
    await saveCartItems(items);
    return newItem;
  }
}

export async function removeFromCart(id: string): Promise<CartItem | null> {
  const items = await getCartItems();
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  const removedItem = items[index];
  items.splice(index, 1);
  await saveCartItems(items);
  return removedItem;
}

export async function updateCartQuantity(id: string, quantity: number): Promise<CartItem | null> {
  const items = await getCartItems();
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  items[index].quantity = Math.max(1, quantity);
  await saveCartItems(items);
  return items[index];
}

export async function clearCart(): Promise<void> {
  await saveCartItems([]);
}
