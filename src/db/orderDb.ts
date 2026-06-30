/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { promises as fs } from 'fs';
import path from 'path';
import { CartItem } from '../types.js';

export interface Order {
  id: string;
  userEmail: string;
  userName: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'orders.json');

async function ensureDbInitialized(): Promise<void> {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
    try {
      await fs.access(DB_FILE);
    } catch {
      // Create empty orders storage
      await fs.writeFile(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Failed to initialize local Order DB:', error);
  }
}

export async function getOrders(): Promise<Order[]> {
  await ensureDbInitialized();
  try {
    const rawData = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(rawData) as Order[];
  } catch (error) {
    console.error('Failed to read Order DB:', error);
    return [];
  }
}

export async function saveOrders(orders: Order[]): Promise<void> {
  await ensureDbInitialized();
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write to Order DB:', error);
  }
}

export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
  const orders = await getOrders();
  const newOrder: Order = {
    ...orderData,
    id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString()
  };
  orders.unshift(newOrder); // Add newest orders first
  await saveOrders(orders);
  return newOrder;
}
