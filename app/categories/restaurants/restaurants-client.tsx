'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, MapPin, ArrowLeft, Utensils, Clock, Phone, Star, Coffee } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CitySearchDropdown from '@/components/ui/city-search-dropdown'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'

interface Business {
  id: string
  businessName: string
  contactPerson: string
  email: string
  phone: string
  whatsapp?: string
  city: string
  address: string
  category: string
  description: string
  logoUrl?: string
  createdAt: any
  status: string
}

function RestaurantsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    async function fetchBusinesses() {
      setLoading(true)
      try {
        const q = query(
          collection(db, 'businesses'),
          where('category', '==', 'restaurants'),
          where('status', '==', 'approved'),
          orderBy('createdAt', 'desc'),
          limit(50)
        )
        const querySnapshot = await getDocs(q)
        const businessesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Business))
        setBusinesses(businessesData)
      } catch (error) {
        console.error('Error fetching businesses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBusinesses()
  }, [])

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCity = !selectedCity || business.city.toLowerCase() === selectedCity.toLowerCase()
    return matchesSearch && matchesCity
  })

  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.createdAt?.toMillis() - a.createdAt?.toMillis()
      case 'oldest':
        return a.createdAt?.toMillis() - b.createdAt?.toMillis()
      case 'name':
        return a.businessName.localeCompare(b.businessName)
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading restaurants...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Utensils className="w-10 h-10 text-orange-600" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Restaurants in Pakistan
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the best restaurants, cafes, and dining experiences across Pakistan
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <CitySearchDropdown
                value={selectedCity}
                onChange={setSelectedCity}
                placeholder="Select city..."
                className="w-full"
              />
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">By Name</option>
              </select>
            </div>
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-gray-600">
              Found <span className="font-semibold text-orange-600">{sortedBusinesses.length}</span> restaurants
            </p>
          </div>

          {sortedBusinesses.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBusinesses.map((business) => (
                <div key={business.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      {business.logoUrl ? (
                        <img
                          src={business.logoUrl}
                          alt={business.businessName}
                          className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-orange-100 flex items-center justify-center border border-gray-200">
                          <Utensils className="w-8 h-8 text-orange-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {business.businessName}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {business.city}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {business.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                      <Clock className="w-3 h-3" />
                      Listed {business.createdAt?.toDate().toLocaleDateString()}
                    </div>
                    
                    <div className="flex gap-2">
                      <a
                        href={`tel:${business.phone}`}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        Call
                      </a>
                      <Link
                        href={`/business/${business.id}`}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function RestaurantsClient() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    }>
      <RestaurantsContent />
    </Suspense>
  )
}
