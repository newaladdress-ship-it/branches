'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Building2, MapPin, Phone, MessageCircle, ChevronDown } from 'lucide-react'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { CATEGORIES, CITIES } from '@/lib/data'
import * as Icons from '@/components/ui/icons'

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
  slug?: string
  createdAt: any
  status: string
  isFeatured?: boolean
}

const categoryIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  'restaurants': Icons.RestaurantIcon,
  'real-estate': Icons.RealEstateIcon,
  'technology': Icons.TechnologyIcon,
  'healthcare': Icons.HealthcareIcon,
  'education': Icons.EducationIcon,
  'retail': Icons.RetailIcon,
  'construction': Icons.ConstructionIcon,
  'automotive': Icons.AutomotiveIcon,
  'finance': Icons.FinanceIcon,
  'travel': Icons.TravelIcon,
  'beauty': Icons.BeautyIcon,
  'logistics': Icons.LogisticsIcon,
}

export default function FeaturedBusinessesClient() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')

  useEffect(() => {
    async function fetchFeaturedBusinesses() {
      try {
        const q = query(
          collection(db, 'businesses'),
          where('isFeatured', '==', true),
          orderBy('createdAt', 'desc')
        )
        const querySnapshot = await getDocs(q)
        
        const businessList: Business[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          const status = String((data.status ?? 'approved')).toLowerCase().trim()
          
          if (status === 'approved' || status === 'pending' || status === 'live') {
            businessList.push({
              id: doc.id,
              ...data
            } as Business)
          }
        })
        
        setBusinesses(businessList)
        setFilteredBusinesses(businessList)
      } catch (error) {
        console.error('Error fetching featured businesses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedBusinesses()
  }, [])

  useEffect(() => {
    let filtered = businesses

    if (selectedCategory) {
      filtered = filtered.filter(b => b.category === selectedCategory)
    }

    if (selectedCity) {
      filtered = filtered.filter(b => b.city === selectedCity)
    }

    setFilteredBusinesses(filtered)
  }, [selectedCategory, selectedCity, businesses])

  return (
    <>
      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-slate-700 mb-2">
            Filter by Category
          </label>
          <div className="relative">
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg appearance-none bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label htmlFor="city-filter" className="block text-sm font-medium text-slate-700 mb-2">
            Filter by City
          </label>
          <div className="relative">
            <select
              id="city-filter"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg appearance-none bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            >
              <option value="">All Cities</option>
              {[...new Set(CITIES)].map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-sm text-slate-600">
        Showing <span className="font-semibold text-slate-900">{filteredBusinesses.length}</span> featured {filteredBusinesses.length === 1 ? 'business' : 'businesses'}
      </div>

      {/* Businesses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-pulse">
              <div className="w-16 h-16 bg-slate-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-slate-200 rounded mb-2"></div>
              <div className="h-3 bg-slate-200 rounded mb-4"></div>
              <div className="h-3 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredBusinesses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Featured Businesses Found</h3>
          <p className="text-slate-600 mb-6">
            {selectedCategory || selectedCity 
              ? 'Try adjusting your filters to see more results.'
              : 'Be the first to feature your business!'}
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse All Businesses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBusinesses.map((business) => {
            const category = CATEGORIES.find(c => c.id === business.category)
            const IconComponent = category ? categoryIcons[category.id] : Building2
            const whatsappUrl = business.whatsapp ? `https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}` : null

            return (
              <div
                key={business.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border-2 border-amber-200 hover:shadow-xl hover:border-amber-400 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
              >
                {/* Header with Logo */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-4 flex items-center justify-center min-h-24">
                  {business.logoUrl ? (
                    <img
                      src={business.logoUrl}
                      alt={`${business.businessName} logo`}
                      className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div 
                      className="w-16 h-16 rounded-lg flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: category?.color || '#f59e0b' }}
                    >
                      <IconComponent className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* Business Info */}
                  <div className="mb-3">
                    <h3 className="font-bold text-slate-900 text-base mb-1.5 line-clamp-2 group-hover:text-amber-600 transition-colors">
                      {business.businessName}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mb-2">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span>{business.city}</span>
                    </div>
                    {category && (
                      <span 
                        className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.name}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-xs mb-4 line-clamp-2 leading-relaxed flex-1">
                    {business.description}
                  </p>

                  {/* Phone Display */}
                  <div className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 flex-shrink-0" />
                    <span className="font-medium">{business.phone}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-3">
                    <a
                      href={`tel:${business.phone}`}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700 transition-colors shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call
                    </a>
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Chat
                      </a>
                    )}
                  </div>

                  {/* View Details Link */}
                  <Link
                    href={business.slug ? `/${business.slug}` : `/business/${business.id}`}
                    className="block w-full text-center px-4 py-2.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors border border-amber-200 hover:border-amber-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
