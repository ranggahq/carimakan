/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Mapping of Food Categories
export const CATEGORY_MAP: Record<string, string> = {
  'Chicken': 'Ayam',
  'Beef': 'Daging Sapi',
  'Pork': 'Daging Babi',
  'Seafood': 'Hidangan Laut',
  'Dessert': 'Makanan Penutup',
  'Vegetarian': 'Vegetarian',
  'Breakfast': 'Sarapan',
  'Pasta': 'Pasta',
  'Lamb': 'Daging Kambing',
  'Side': 'Pelengkap',
  'Starter': 'Pembuka',
  'Goat': 'Daging Kambing',
  'Vegan': 'Vegan',
  'Miscellaneous': 'Lain-lain'
};

// Mapping of Food Areas (Country of Origin)
export const AREA_MAP: Record<string, string> = {
  'American': 'Amerika Serikat',
  'British': 'Inggris',
  'Canadian': 'Kanada',
  'Chinese': 'Tiongkok',
  'Croatian': 'Kroasia',
  'Dutch': 'Belanda',
  'Egyptian': 'Mesir',
  'French': 'Prancis',
  'Greek': 'Yunani',
  'Indian': 'India',
  'Irish': 'Irlandia',
  'Italian': 'Italia',
  'Jamaican': 'Jamaika',
  'Japanese': 'Jepang',
  'Kenyan': 'Kenya',
  'Malaysian': 'Malaysia',
  'Mexican': 'Meksiko',
  'Moroccan': 'Maroko',
  'Polish': 'Polandia',
  'Portuguese': 'Portugal',
  'Russian': 'Rusia',
  'Spanish': 'Spanyol',
  'Thai': 'Thailand',
  'Tunisian': 'Tunisia',
  'Turkish': 'Turki',
  'Ukrainian': 'Ukraina',
  'Uruguayan': 'Uruguay',
  'Vietnamese': 'Vietnam',
  'Unknown': 'Internasional'
};

// Large Dictionary of Common Ingredients (English -> Indonesian)
export const INGREDIENT_DICTIONARY: Record<string, string> = {
  // Meats and Seafood
  'chicken breast': 'dada ayam',
  'chicken breasts': 'dada ayam',
  'chicken thigh': 'paha ayam',
  'chicken thighs': 'paha ayam',
  'chicken legs': 'paha bawah ayam',
  'chicken': 'ayam',
  'beef': 'daging sapi',
  'ground beef': 'daging sapi cincang',
  'beef mince': 'daging sapi cincang',
  'pork': 'daging babi',
  'bacon': 'daging asap babi',
  'lamb': 'daging kambing',
  'mutton': 'daging kambing tua',
  'prawns': 'udang',
  'shrimp': 'udang',
  'salmon': 'salmon',
  'tuna': 'tuna',
  'cod': 'ikan kod',
  'fish': 'ikan',
  'anchovies': 'ikan teri',
  'squid': 'cumi-cumi',
  
  // Vegetables and Herbs
  'onion': 'bawang bombay',
  'onions': 'bawang bombay',
  'garlic': 'bawang putih',
  'garlic clove': 'siung bawang putih',
  'garlic cloves': 'siung bawang putih',
  'ginger': 'jahe',
  'shallot': 'bawang merah',
  'shallots': 'bawang merah',
  'spring onion': 'daun bawang',
  'spring onions': 'daun bawang',
  'scallion': 'daun bawang',
  'scallions': 'daun bawang',
  'tomato': 'tomat',
  'tomatoes': 'tomat',
  'potato': 'kentang',
  'potatoes': 'kentang',
  'carrot': 'wortel',
  'carrots': 'wortel',
  'parsley': 'peterseli',
  'cilantro': 'daun ketumbar',
  'coriander': 'ketumbar',
  'basil': 'selasih / kemangi',
  'spinach': 'bayam',
  'lettuce': 'selada',
  'cabbage': 'kubis',
  'broccoli': 'brokoli',
  'cauliflower': 'kembang kol',
  'cucumber': 'mentimun',
  'chili': 'cabai',
  'chilis': 'cabai',
  'chilies': 'cabai',
  'red chili': 'cabai merah',
  'green chili': 'cabai hijau',
  'limousin beef': 'daging sapi limosin',
  'mushroom': 'jamur',
  'mushrooms': 'jamur',
  'bell pepper': 'paprika',
  'bell peppers': 'paprika',
  'celery': 'seledri',
  'eggplant': 'terong',
  'lemon': 'lemon',
  'lime': 'jeruk nipis',

  // Pantry and Baking
  'egg': 'telur',
  'eggs': 'telur',
  'milk': 'susu',
  'butter': 'mentega',
  'sugar': 'gula',
  'white sugar': 'gula pasir',
  'brown sugar': 'gula merah / palm',
  'salt': 'garam',
  'pepper': 'lada',
  'black pepper': 'lada hitam',
  'white pepper': 'lada putih',
  'flour': 'tepung',
  'plain flour': 'tepung terigu',
  'all-purpose flour': 'tepung serbaguna',
  'cheese': 'keju',
  'parmesan cheese': 'keju parmesan',
  'cheddar cheese': 'keju cheddar',
  'mozzarella': 'keju mozzarella',
  'water': 'air',
  'olive oil': 'minyak zaitun',
  'vegetable oil': 'minyak sayur',
  'sunflower oil': 'minyak bunga matahari',
  'sesame oil': 'minyak wijen',
  'oil': 'minyak',
  'honey': 'madu',
  'soy sauce': 'kecap asin',
  'sweet soy sauce': 'kecap manis',
  'fish sauce': 'saus ikan',
  'oyster sauce': 'saus tiram',
  'tomato paste': 'pasta tomat',
  'tomato sauce': 'saus tomat',
  'mayonnaise': 'mayones',
  'mustard': 'mustard',
  'vinegar': 'cuka',
  'rice': 'nasi / beras',
  'pasta': 'pasta',
  'spaghetti': 'spageti',
  'noodles': 'mie',
  'bread': 'roti',
  'yeast': 'ragi',
  'baking powder': 'baking powder',
  'baking soda': 'soda kue',
  'vanilla extract': 'ekstrak vanila',
  'cinnamon': 'kayu manis',
  'cumin': 'jinten',
  'turmeric': 'kunyit',
  'paprika powder': 'paprika bubuk',
  'chili powder': 'cabai bubuk',
  'oregano': 'oregano',
  'thyme': 'timi',
  'rosemary': 'rosemary',
  'bay leaf': 'daun salam',
  'bay leaves': 'daun salam',
  'nutmeg': 'pala',
  'cloves': 'cengkeh',
  'cardamom': 'kapulaga'
};

