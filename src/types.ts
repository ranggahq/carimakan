/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Ingredient {
  name: string;
  measure: string;
}

export interface Meal {
  id: string;
  name: string;
  category: string;
  area: string;
  instructions: string;
  thumbnail: string;
  ingredients: Ingredient[];
  youtube?: string;
}

export interface CartItem {
  id: string; // Unique ID for the cart record
  mealId: string;
  name: string;
  thumbnail: string;
  category: string;
  area: string;
  quantity: number;
  price: number; // Since it's a food cart, let's include a calculated or mock price based on meal ID to make the cart feel extremely polished and complete!
}
