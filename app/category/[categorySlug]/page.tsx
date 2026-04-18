import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import React from 'react'
import { Building2, Phone, ArrowRight, ChevronRight, MapPin } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { CATEGORIES } from '@/lib/data'
import { generateCategoryContent } from '@/lib/seo-content'
import { getPossibleCategoryValues, LIVE_STATUSES, filterBusinessesByCategory, normalizeCategory } from '@/lib/category-mappings'
import { getCategoryKeywordCluster } from '@/lib/organic-keywords'
import NativeAd from '@/components/ads/native-ad'
import BannerAd from '@/components/ads/banner-ad'

// Always fetch fresh data so new businesses appear immediately
export const revalidate = 0

const BASE_URL = 'https://pakbizbranhces.online'

interface Business {
  id: string
  businessName: string
  slug: string
  city: string
  category: string
  description: string
  phone: string
  logoUrl?: string
}

interface CityCount {
  name: string
  slug: string
  count: number
}

/**
 * Converts a city name to URL slug
 */
function cityNameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

/**
 * Extracts unique cities with business counts from a list of businesses
 */
function extractCitiesWithCounts(businesses: Business[]): CityCount[] {
  const cityMap = new Map<string, number>()
  
  businesses.forEach(biz => {
    if (biz.city) {
      const cityName = biz.city.trim()
      cityMap.set(cityName, (cityMap.get(cityName) || 0) + 1)
    }
  })
  
  return Array.from(cityMap.entries())
    .map(([name, count]) => ({
      name,
      slug: cityNameToSlug(name),
      count
    }))
    .sort((a, b) => b.count - a.count) // Sort by count descending
}

export async function generateStaticParams() {
  return CATEGORIES.map(cat => ({ categorySlug: cat.id }))
}

