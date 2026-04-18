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
import { getPossibleCategoryValues, LIVE_STATUSES, normalizeCategory } from '@/lib/category-mappings'
import NativeAd from '@/components/ads/native-ad'
import BannerAd from '@/components/ads/banner-ad'

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
  address: string
  logoUrl?: string
}

/**
 * Converts a city slug back to display name
 */
function citySlugToName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Converts a city name to URL slug
 */
function cityNameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

export async function generateMetadata(props: { 
  params: Promise<{ categorySlug: string; citySlug: string }> 
}): Promise<Metadata> {
  const params = await props.params
  const category = CATEGORIES.find(c => c.id === params.categorySlug)
  const cityName = citySlugToName(params.citySlug)
  
  if (!category) {
    return { title: 'Category Not Found | PakBizBranches' }
  }

  // SEO optimized title: 50-60 characters
  const title = `${category.name} in ${cityName} | Local Business Listings`
  
  // SEO optimized description: 120-160 characters
  const description = `Find verified ${category.name.toLowerCase()} in ${cityName}, Pakistan. Browse contact details, addresses, and reviews for local businesses.`
  
  const url = `${BASE_URL}/category/${params.categorySlug}/${params.citySlug}`

  return {
    title,
    description,
    keywords: [
      `${category.name} ${cityName}`,
      `${category.name.toLowerCase()} in ${cityName}`,
      `best ${category.name.toLowerCase()} ${cityName}`,
      `${cityName} ${category.name.toLowerCase()}`,
      `${cityName} business directory`,
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

export default async function CategoryCityPage(props: { 
  params: Promise<{ categorySlug: string; citySlug: string }> 
}) {
  const params = await props.params
  const category = CATEGORIES.find(c => c.id === params.categorySlug)
  const cityName = citySlugToName(params.citySlug)
  
  if (!category) notFound()

  let businesses: Business[] = []
  
  try {
    const categoryValues = getPossibleCategoryValues(params.categorySlug).slice(0, 10)
    
    // Query 1: by categoryId + city
    const categoryIdQuery = query(
      collection(db, 'businesses'),
      where('categoryId', '==', params.categorySlug),
      where('city', '==', cityName),
      limit(200)
    )
    
    // Query 2: by category field (legacy) + city
    const categoryQuery = query(
      collection(db, 'businesses'),
      where('category', 'in', categoryValues),
      where('city', '==', cityName),
      limit(200)
    )
    
    const [idSnap, categorySnap] = await Promise.all([
      getDocs(categoryIdQuery),
      getDocs(categoryQuery)
    ])
    
    // Merge results
    const merged = new Map<string, Business>()
    
    const processDoc = (doc: any) => {
      if (merged.has(doc.id)) return
      const data = doc.data()
      const business = { id: doc.id, ...data } as Business & { status?: string }
      const status = String(business.status ?? '').toLowerCase()
      if (LIVE_STATUSES.has(status)) {
        merged.set(doc.id, business)
      }
    }
    
    idSnap.docs.forEach(processDoc)
    categorySnap.docs.forEach(processDoc)
    
    // Fallback: if few results, fetch all city businesses and filter client-side
    if (merged.size < 3) {
      const cityQuery = query(
        collection(db, 'businesses'),
        where('city', '==', cityName),
        limit(300)
      )
      const citySnap = await getDocs(cityQuery)
      
      citySnap.docs.forEach((doc) => {
        if (merged.has(doc.id)) return
        const data = doc.data()
        const business = { id: doc.id, ...data } as Business & { status?: string; categoryId?: string; categorySlug?: string }
        const status = String(business.status ?? '').toLowerCase()
        
        if (!LIVE_STATUSES.has(status)) return
        
        // Check if category matches
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
    }
    
    // Sort by businessName
    businesses = Array.from(merged.values())
      .sort((a, b) => a.businessName.localeCompare(b.businessName))
  } catch (error) {
    console.error('Error fetching businesses:', error)
  }

  const pageUrl = `${BASE_URL}/category/${params.categorySlug}/${params.citySlug}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: `${BASE_URL}/categories` },
      { '@type': 'ListItem', position: 3, name: category.name, item: `${BASE_URL}/category/${params.categorySlug}` },
      { '@type': 'ListItem', position: 4, name: cityName, item: pageUrl },
    ],
  }

  const itemListSchema = businesses.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} in ${cityName}`,
    numberOfItems: businesses.length,
    itemListElement: businesses.slice(0, 10).map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.businessName,
      url: `${BASE_URL}/${b.slug}`,
    })),
  } : null

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      <main className="bg-[#f8fafc] min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/60 mb-6 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/categories" className="hover:text-white transition-colors">Categories</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/category/${params.categorySlug}`} className="hover:text-white transition-colors">{category.name}</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">{cityName}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {category.name} in {cityName}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Browse verified {category.name.toLowerCase()} businesses in {cityName}, Pakistan.
            </p>
            <div className="mt-6 flex items-center gap-3 text-white/70 text-sm">
              <span className="bg-white/10 px-3 py-1 rounded-full">{businesses.length} Listings</span>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <BannerAd variant="inline" className="mt-0 mb-10" />

          {/* Business Listings */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">
              All {category.name} in {cityName}
              <span className="text-base font-normal text-gray-500 ml-3">({businesses.length} listings)</span>
            </h2>

            {businesses.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Listings Yet</h3>
                <p className="text-gray-500 mb-6">Be the first to list your {category.name.toLowerCase()} business in {cityName}!</p>
                <Link href="/add-business" className="inline-flex items-center gap-2 px-6 py-3 bg-[#60a5fa] text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors">
                  Add Your Business Free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {businesses.map((biz, index) => {
                  const shouldInjectAd = (index + 1) % 6 === 0 && index !== businesses.length - 1
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

            {businesses.length > 0 && (
              <div className="mt-6 text-center">
                <Link href="/add-business" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0f2b3d] to-[#1a3f57] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                  Add Your {category.name} Business — Free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </section>

          {/* Cross-linking for SEO */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#0f2b3d] mb-4">Explore More</h2>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium">
              <Link href={`/category/${params.categorySlug}`} className="text-[#60a5fa] hover:underline">
                All {category.name} in Pakistan
              </Link>
              <Link href={`/cities/${params.citySlug}`} className="text-[#60a5fa] hover:underline">
                All Businesses in {cityName}
              </Link>
              <Link href="/categories" className="text-[#60a5fa] hover:underline">
                Browse All Categories
              </Link>
              <Link href="/add-business" className="text-[#60a5fa] hover:underline">
                Add Your Business
              </Link>
            </div>
          </section>
        </div>
      </main>
      <BannerAd variant="sticky-mobile" />
      <Footer />
    </>
  )
}
