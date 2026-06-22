/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MockUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export const mockUsers: MockUser[] = [
  {
    id: 1,
    name: "Administrator",
    email: "admin@carimakan.id",
    password: "admin123",
    role: "admin"
  },
  {
    id: 2,
    name: "Pengguna Demo",
    email: "user@carimakan.id",
    password: "user123",
    role: "user"
  }
];