export async function generateMetadata(props: { params: Promise<{ categorySlug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const category = CATEGORIES.find(c => c.id === params.categorySlug)
  if (!category) return { title: 'Category Not Found | PakBizBranches' }

  const title = `Best ${category.name} in Pakistan | Local Listings`
  const description = `Discover top ${category.name.toLowerCase()} in Pakistan with phone numbers, addresses, and verified local business listings.`
  const url = `${BASE_URL}/categories/${params.categorySlug}`
  const keywordCluster = getCategoryKeywordCluster(params.categorySlug)

  return {
    title,
    description,
    keywords: [
      `${category.name} Pakistan`,
      `${category.name.toLowerCase()} businesses Pakistan`,
      `best ${category.name.toLowerCase()} in Pakistan`,
      ...keywordCluster,
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'PakBizBranches',
      locale: 'en_PK',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function CategoryPage(props: { params: Promise<{ categorySlug: string }> }) {
  const params = await props.params
  const category = CATEGORIES.find(c => c.id === params.categorySlug)
  if (!category) notFound()

  let businesses: Business[] = []
  try {
    // Get all possible category values for flexible matching
    const categoryValues = getPossibleCategoryValues(params.categorySlug)
    // Firestore 'in' query supports max 30 values - take first 10 most common
    const queryValues = categoryValues.slice(0, 10)
    
    // Query 1: by categoryId (new standardized field)
    const categoryIdQuery = query(
      collection(db, 'businesses'), 
      where('categoryId', '==', params.categorySlug), 
      limit(100)
    )
    
    // Query 2: by categorySlug (alternate standardized field)
    const categorySlugQuery = query(
      collection(db, 'businesses'), 
      where('categorySlug', '==', params.categorySlug), 
      limit(100)
    )
    
    // Query 3: by category field with multiple possible values (legacy support)
    const categoryQuery = query(
      collection(db, 'businesses'), 
      where('category', 'in', queryValues), 
      limit(100)
    )
    
    // Execute all queries in parallel
    const [idSnapshot, slugSnapshot, categorySnapshot] = await Promise.all([
      getDocs(categoryIdQuery),
      getDocs(categorySlugQuery),
      getDocs(categoryQuery)
    ])
    
    // Merge results, removing duplicates
    const merged = new Map<string, Business>()
    
    const processDoc = (doc: any) => {
      if (merged.has(doc.id)) return
      
      const data = doc.data()
      const business = { id: doc.id, ...data } as Business & { status?: string }
      const status = String(business.status ?? '').toLowerCase()
      
      // Check if status is valid (approved, pending, live, active, or empty/undefined)
      if (LIVE_STATUSES.has(status)) {
        merged.set(doc.id, business)
      }
    }
    
    idSnapshot.docs.forEach(processDoc)
    slugSnapshot.docs.forEach(processDoc)
    categorySnapshot.docs.forEach(processDoc)
    
    // Client-side filtering as final fallback to catch any edge cases
    // This handles businesses where the category field has unexpected variations
    let allBusinesses = Array.from(merged.values())
    
    // If we got very few results, fetch more and filter client-side
    if (allBusinesses.length < 5) {
      const broadQuery = query(
        collection(db, 'businesses'),
        limit(200)
      )
      const broadSnapshot = await getDocs(broadQuery)
      
      broadSnapshot.docs.forEach((doc) => {
        if (merged.has(doc.id)) return
        
        const data = doc.data()
        const business = { id: doc.id, ...data } as Business & { status?: string; categoryId?: string; categorySlug?: string }
        const status = String(business.status ?? '').toLowerCase()
        
        if (!LIVE_STATUSES.has(status)) return
        
        // Check if this business matches the category using flexible matching
        const categoryFields = [business.category, business.categoryId, business.categorySlug].filter(Boolean) as string[]
        const matches = categoryFields.some(field => {
          const normalized = normalizeCategory(field)
          const targetNormalized = normalizeCategory(params.categorySlug)
          return normalized === targetNormalized || 
                 normalized.includes(targetNormalized) || 
                 targetNormalized.includes(normalized)
        })
        
        if (matches) {
          merged.set(doc.id, business)
        }
      })
      
      allBusinesses = Array.from(merged.values())
    }
    
    businesses = allBusinesses
  } catch (error) {
    console.error('Error fetching businesses by category:', error)
  }

  // Extract cities with counts from actual business data
  const citiesWithCounts = extractCitiesWithCounts(businesses)
  
  // Limit displayed businesses to 40 for the listing section
  const displayedBusinesses = businesses.slice(0, 40)

  const content = generateCategoryContent(params.categorySlug)
  const pageUrl = `${BASE_URL}/categories/${params.categorySlug}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: `${BASE_URL}/categories` },
      { '@type': 'ListItem', position: 3, name: category.name, item: pageUrl },
    ],
  }

  const itemListSchema = businesses.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} Businesses in Pakistan`,
    numberOfItems: businesses.length,
    itemListElement: businesses.slice(0, 10).map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.businessName,
      url: `${BASE_URL}/${b.slug}`,
    })),
  } : null

  const faqItems = [
    {
      q: `How do I find the best ${category.name} in Pakistan?`,
      a: `Compare listed ${category.name.toLowerCase()} businesses by city, contact details, and service information on PakBizBranches.`,
    },
    {
      q: `Can I list my ${category.name.toLowerCase()} business for free?`,
      a: 'Yes, you can submit your business listing for free and appear in category and city pages.',
    },
    {
      q: `Do these listings include phone numbers and locations?`,
      a: 'Yes, most listings include direct phone numbers, city, and address details to help users contact businesses quickly.',
    },
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="bg-[#f8fafc] min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/categories" className="hover:text-white transition-colors">Categories</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">{category.name}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {category.name} Businesses in Pakistan
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Browse verified {category.name.toLowerCase()} businesses across 150+ cities in Pakistan.
            </p>
            <div className="mt-6 flex items-center gap-3 text-white/70 text-sm">
              <span className="bg-white/10 px-3 py-1 rounded-full">{businesses.length} Listings</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">{citiesWithCounts.length} Cities</span>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Top inline banner — placed AFTER H1 per spec */}
          <BannerAd variant="inline" className="mt-0 mb-10" />

          {/* Filter by City - Dynamic from database */}
          {citiesWithCounts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">
                {category.name} by City
                <span className="text-base font-normal text-gray-500 ml-3">({citiesWithCounts.length} cities)</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {citiesWithCounts.map(city => (
                  <Link
                    key={city.slug}
                    href={`/category/${params.categorySlug}/${city.slug}`}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#60a5fa]/30 transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-[#60a5fa]" />
                      <span className="font-semibold text-gray-900 group-hover:text-[#60a5fa] transition-colors truncate">
                        {city.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {city.count} {city.count === 1 ? 'business' : 'businesses'}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Business Listings */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">
              All {category.name} Businesses
              <span className="text-base font-normal text-gray-500 ml-3">({displayedBusinesses.length} of {businesses.length} listings)</span>
            </h2>

            {displayedBusinesses.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Listings Yet</h3>
                <p className="text-gray-500 mb-6">Be the first to list your {category.name.toLowerCase()} business!</p>
                <Link href="/add-business" className="inline-flex items-center gap-2 px-6 py-3 bg-[#60a5fa] text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors">
                  Add Your Business Free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedBusinesses.map((biz, index) => {
                  // Inject native ad after every 6 listings (per spec).
                  const shouldInjectAd =
                    (index + 1) % 6 === 0 && index !== displayedBusinesses.length - 1
                  return (
                    <React.Fragment key={biz.id}>
                      <Link
                        href={`/${biz.slug}`}
                        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#60a5fa]/30 transition-all group flex flex-col"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          {biz.logoUrl ? (
                            <img src={biz.logoUrl} alt={biz.businessName} className="w-14 h-14 rounded-lg object-cover border border-gray-100 shrink-0" loading="lazy" />
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] flex items-center justify-center shrink-0">
                              <Building2 className="w-7 h-7 text-white/60" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 group-hover:text-[#60a5fa] transition-colors leading-tight mb-1 truncate">
                              {biz.businessName}
                            </h3>
                            <span className="text-xs flex items-center gap-1 text-gray-500">
                              <MapPin className="w-3 h-3" /> {biz.city}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed flex-1">{biz.description}</p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                          <Phone className="w-3.5 h-3.5" />
                          {biz.phone}
                        </div>
                      </Link>

                      {/* Native ad injected every 6 listings */}
                      {shouldInjectAd && (
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                          <NativeAd />
                        </div>
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            )}

            {displayedBusinesses.length > 0 && (
              <div className="mt-6 text-center">
                <Link href="/add-business" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0f2b3d] to-[#1a3f57] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                  Add Your {category.name} Business — Free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </section>

          {/* SEO Content */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            {content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-[#0f2b3d] mt-4 mb-3">{line.replace('## ', '')}</h2>
              if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-[#0f2b3d] mt-3 mb-2">{line.replace('### ', '')}</h3>
              if (line.trim() === '') return <br key={i} />
              return <p key={i} className="text-gray-600 leading-relaxed mb-2">{line}</p>
            })}

            {/* Internal Architecture Linking */}
            <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium">
              <span className="text-gray-400">Related:</span>
              <Link href="/" className="text-[#60a5fa] hover:underline" title="Pakistan Business Directory">Directory Home</Link>
              <Link href="/categories" className="text-[#60a5fa] hover:underline" title="Browse Categories">All Categories</Link>
              <Link href="/add-business" className="text-[#60a5fa] hover:underline" title="Add Your Business Free">Add Business Free</Link>
              <Link href="/blog" className="text-[#60a5fa] hover:underline" title="Business Blog">Business Guides</Link>
            </div>
          </section>

          <section className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#0f2b3d] mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.q}>
                  <h3 className="font-semibold text-gray-900">{item.q}</h3>
                  <p className="text-gray-600 mt-1">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      {/* Sticky bottom banner — mobile only, does not cover primary buttons */}
      <BannerAd variant="sticky-mobile" />
      <Footer />
    </>
  )
}
