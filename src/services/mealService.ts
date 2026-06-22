/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Meal, Ingredient } from '../types.js';
import { GoogleGenAI } from '@google/genai';
import { 
  translateCategory, 
  translateArea, 
  translateIngredient, 
  translateInstruction 
} from '../utils/recipeTranslator.js';

// Initialize Gemini client lazily
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance && process.env.GEMINI_API_KEY) {
    aiInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Convert raw TheMealDB meal object to clean Meal object
export function transformRawMeal(raw: any): Meal {
  const ingredients: Ingredient[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredientName = raw[`strIngredient${i}`];
    const ingredientMeasure = raw[`strMeasure${i}`];
    
    if (ingredientName && ingredientName.trim()) {
      ingredients.push({
        name: translateIngredient(ingredientName.trim()),
        measure: ingredientMeasure ? ingredientMeasure.trim() : ''
      });
    }
  }

  const mealName = raw.strMeal || '';
  const area = raw.strArea || 'Unknown';
  const category = raw.strCategory || 'Miscellaneous';
  const instructions = translateInstruction(raw.strInstructions || '', mealName);

  return {
    id: raw.idMeal,
    name: mealName,
    category,
    area,
    instructions,
    thumbnail: raw.strMealThumb || '',
    ingredients: ingredients.length > 0 ? ingredients : [],
    youtube: raw.strYoutube || undefined
  };
}

// In-memory High-fidelity cache to support concurrent filtering by Category + Search Term
let cachedMeals: Meal[] = [];
let cacheInitialized = false;

export async function initializeCache(): Promise<void> {
  if (cacheInitialized) return;
  try {
    const categoriesToSeed = ['Chicken', 'Beef', 'Vegetarian', 'Dessert', 'Seafood', 'Pasta', 'Breakfast'];
    const fetchPromises = categoriesToSeed.map(async (cat) => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${cat}`);
        if (response.ok) {
          const data = await response.json();
          return data.meals || [];
        }
      } catch (err) {
        console.error(`[Cache Seed] Gagal seeding kategori "${cat}":`, err);
      }
      return [];
    });

    const defaultResponse = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    let defaultMeals: any[] = [];
    if (defaultResponse.ok) {
      const defaultData = await defaultResponse.json();
      defaultMeals = defaultData.meals || [];
    }

    const allRawMeals = [...defaultMeals];
    const results = await Promise.all(fetchPromises);
    results.forEach(list => allRawMeals.push(...list));

    const mealMap = new Map<string, Meal>();
    allRawMeals.forEach(m => {
      if (m && m.idMeal) {
        mealMap.set(m.idMeal, transformRawMeal(m));
      }
    });

    cachedMeals = Array.from(mealMap.values());
    cacheInitialized = true;
    console.log(`[CariMakan Cache] Seeding sukses. Menyimpan ${cachedMeals.length} resep makanan.`);
  } catch (err) {
    console.error('[CariMakan Cache] Gagal inisialisasi:', err);
  }
}

export async function fetchPopularMeals(): Promise<Meal[]> {
  await initializeCache();
  // Return a shuffled slice of 20 elements for dynamic variety
  return cachedMeals.slice(0, 24);
}

export async function searchMeals(query: string = '', category: string = ''): Promise<Meal[]> {
  await initializeCache();
  
  let list = [...cachedMeals];

  // If a keyword-specific query is provided, check if we need to search dynamically
  if (query.trim()) {
    const lowerQuery = query.toLowerCase();
    const matchesInCache = list.filter(m => m.name.toLowerCase().includes(lowerQuery));
    
    // Fallback: If cache returns very few highlights, hit the external API dynamically to enrich results
    if (matchesInCache.length < 4) {
      try {
        const trimmed = encodeURIComponent(query.trim());
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${trimmed}`);
        if (response.ok) {
          const data = await response.json();
          if (data.meals) {
            data.meals.forEach((m: any) => {
              const mealObj = transformRawMeal(m);
              // Avoid duplicates and add to cache dynamically
              if (!cachedMeals.some(existing => existing.id === mealObj.id)) {
                cachedMeals.push(mealObj);
              }
            });
          }
        }
      } catch (err) {
        console.error(`[Dynamic Fetch Fallback] Gagal mengambil "${query}":`, err);
      }
      
      // Recalculate with dynamic matches included
      list = [...cachedMeals];
    }
  }

  // Filter list by category
  if (category && category !== 'All') {
    list = list.filter(m => m.category.toLowerCase() === category.toLowerCase());
  }

  // Filter list by query
  if (query.trim()) {
    const lowerQuery = query.toLowerCase();
    list = list.filter(meal => 
      meal.name.toLowerCase().includes(lowerQuery) ||
      meal.category.toLowerCase().includes(lowerQuery) ||
      translateCategory(meal.category).toLowerCase().includes(lowerQuery) ||
      meal.area.toLowerCase().includes(lowerQuery) ||
      translateArea(meal.area, meal.name).toLowerCase().includes(lowerQuery)
    );
  }

  return list;
}

