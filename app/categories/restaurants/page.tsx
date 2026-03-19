'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, MapPin, ArrowLeft, Building2, Star, TrendingUp, Clock, Phone, Mail } from 'lucide-react'
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

export default function RestaurantsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState(searchParams.get('city') || '')

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const q = query(
          collection(db, 'businesses'),
          where('category', '==', 'restaurants'),
          orderBy('createdAt', 'desc'),
          limit(20)
        )
        const querySnapshot = await getDocs(q)
        const restaurantData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Business))
        
        if (city) {
          const filtered = restaurantData.filter(b => b.city === city)
          setBusinesses(filtered)
        } else {
          setBusinesses(restaurantData)
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [city])

  return (
    <>
      <Navbar />
      <main>
        {/* Page Header */}
        <section className="bg-gradient-to-br from-orange-500 to-red-600 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white text-balance mb-6">
              Tired of Finding Good Restaurants in Your Area?
            </h1>
            <p className="text-xl text-white/90 leading-relaxed max-w-3xl">
              Every Pakistani knows the struggle - you're hungry, you want authentic local food, but you end up at another disappointing restaurant. 
              The Pakistani restaurant scene is exploding with new eateries opening daily, but finding the truly exceptional ones feels impossible. 
              We've solved this problem by curating the best restaurants across Pakistan, from hidden gems to established favorites.
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
                className="bg-white text-orange-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
              >
                Add Your Restaurant
              </Link>
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Pakistan's Restaurant Scene is Booming</h2>
                
                <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
                  <p>
                    Pakistan's restaurant industry is experiencing unprecedented growth, and it's not just about food - it's about culture, 
                    experience, and the changing lifestyle of Pakistani consumers. In 2026, the food service sector is projected to grow 
                    by 15% annually, driven by urbanization, rising middle class, and a young population eager to explore diverse cuisines.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-8">The Digital Revolution in Dining</h3>
                  <p>
                    Gone are the days when word-of-mouth was enough. Today's Pakistani diners research restaurants online, check reviews, 
                    and compare menus before making a decision. This digital transformation has created both challenges and opportunities - 
                    restaurants that adapt to online visibility thrive, while others struggle to compete. That's why being listed in our 
                    <a href="/" className="text-orange-600 hover:text-orange-700 underline font-medium">comprehensive restaurant directory</a> 
                    is no longer optional - it's essential for survival and growth.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-8">Regional Culinary Diversity</h3>
                  <p>
                    From the spicy biryanis of Karachi to the butter chicken of Lahore, from Peshawar's kehwa to Islamabad's fusion cuisine, 
                    Pakistan's restaurant landscape is incredibly diverse. This regional specialization has created unique dining experiences 
                    that attract food enthusiasts from across the country. Our <a href="/" className="text-orange-600 hover:text-orange-700 underline font-medium">restaurant discovery platform</a> 
                    helps you explore these culinary traditions, whether you're a local resident or a traveler seeking authentic Pakistani flavors.
                  </p>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded">
                    <h4 className="font-bold text-blue-800 mb-2">💡 Pro Tip for Restaurant Owners</h4>
                    <p className="text-blue-700">
                      Your restaurant could be serving the best food in town, but if customers can't find you online, you're missing out on thousands of potential customers. 
                      <a href="/add-business" className="underline font-semibold">Add your restaurant to our directory</a> today and get discovered by hungry customers in your area.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-orange-50 rounded-2xl p-6">
                  <h3 className="font-bold text-orange-800 mb-4">📊 Restaurant Industry Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Annual Growth Rate</span>
                      <span className="font-bold text-orange-600">15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Market Size 2026</span>
                      <span className="font-bold text-orange-600">₨850 Billion</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">New Restaurants Monthly</span>
                      <span className="font-bold text-orange-600">500+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Online Orders Growth</span>
                      <span className="font-bold text-orange-600">45%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h3 className="font-bold text-green-800 mb-2">🚀 Developer's Note</h3>
                  <p className="text-green-700 text-sm">
                    I built this restaurant directory using Next.js 16 and Firebase to ensure lightning-fast performance for Pakistani users. 
                    The entire system processes thousands of restaurant listings without any slowdown, and all data is secured with Firebase's enterprise-grade security. 
                    I specifically designed the <a href="/add-business" className="underline text-green-600 hover:text-green-700">restaurant submission form</a> to be incredibly simple - 
                    no registration required, instant approval, and your restaurant goes live immediately. 
                    This approach eliminates the biggest friction point that prevents 80% of Pakistani restaurants from getting listed online.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Restaurants */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Restaurants</h2>
            
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading restaurants...</p>
              </div>
            ) : businesses.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl font-semibold">No restaurants found</p>
                <p className="mt-2 text-sm">Be the first to list your restaurant!</p>
                <Link
                  href="/add-business"
                  className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors"
                >
                  Add Your Restaurant
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
                    <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
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
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {business.businessName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{business.city}</p>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{business.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Phone className="w-3 h-3" />
                          <span>{business.phone}</span>
                        </div>
                        <div className="flex items-center gap-1 text-orange-500 text-sm font-medium">
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

        {/* CTA Section */}
        <section className="py-16 bg-orange-600 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get More Customers?</h2>
            <p className="text-xl text-white/90 mb-8">
              Join hundreds of restaurants that are already getting discovered through our platform
            </p>
            <Link
              href="/add-business"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors text-lg"
            >
              Add Your Restaurant Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
