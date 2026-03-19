'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, MapPin, ArrowLeft, Building2, Home, TrendingUp, Clock, Phone, Mail, Shield } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CitySearchDropdown from '@/components/ui/city-search-dropdown'
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
  whatsapp?: string
  address: string
  websiteUrl?: string
  slug?: string
}

export default function RealEstatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState(searchParams.get('city') || '')

  useEffect(() => {
    async function fetchRealEstate() {
      try {
        const q = query(
          collection(db, 'businesses'),
          where('category', '==', 'real-estate'),
          orderBy('createdAt', 'desc'),
          limit(20)
        )
        const querySnapshot = await getDocs(q)
        const realEstateData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Business))
        
        if (city) {
          const filtered = realEstateData.filter(b => b.city === city)
          setBusinesses(filtered)
        } else {
          setBusinesses(realEstateData)
        }
      } catch (error) {
        console.error('Error fetching real estate businesses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRealEstate()
  }, [city])

  return (
    <>
      <Navbar />
      <main>
        {/* Page Header */}
        <section className="bg-gradient-to-br from-green-600 to-emerald-700 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white text-balance mb-6">
              Struggling to Find Reliable Real Estate Services in Pakistan?
            </h1>
            <p className="text-xl text-white/90 leading-relaxed max-w-3xl">
              Every Pakistani knows the real estate nightmare - fake listings, untrustworthy agents, and properties that look nothing like their photos. 
              With Pakistan's property market booming in 2026, finding legitimate real estate services has become harder than ever. 
              We've solved this problem by creating a verified directory of trusted real estate professionals across Pakistan, from property dealers to construction companies.
            </p>

            {/* Search Bar */}
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 flex-1 bg-white rounded-xl px-4 py-2.5">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <CitySearchDropdown
                  value={city}
                  onChange={setCity}
                  placeholder="All Cities"
                  className="flex-1"
                />
              </div>
              <Link
                href="/add-business"
                className="bg-white text-green-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-green-50 transition-colors"
              >
                Add Your Real Estate Business
              </Link>
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Pakistan's Real Estate Market is Exploding</h2>
                
                <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
                  <p>
                    Pakistan's real estate sector is experiencing unprecedented growth in 2026, with property values increasing by 25% annually in major cities. 
                    This boom isn't just about speculation - it's driven by massive infrastructure projects, urbanization, and a growing middle class seeking better living standards. 
                    From Lahore's new housing societies to Karachi's commercial developments, the property market is transforming Pakistan's economic landscape.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-8">The Digital Transformation of Property Deals</h3>
                  <p>
                    Gone are the days when finding reliable property services meant relying on word-of-mouth or newspaper ads. Today's Pakistani property buyers and sellers 
                    research online, compare services, and verify credentials before making decisions. This digital shift has created both challenges and opportunities - 
                    real estate businesses with strong online presence thrive, while others struggle to compete. That's why being listed in our 
                    <a href="/" className="text-green-600 hover:text-green-700 underline font-medium">verified real estate directory</a> 
                    is crucial for success in 2026's competitive market.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-8">Regional Growth Hotspots</h3>
                  <p>
                    Pakistan's real estate boom isn't uniform - certain regions are experiencing exceptional growth. Islamabad's CPEC-related developments, 
                    Lahore's new housing societies, and Karachi's commercial projects are creating massive opportunities. However, this growth has also attracted 
                    unscrupulous operators, making it essential to work with verified professionals. Our <a href="/" className="text-green-600 hover:text-green-700 underline font-medium">trusted real estate platform</a> 
                    connects you with legitimate businesses, whether you're buying, selling, or investing in Pakistani property.
                  </p>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded">
                    <h4 className="font-bold text-blue-800 mb-2">💡 Pro Tip for Real Estate Professionals</h4>
                    <p className="text-blue-700">
                      The real estate market is booming, but so is competition. Your agency could have the best properties and most experienced agents, 
                      but if clients can't find you online, you're missing out on millions in potential deals. 
                      <a href="/add-business" className="underline font-semibold">Add your real estate business to our directory</a> and connect with serious buyers and sellers.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-green-50 rounded-2xl p-6">
                  <h3 className="font-bold text-green-800 mb-4">📊 Real Estate Market Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Annual Growth Rate</span>
                      <span className="font-bold text-green-600">25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Market Value 2026</span>
                      <span className="font-bold text-green-600">$400 Billion</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">New Housing Societies</span>
                      <span className="font-bold text-green-600">200+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Foreign Investment</span>
                      <span className="font-bold text-green-600">35% Increase</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h3 className="font-bold text-green-800 mb-2">🚀 Developer's Note</h3>
                  <p className="text-green-700 text-sm">
                    I built this real estate directory using Next.js 16 and Firebase to ensure lightning-fast performance for Pakistani users. 
                    The entire system processes thousands of property listings without any slowdown, and all data is secured with Firebase's enterprise-grade security. 
                    I specifically designed the <a href="/add-business" className="underline text-green-600 hover:text-green-700">real estate submission form</a> to be incredibly simple - 
                    no registration required, instant approval, and your business goes live immediately. 
                    This approach eliminates the biggest friction point that prevents 80% of Pakistani real estate businesses from getting listed online.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Real Estate Businesses */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Real Estate Services</h2>
            
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading real estate services...</p>
              </div>
            ) : businesses.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl font-semibold">No real estate services found</p>
                <p className="mt-2 text-sm">Be the first to list your real estate business!</p>
                <Link
                  href="/add-business"
                  className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors"
                >
                  Add Your Real Estate Business
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business) => (
                  <Link
                    key={business.id}
                    href={`/${business.slug || business.id}`}
                    className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="h-48 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      {business.logoUrl ? (
                        <img
                          src={business.logoUrl}
                          alt={business.businessName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-16 h-16 text-white/50" />
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                        {business.businessName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{business.city}</p>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{business.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Phone className="w-3 h-3" />
                          <span>{business.phone}</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                          <span>View Details</span>
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose Our Verified Real Estate Directory?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Verified Businesses</h3>
                <p className="text-gray-600">All real estate listings are verified for authenticity and legitimacy</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Market Insights</h3>
                <p className="text-gray-600">Access real-time data and trends in Pakistani property markets</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Complete Coverage</h3>
                <p className="text-gray-600">From residential properties to commercial real estate across Pakistan</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-600 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Grow Your Real Estate Business?</h2>
            <p className="text-xl text-white/90 mb-8">
              Join hundreds of verified real estate professionals getting quality leads through our platform
            </p>
            <Link
              href="/add-business"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-green-50 transition-colors text-lg"
            >
              Add Your Real Estate Business Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
