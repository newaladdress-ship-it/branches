export const ORGANIC_SEED_KEYWORDS = [
  'business directory in pakistan',
  'find businesses near you pakistan',
  'top businesses in pakistan',
  'list your business for free pakistan',
  'best local services in pakistan',
  'verified businesses in pakistan',
  'restaurants in karachi',
  'real estate in lahore',
  'hospitals in islamabad',
  'software houses in rawalpindi',
  'schools in multan',
  'beauty salons in peshawar',
  'car workshops in quetta',
  'courier services in gujranwala',
  'construction companies in sialkot',
  'travel agencies in islamabad',
  'retail shops in karachi',
  'finance services in lahore',
  'top cafes in lahore',
  'best clinics in karachi',
  'business phone numbers pakistan',
  'top businesses near me in pakistan',
  'best companies in pakistan by city',
  'pakistan local business listings',
  'add business listing pakistan',
]

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  restaurants: ['best restaurants in pakistan', 'food delivery businesses in pakistan', 'cafes near me pakistan'],
  'real-estate': ['property dealers in pakistan', 'top real estate agencies pakistan', 'homes for rent pakistan'],
  technology: ['software houses in pakistan', 'it companies in pakistan', 'web development agencies pakistan'],
  healthcare: ['hospitals in pakistan', 'clinics near me pakistan', 'medical services in pakistan'],
  education: ['schools in pakistan', 'training institutes in pakistan', 'colleges in pakistan'],
  retail: ['shopping stores in pakistan', 'local retail shops pakistan', 'electronics stores pakistan'],
  construction: ['construction companies pakistan', 'builders and contractors pakistan', 'interior design services pakistan'],
  automotive: ['car mechanics in pakistan', 'auto workshops pakistan', 'car dealers in pakistan'],
  finance: ['banks in pakistan', 'insurance companies pakistan', 'accounting firms pakistan'],
  travel: ['travel agencies pakistan', 'tour operators pakistan', 'hotels in pakistan'],
  beauty: ['beauty salons in pakistan', 'spas in pakistan', 'wellness centers pakistan'],
  logistics: ['courier services pakistan', 'logistics companies pakistan', 'cargo services pakistan'],
}

export function getCategoryKeywordCluster(categorySlug: string): string[] {
  return CATEGORY_KEYWORDS[categorySlug] ?? ['local businesses in pakistan', 'business listings pakistan']
}

export function getCityKeywordCluster(cityName: string): string[] {
  const city = cityName.toLowerCase()
  return [
    `best businesses in ${city}`,
    `top services in ${city}`,
    `business directory ${city}`,
    `find local companies in ${city}`,
  ]
}
