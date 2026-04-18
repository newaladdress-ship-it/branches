// Category mapping to handle different ways categories might be stored in Firebase
// Extended to include all possible variations found in legacy data
export const CATEGORY_MAPPINGS: Record<string, string[]> = {
  // Main category mappings - extended with all possible variations
  'retail': [
    'retail', 'shopping', 'retail & shopping', 'retail and shopping',
    'retail-shopping', 'retail_shopping', 'Retail', 'Shopping', 'Retail & Shopping'
  ],
  'restaurants': [
    'restaurants', 'restaurants & food', 'food', 'restaurant', 'food & dining',
    'restaurants-food', 'restaurants_food', 'Restaurants', 'Restaurant', 'Food',
    'Restaurants & Food', 'dining', 'eatery', 'cafe', 'cafes'
  ],
  'real-estate': [
    'real estate', 'property', 'real-estate', 'properties', 'realestate',
    'real_estate', 'Real Estate', 'Property', 'Properties', 'housing', 'homes'
  ],
  'technology': [
    'technology', 'tech', 'it', 'technology & it', 'information technology',
    'technology-it', 'technology_it', 'Technology', 'Tech', 'IT',
    'Technology & IT', 'software', 'computers', 'digital'
  ],
  'healthcare': [
    'healthcare', 'medical', 'healthcare & medical', 'health', 'hospital',
    'healthcare-medical', 'healthcare_medical', 'Healthcare', 'Medical', 'Health',
    'Healthcare & Medical', 'clinic', 'clinics', 'hospitals', 'pharmacy'
  ],
  'education': [
    'education', 'training', 'education & training', 'school', 'learning',
    'education-training', 'education_training', 'Education', 'Training', 'School',
    'Education & Training', 'schools', 'university', 'college', 'tuition'
  ],
  'automotive': [
    'automotive', 'cars', 'vehicles', 'auto', 'car services',
    'Automotive', 'Cars', 'Vehicles', 'Auto', 'automobile', 'car', 'motor'
  ],
  'finance': [
    'finance', 'banking', 'finance & banking', 'financial', 'bank',
    'finance-banking', 'finance_banking', 'Finance', 'Banking', 'Bank',
    'Finance & Banking', 'banks', 'insurance', 'investment'
  ],
  'travel': [
    'travel', 'tourism', 'travel & tourism', 'tourism & travel',
    'travel-tourism', 'travel_tourism', 'Travel', 'Tourism', 'Travel & Tourism',
    'hotels', 'hotel', 'tours', 'airline', 'airlines'
  ],
  'beauty': [
    'beauty', 'wellness', 'beauty & wellness', 'salon', 'spa',
    'beauty-wellness', 'beauty_wellness', 'Beauty', 'Wellness', 'Salon', 'Spa',
    'Beauty & Wellness', 'salons', 'spas', 'gym', 'fitness'
  ],
  'construction': [
    'construction', 'building', 'contractor', 'builder',
    'Construction', 'Building', 'Contractor', 'Builder',
    'builders', 'contractors', 'architecture', 'civil'
  ],
  'logistics': [
    'logistics', 'transport', 'transportation', 'shipping', 'delivery',
    'logistics-transport', 'logistics_transport', 'Logistics', 'Transport',
    'Logistics & Transport', 'courier', 'cargo', 'freight'
  ],
}

export const LIVE_STATUSES = new Set(['approved', 'pending', 'live', 'active', ''])

/**
 * Normalizes a category string for comparison
 * Handles spaces, hyphens, underscores, and case differences
 */
export function normalizeCategory(value: string): string {
  if (!value) return ''
  return value
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')  // Replace spaces and underscores with hyphens
    .replace(/-+/g, '-')       // Remove duplicate hyphens
    .replace(/^-|-$/g, '')     // Remove leading/trailing hyphens
}

/**
 * Gets the main category ID from any category name
 * Uses flexible matching to handle legacy data inconsistencies
 */
export function getCategoryIdFromName(categoryName: string): string | null {
  if (!categoryName) return null
  
  const normalized = normalizeCategory(categoryName)
  
  // First, check if it's already a valid category ID
  if (CATEGORY_MAPPINGS[normalized]) {
    return normalized
  }
  
  // Then check all mappings
  for (const [categoryId, possibleNames] of Object.entries(CATEGORY_MAPPINGS)) {
    const normalizedNames = possibleNames.map(name => normalizeCategory(name))
    
    if (normalizedNames.includes(normalized)) {
      return categoryId
    }
    
    // Fuzzy matching: check if the normalized value contains or is contained by any mapping
    for (const name of normalizedNames) {
      if (normalized === name || 
          normalized.includes(name) || 
          name.includes(normalized) ||
          // Handle cases like "restaurant" matching "restaurants"
          normalized.replace(/s$/, '') === name.replace(/s$/, '')) {
        return categoryId
      }
    }
  }
  
  return null
}

/**
 * Checks if a business belongs to a category using flexible matching
 */
export function isBusinessInCategory(businessCategory: string, targetCategoryId: string): boolean {
  if (!businessCategory || !targetCategoryId) return false
  
  // Direct match after normalization
  if (normalizeCategory(businessCategory) === normalizeCategory(targetCategoryId)) {
    return true
  }
  
  // Check via category mapping
  const businessCategoryId = getCategoryIdFromName(businessCategory)
  return businessCategoryId === targetCategoryId
}

/**
 * Gets all possible category values for Firestore queries
 * Returns a comprehensive list to handle legacy data variations
 */
export function getPossibleCategoryValues(categoryId: string): string[] {
  const mapped = CATEGORY_MAPPINGS[categoryId] ?? []
  
  // Build comprehensive list including various format variations
  const values = new Set<string>([
    categoryId,
    ...mapped,
    // Add common variations
    categoryId.replace(/-/g, ' '),
    categoryId.replace(/-/g, '_'),
    categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
  ])
  
  return Array.from(values)
}

/**
 * Normalizes category value for storage
 * Always stores in slug format (lowercase, hyphenated)
 */
export function normalizeCategoryForStorage(categoryValue: string): string {
  const matched = getCategoryIdFromName(categoryValue)
  return matched ?? normalizeCategory(categoryValue)
}

/**
 * Client-side filter to match businesses to a category
 * Use this when Firestore 'in' query doesn't catch all variations
 */
export function filterBusinessesByCategory<T extends { category?: string; categoryId?: string; categorySlug?: string }>(
  businesses: T[],
  targetCategoryId: string
): T[] {
  const normalizedTarget = normalizeCategory(targetCategoryId)
  
  return businesses.filter(business => {
    // Check all possible category fields
    const categoryFields = [
      business.category,
      business.categoryId,
      business.categorySlug
    ].filter(Boolean)
    
    return categoryFields.some(field => {
      if (!field) return false
      
      // Direct normalized match
      if (normalizeCategory(field) === normalizedTarget) {
        return true
      }
      
      // Check via mapping
      const matchedId = getCategoryIdFromName(field)
      return matchedId === targetCategoryId
    })
  })
}