// Call the unlisted Google Translate Single API without requiring API keys
async function googleTranslate(text: string): Promise<string> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=id&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Google Translate API returned status: ${res.status}`);
    }
    const data = await res.json() as any;
    if (data && data[0]) {
      const translatedParts = data[0].map((part: any) => part[0]).filter(Boolean);
      if (translatedParts.length > 0) {
        return translatedParts.join('');
      }
    }
    throw new Error('Unexpected Google Translate response body structure');
  } catch (err) {
    console.warn('[CariMakan Translate] Gagal di Google Translate:', err);
    throw err;
  }
}

// Rewrites rigid or literal translations into clean Indonesian culinary verbs and descriptions
function refineIndonesianInstructions(text: string): string {
  let refined = text;
  
  const replacements: Array<[RegExp, string]> = [
    // Standardize Onion/Onions
    [/\bbawang bombay\b/gi, 'bawang bombai'],
    [/\bbawang bombay.\b/gi, 'bawang bombai'],
    
    // Imperative cooking phrases
    [/tambahkan bawang bombai/gi, 'Masukkan bawang bombai'],
    [/tambahkan bawang putih/gi, 'Masukkan bawang putih'],
    [/tambahkan garam/gi, 'Beri garam'],
    
    // Pan phrases
    [/panaskan minyak di panci besar/gi, 'Panaskan minyak dalam wajan besar'],
    [/panaskan minyak di wajan besar/gi, 'Panaskan minyak dalam wajan besar'],
    [/panaskan minyak dalam panci besar/gi, 'Panaskan minyak dalam wajan besar'],
    [/panaskan minyak dalam wajan besar/gi, 'Panaskan minyak dalam wajan besar'],
    [/panaskan minyak dalam wajan/gi, 'Panaskan minyak dalam wajan'],
    [/panaskan minyak di wajan/gi, 'Panaskan minyak dalam wajan'],
    
    // Cook until soft -> Masak hingga lunak (NOT lembut/empuk)
    [/masak sampai lembut/gi, 'masak hingga lunak'],
    [/masak sampai empuk/gi, 'masak hingga lunak'],
    [/masak hingga lembut/gi, 'masak hingga lunak'],
    [/masak hingga empuk/gi, 'masak hingga lunak'],
    [/rebus sampai empuk/gi, 'rebus hingga lunak'],
    [/rebus hingga empuk/gi, 'rebus hingga lunak'],
    [/tumis sampai empuk/gi, 'tumis hingga lunak'],
    [/tumis hingga empuk/gi, 'tumis hingga lunak'],
    [/masak sampai lunak/gi, 'masak hingga lunak'],
    [/sampai cukup lunak/gi, 'hingga lunak'],
    [/sampai lunak/gi, 'hingga lunak'],
    [/masak sampai empuk dan lembut/gi, 'masak hingga lunak'],
    [/masak hingga empuk dan lembut/gi, 'masak hingga lunak'],
    
    // Gold tone colors
    [/masak sampai keemasan/gi, 'masak hingga berwarna cokelat keemasan'],
    [/masak hingga keemasan/gi, 'masak hingga berwarna cokelat keemasan'],
    [/masak sampai kecokelatan/gi, 'masak hingga berwarna cokelat keemasan'],
    [/masak hingga kecokelatan/gi, 'masak hingga berwarna cokelat keemasan'],
    
    // Action details
    [/aduk terus/gi, 'aduk terus-menerus'],
    [/aduk terus menerus/gi, 'aduk terus-menerus'],
    [/angkat dari api/gi, 'angkat dari kompor'],
    [/pindahkan dari api/gi, 'pindahkan dari kompor'],
    
    // Serving temperatures
    [/sajikan panas/gi, 'sajikan selagi hangat'],
    [/sajikan selagi panas/gi, 'sajikan selagi hangat'],
    [/sajikan hangat/gi, 'sajikan selagi hangat']
  ];

  for (const [pattern, replacement] of replacements) {
    refined = refined.replace(pattern, replacement);
  }
  
  return refined;
}

// Automatic high-precision translation of detail properties using Google Translate -> Gemini -> Local Fallback
export async function translateMealDetails(meal: Meal): Promise<Meal> {
  let translatedIngredients = [...meal.ingredients];
  let formattedInstructions = meal.instructions;

  // -------------------------------------------------------------
  // PART A: INGREDIENTS BATCH TRANSLATION
  // -------------------------------------------------------------
  const namesToTranslate = meal.ingredients.map(ing => ing.name).join(' | ');
  let translatedNamesString = '';

  if (namesToTranslate.trim()) {
    try {
      // 1. Google Translate (Priority 1)
      translatedNamesString = await googleTranslate(namesToTranslate);
      console.log(`[CariMakan Translation] Bahan "${meal.name}" diterjemahkan lewat Google Translate`);
    } catch (err) {
      // 2. Gemini API (Priority 2)
      console.log('[CariMakan Translation] Google Translate gagal untuk bahan. Mencoba Gemini...');
      const ai = getGeminiClient();
      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `Terjemahkan daftar bahan kuliner berikut ke dalam Bahasa Indonesia secara literal dan singkat tanpa tambahan format markdown apapun. Setiap item dipisahkan oleh karakter pembagi " | ":\n\n${namesToTranslate}`
          });
          if (response.text) {
            translatedNamesString = response.text.trim();
            console.log(`[CariMakan Translation] Bahan "${meal.name}" diterjemahkan lewat Gemini API`);
          }
        } catch (gemErr) {
          console.error('[CariMakan Translation] Gemini API gagal menerjemahkan bahan:', gemErr);
        }
      }
    }
  }

  if (translatedNamesString) {
    const translatedNames = translatedNamesString.split('|').map(s => s.trim());
    if (translatedNames.length === meal.ingredients.length) {
      translatedIngredients = meal.ingredients.map((ing, idx) => {
        // Normalize translated text with local helper dictionary if needed
        const name = translateIngredient(translatedNames[idx]);
        return {
          name,
          measure: ing.measure
        };
      });
    } else {
      // Dictionary fallback if lengths do not align
      translatedIngredients = meal.ingredients.map(ing => ({
        name: translateIngredient(ing.name),
        measure: ing.measure
      }));
    }
  } else {
    // 3. Local Dictionary fallback (Priority 3)
    translatedIngredients = meal.ingredients.map(ing => ({
      name: translateIngredient(ing.name),
      measure: ing.measure
    }));
  }

  // -------------------------------------------------------------
  // PART B: INSTRUCTIONS SEAMLESS TRANSLATION
  // -------------------------------------------------------------
  let rawInstructionsTranslation = '';
  if (meal.instructions && meal.instructions.trim()) {
    try {
      // 1. Google Translate (Priority 1)
      rawInstructionsTranslation = await googleTranslate(meal.instructions);
      console.log(`[CariMakan Translation] Instruksi "${meal.name}" diterjemahkan lewat Google Translate`);
    } catch (err) {
      // 2. Gemini API (Priority 2)
      console.log('[CariMakan Translation] Google Translate gagal untuk instruksi. Mencoba Gemini...');
      const ai = getGeminiClient();
      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `Terjemahkan petunjuk memasak berikut ke dalam Bahasa Indonesia yang alami, mengalir, ramah pengguna, dan elegan. Jangan sertakan teks prolog, epilog, atau code blocks markdown:\n\n${meal.instructions}`
          });
          if (response.text) {
            rawInstructionsTranslation = response.text.trim();
            console.log(`[CariMakan Translation] Instruksi "${meal.name}" diterjemahkan lewat Gemini API`);
          }
        } catch (gemErr) {
          console.error('[CariMakan Translation] Gemini API gagal menerjemahkan instruksi:', gemErr);
        }
      }
    }
  }

  if (rawInstructionsTranslation) {
    const refined = refineIndonesianInstructions(rawInstructionsTranslation);
    formattedInstructions = translateInstruction(refined, meal.name);
  } else {
    // 3. Local dictionary fallback (Priority 3)
    const refined = refineIndonesianInstructions(meal.instructions);
    formattedInstructions = translateInstruction(refined, meal.name);
  }

  return {
    ...meal,
    category: translateCategory(meal.category),
    area: translateArea(meal.area, meal.name),
    instructions: formattedInstructions,
    ingredients: translatedIngredients
  };
}

// High-performance server-side in-memory translation cache (id -> processed Meal)
const detailedMealsCache = new Map<string, Meal>();

export async function fetchMealById(id: string): Promise<Meal | null> {
  try {
    const trimmedId = id.trim();
    if (detailedMealsCache.has(trimmedId)) {
      console.log(`[CariMakan Cache] Returning pre-translated meal from cache: ${trimmedId}`);
      return detailedMealsCache.get(trimmedId)!;
    }

    const trimmed = encodeURIComponent(trimmedId);
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${trimmed}`);
    if (!response.ok) {
      throw new Error(`TheMealDB returned status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.meals || data.meals.length === 0) return null;
    
    const meal = transformRawMeal(data.meals[0]);
    // Apply Gemini-powered automatic translation
    const translatedMeal = await translateMealDetails(meal);
    
    // Save to server-side cache
    detailedMealsCache.set(trimmedId, translatedMeal);
    return translatedMeal;
  } catch (error) {
    console.error(`Error fetching meal by id "${id}":`, error);
    throw error;
  }
}
