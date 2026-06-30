/**
 * Helper to generate consistent, non-changing prices based on meal categories,
 * formatted in Indonesian Rupiah (Rp).
 */

export function getMealPrice(category?: string): number {
  if (!category) return 35000;
  
  const normalizedCategory = category.trim().toLowerCase();
  
  switch (normalizedCategory) {
    case 'chicken':
      return 35000;
    case 'beef':
      return 45000;
    case 'seafood':
      return 50000;
    case 'dessert':
      return 28000;
    case 'pasta':
      return 40000;
    case 'breakfast':
      return 30000;
    case 'vegetarian':
    case 'vegan':
      return 32000;
    case 'lamb':
      return 48000;
    case 'pork':
      return 42000;
    case 'goat':
      return 47000;
    case 'miscellaneous':
    case 'starter':
    case 'side':
      return 36000;
    default:
      return 35000;
  }
}

export function formatPrice(price: number): string {
  return `Rp${price.toLocaleString('id-ID')}`;
}
