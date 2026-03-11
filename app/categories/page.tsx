'use client'

import { useState, useMemo, Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, MapPin, SlidersHorizontal, ArrowRight, Building2 } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { CATEGORIES, CITIES } from '@/lib/data'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'

interface Business {
  id: string
  businessName: string
  category: string
  city: string
  logoUrl?: string
  description: string
  phone: string
  address: string
  slug?: string
}

function CategoriesContent() {
  const searchParams = useSearchParams()
  const [queryText, setQueryText] = useState(searchParams.get('q') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [selectedCat, setSelectedCat] = useState(searchParams.get('cat') || '')
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(false)

  const filtered = useMemo(() => {
    return CATEGORIES.filter((cat) => {
      if (selectedCat && cat.id !== selectedCat) return false
      if (queryText && !cat.name.toLowerCase().includes(queryText.toLowerCase())) return false
      return true
    })
  }, [queryText, selectedCat])

  // Fetch businesses from Firebase
  useEffect(() => {
    async function fetchBusinesses() {
      if (!selectedCat) {
        setBusinesses([])
        return
      }
      
      setLoading(true)
      try {
        let q = query(
          collection(db, 'businesses'),
          where('category', '==', selectedCat),
          where('status', '==', 'approved'),
          orderBy('createdAt', 'desc'),
          limit(20)
        )
        
        if (city) {
          q = query(
            collection(db, 'businesses'),
            where('category', '==', selectedCat),
            where('city', '==', city),
            where('status', '==', 'approved'),
            orderBy('createdAt', 'desc'),
            limit(20)
          )
        }
        
        const snapshot = await getDocs(q)
        const businessList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Business[]
        
        setBusinesses(businessList)
      } catch (error) {
        console.error('Error fetching businesses:', error)
        setBusinesses([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchBusinesses()
  }, [selectedCat, city])

  return (
    <main>
      {/* Page Header */}
      <section className="bg-[#0f2b3d] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-balance">
            Business Categories
          </h1>
          <p className="mt-2 text-white/60 text-lg">
            Browse all {CATEGORIES.length} categories across Pakistan
          </p>

          {/* Filter Bar */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1 bg-white rounded-xl px-4 py-2.5">
              <Search className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Search categories..."
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
                aria-label="Search categories"
              />
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 sm:w-48">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1 text-sm text-gray-600 bg-transparent outline-none cursor-pointer"
                aria-label="Select city"
              >
                <option value="">All Cities</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" aria-hidden="true" />
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="text-sm text-gray-600 bg-transparent outline-none cursor-pointer"
                aria-label="Filter category"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid or Business Listings */}
      <section className="py-14 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedCat ? (
            // Show businesses for selected category
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#0f2b3d]">
                  {CATEGORIES.find(c => c.id === selectedCat)?.name} Businesses
                  {city && ` in ${city}`}
                </h2>
                <button
                  onClick={() => setSelectedCat('')}
                  className="text-[#60a5fa] hover:text-blue-600 text-sm font-medium"
                >
                  ← Back to Categories
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#60a5fa] mx-auto"></div>
                  <p className="mt-4 text-gray-500">Loading businesses...</p>
                </div>
              ) : businesses.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-xl font-semibold">No businesses found</p>
                  <p className="mt-2 text-sm">Be the first to list your business in this category!</p>
                  <Link
                    href="/add-business"
                    className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-[#60a5fa] text-white rounded-xl font-semibold text-sm hover:bg-blue-400 transition-colors"
                  >
                    Add Your Business
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businesses.map((business) => (
                    <Link
                      key={business.id}
                      href={business.slug ? `/${business.slug}` : `/business/${business.id}`}
                      className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        {business.logoUrl ? (
                          <img
                            src={business.logoUrl}
                            alt={`${business.businessName} logo`}
                            className="w-16 h-16 rounded-xl object-cover border border-gray-100"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#0f2b3d] text-lg group-hover:text-[#60a5fa] transition-colors">
                            {business.businessName}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {business.city} • {business.phone}
                          </p>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {business.description}
                          </p>
                          <div className="mt-3 flex items-center gap-1 text-[#60a5fa] text-sm font-medium">
                            View Details <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Show category grid
            filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-xl font-semibold">No categories found</p>
                <p className="mt-2 text-sm">Try a different search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover flex items-center gap-5 text-left w-full"
                  >
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: cat.color + '1a' }}
                      aria-hidden="true"
                    >
                      {cat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-[#0f2b3d] text-base">{cat.name}</h2>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {cat.count.toLocaleString()} listings
                        {city ? ` in ${city}` : ' across Pakistan'}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-[#60a5fa] text-xs font-medium">
                        Browse listings <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                    <div
                      className="w-1 self-stretch rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            )
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[#0f2b3d]">
            Can&apos;t find your business?
          </h2>
          <p className="mt-2 text-gray-500">List your company for free and reach thousands of customers.</p>
          <Link
            href="/add-business"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#60a5fa] text-white rounded-xl font-semibold text-sm hover:bg-blue-400 transition-colors duration-200"
          >
            Add Your Business Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}

export default function CategoriesPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <CategoriesContent />
      </Suspense>
      <Footer />
    </>
  )
}
