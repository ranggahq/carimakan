/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { mockUsers, MockUser } from '../data/mockUsers';

export interface AuthSessionUser {
  name: string;
  email: string;
  role: 'user' | 'admin';
}

const USER_KEY = 'carimakan_session_user';
const REGISTERED_USERS_KEY = 'carimakan_registered_users';

// Helper to get custom registered users from Local Storage
const getRegisteredUsers = (): MockUser[] => {
  try {
    const stored = localStorage.getItem(REGISTERED_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Helper to save custom registered users to Local Storage
const saveRegisteredUsers = (users: MockUser[]): void => {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
};

export const authService = {
  /**
   * Log in a user with email and password.
   * Checks both static demo accounts and dynamically registered accounts.
   */
  login: async (email: string, password: string): Promise<{ success: boolean; user?: AuthSessionUser; error?: string }> => {
    // Delay slightly to simulate network request latency
    await new Promise(resolve => setTimeout(resolve, 600));

    const cleanEmail = email.trim().toLowerCase();
    
    // Combine mock users and dynamically registered users
    const allUsers = [...mockUsers, ...getRegisteredUsers()];
    const foundUser = allUsers.find(
      u => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (foundUser) {
      const sessionUser: AuthSessionUser = {
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
      };
      
      // Save data to Local Storage
      localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
      localStorage.setItem('user', JSON.stringify(sessionUser));
      localStorage.setItem('role', sessionUser.role);
      localStorage.setItem('isAuthenticated', 'true');
      
      return { success: true, user: sessionUser };
    }

    return { 
      success: false, 
      error: 'Email atau password salah. Silakan coba lagi.' 
    };
  },

  /**
   * Register a new user with role 'user'.
   */
  register: async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Delay slightly to simulate network request latency
    await new Promise(resolve => setTimeout(resolve, 600));

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      return { success: false, error: 'Nama Lengkap wajib diisi.' };
    }
    if (!cleanEmail) {
      return { success: false, error: 'Email wajib diisi.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password minimal terdiri dari 6 karakter.' };
    }

    // Check if email already exists in static mock users or registered users
    const allUsers = [...mockUsers, ...getRegisteredUsers()];
    const emailExists = allUsers.some(u => u.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      return { success: false, error: 'Email sudah terdaftar. Gunakan email lain.' };
    }

    // Create and save new user
    const currentRegistered = getRegisteredUsers();
    // Unique ID based on timestamp
    const newUser: MockUser = {
      id: Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: password,
      role: 'user' // Register is exclusively for role 'user'
    };

    currentRegistered.push(newUser);
    saveRegisteredUsers(currentRegistered);

    return { success: true };
  },

  /**
   * Log out currently authenticated session.
   */
  logout: (): void => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('isAuthenticated');
  },

  /**
   * Get the currently logged-in user details from session storage.
   */
  getCurrentUser: (): AuthSessionUser | null => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Fast check if a session is currently active.
   */
  isAuthenticated: (): boolean => {
    return localStorage.getItem('isAuthenticated') === 'true' && !!localStorage.getItem(USER_KEY);
  }
};