// Common Cooking Instructions phrases for static dictionary/fallback translations
export const INSTRUCTION_PHRASE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/heat the oil/i, 'panaskan minyak'],
  [/add the garlic/i, 'tambahkan bawang putih'],
  [/add the onions/i, 'tambahkan bawang bombay'],
  [/stir fry/i, 'tumis'],
  [/cook until golden/i, 'masak sampai berwarna keemasan'],
  [/season with salt/i, 'bumbui dengan garam'],
  [/season with salt and pepper/i, 'bumbui dengan garam dan lada'],
  [/bring to a boil/i, 'didihkan'],
  [/simmer for/i, 'rebus perlahan selama'],
  [/mix well/i, 'campur rata'],
  [/serve hot/i, 'sajikan selagi hangat'],
  [/preheat oven to/i, 'panaskan oven terlebih dahulu ke suhu'],
  [/bake for/i, 'panggang selama'],
  [/stir in/i, 'masukkan'],
  [/drain and set aside/i, 'tiriskan dan sisihkan']
];

/**
 * Translates a category into Indonesian.
 */
export function translateCategory(category: string): string {
  if (!category) return 'Lain-lain';
  const trimmed = category.trim();
  return CATEGORY_MAP[trimmed] || trimmed;
}

/**
 * Translates an area (country) into Indonesian with special overrides for Indonesian foods.
 */
export function translateArea(area: string, mealName: string = ''): string {
  const normName = (mealName || '').toLowerCase();
  
  // High accuracy special overrides for Indonesian local foods
  if (
    normName.includes('rendang') ||
    normName.includes('sate') ||
    normName.includes('satay') ||
    normName.includes('nasi goreng') ||
    normName.includes('soto') ||
    normName.includes('gado-gado') ||
    normName.includes('pempek') ||
    normName.includes('rawon') ||
    normName.includes('gudeg')
  ) {
    return 'Indonesia';
  }

  if (!area) return 'Umum';
  const trimmed = area.trim();
  return AREA_MAP[trimmed] || trimmed;
}

/**
 * Translates an ingredient name into Indonesian using a extensive local dictionary.
 */
export function translateIngredient(ingredientName: string): string {
  if (!ingredientName) return 'Informasi bahan belum tersedia.';
  
  const trimmed = ingredientName.trim().toLowerCase();
  if (!trimmed) return 'Informasi bahan belum tersedia.';
  
  // Try exact match
  if (INGREDIENT_DICTIONARY[trimmed]) {
    return capitalizeWords(INGREDIENT_DICTIONARY[trimmed]);
  }

  // Try partial replacements / word by word matching
  let result = trimmed;
  
  // Common multi-word transforms
  result = result
    .replace(/\bchicken breast\b/g, 'dada ayam')
    .replace(/\bchicken breasts\b/g, 'dada ayam')
    .replace(/\bchicken thigh\b/g, 'paha ayam')
    .replace(/\bchicken thighs\b/g, 'paha ayam')
    .replace(/\bchicken leg\b/g, 'paha bawah ayam')
    .replace(/\bchicken legs\b/g, 'paha bawah ayam')
    .replace(/\bground beef\b/g, 'daging sapi cincang')
    .replace(/\bbeef mince\b/g, 'daging sapi cincang')
    .replace(/\bgarlic cloves\b/g, 'siung bawang putih')
    .replace(/\bgarlic clove\b/g, 'siung bawang putih')
    .replace(/\bspring onion\b/g, 'daun bawang')
    .replace(/\bspring onions\b/g, 'daun bawang')
    .replace(/\bvegetable oil\b/g, 'minyak sayur')
    .replace(/\bolive oil\b/g, 'minyak zaitun')
    .replace(/\bsunflower oil\b/g, 'minyak bunga matahari')
    .replace(/\bsesame oil\b/g, 'minyak wijen')
    .replace(/\bsoy sauce\b/g, 'kecap asin')
    .replace(/\bsweet soy sauce\b/g, 'kecap manis')
    .replace(/\bfish sauce\b/g, 'saus ikan')
    .replace(/\boyster sauce\b/g, 'saus tiram')
    .replace(/\btomato paste\b/g, 'pasta tomat')
    .replace(/\btomato sauce\b/g, 'saus tomat')
    .replace(/\bwhite sugar\b/g, 'gula pasir')
    .replace(/\bbrown sugar\b/g, 'gula merah')
    .replace(/\bblack pepper\b/g, 'lada hitam')
    .replace(/\bwhite pepper\b/g, 'lada putih')
    .replace(/\bvanilla extract\b/g, 'ekstrak vanila')
    .replace(/\bbaking powder\b/g, 'baking powder')
    .replace(/\bbaking soda\b/g, 'soda kue');

  // Single word checks
  const words = result.split(' ');
  const translatedWords = words.map(word => {
    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    const mapped = INGREDIENT_DICTIONARY[cleanWord];
    if (mapped) {
      return word.replace(cleanWord, mapped);
    }
    return word;
  });

  result = translatedWords.join(' ');
  return capitalizeWords(result);
}

/**
 * Fully formats rules and translates sentences into Indonesian step-by-step paragraphs.
 */
export function translateInstruction(instructions: string, mealName: string = ''): string {
  if (!instructions || !instructions.trim()) {
    return 'Petunjuk memasak belum tersedia.';
  }

  // Check if instructions are already mostly in Indonesian
  const lower = instructions.toLowerCase();
  const isIndonesian = lower.includes('panaskan') || lower.includes('tambahkan') || lower.includes('langkah') || lower.includes('masak hingga');
  
  let lines: string[] = [];
  
  if (isIndonesian) {
    // If already Indonesian, check if it contains step numbering. If not, split by dot/newlines and format
    lines = instructions
      .split(/\r?\n|\.\s+/)
      .map(line => line.trim())
      .filter(line => line.length > 5);
  } else {
    // If English, we split and translate sentences using basic replacements, but Gemini API handles the high fidelity translation.
    // In either case, we clean and map to steps
    lines = instructions
      .split(/\r?\n|\.\s+/)
      .map(line => line.trim())
      .filter(line => line.length > 5);

    // Apply phrase translations
    lines = lines.map(line => {
      let l = line;
      for (const [pattern, replacement] of INSTRUCTION_PHRASE_REPLACEMENTS) {
        l = l.replace(pattern, replacement);
      }
      return l;
    });
  }

  // Format into ordered list: "Langkah 1: ... \n Langkah 2: ... "
  const formattedSteps: string[] = [];
  let stepCount = 1;

  for (const line of lines) {
    let cleanLine = line;
    // Strip prefixes like "Step 1", "1.", "Langkah 1 -", "Step 1:", etc.
    cleanLine = cleanLine.replace(/^(step|langkah|stage|phase)?\s*\d+\s*[-:.]\s*/i, '');
    cleanLine = cleanLine.replace(/^\d+\s*[-:.]?\s*/, '');
    
    if (cleanLine.trim().length > 3) {
      // Ensure the step begins with Capital letter
      cleanLine = cleanLine.charAt(0).toUpperCase() + cleanLine.slice(1);
      
      // Ensure the step ends with a dot
      if (!cleanLine.endsWith('.')) {
        cleanLine += '.';
      }

      formattedSteps.push(`Langkah ${stepCount}: ${cleanLine}`);
      stepCount++;
    }
  }

  if (formattedSteps.length === 0) {
    return 'Petunjuk memasak belum tersedia.';
  }

  return formattedSteps.join('\r\n');
}

// Helpers
function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
