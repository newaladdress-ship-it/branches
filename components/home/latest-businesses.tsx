'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Building2, MapPin, Phone, MessageCircle } from 'lucide-react'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { CATEGORIES } from '@/lib/data'
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

export default function LatestBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLatestBusinesses() {
      try {
        const q = query(
          collection(db, 'businesses'),
          orderBy('createdAt', 'desc'),
          limit(8)
        )
        const querySnapshot = await getDocs(q)
        const businessList: Business[] = []
        
        querySnapshot.forEach((doc) => {
          businessList.push({
            id: doc.id,
            ...doc.data()
          } as Business)
        })
        
        setBusinesses(businessList)
      } catch (error) {
        console.error('Error fetching latest businesses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestBusinesses()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Latest Businesses</h2>
            <p className="mt-3 text-slate-600 text-lg">Discover newly added businesses in your area</p>
          </div>
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
        </div>
      </section>
    )
  }

  if (businesses.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50" aria-labelledby="latest-businesses-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="latest-businesses-heading" className="text-3xl md:text-4xl font-bold text-slate-800 text-balance">
            Latest Businesses
          </h2>
          <p className="mt-3 text-slate-600 text-lg">
            Discover newly added businesses in your area
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {businesses.map((business) => {
            const category = CATEGORIES.find(c => c.id === business.category)
            const IconComponent = category ? categoryIcons[category.id] : Building2
            const whatsappUrl = business.whatsapp ? `https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}` : null

            return (
              <div
                key={business.id}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Logo/Icon */}
                <div className="flex items-center justify-center mb-4">
                  {business.logoUrl ? (
                    <img
                      src={business.logoUrl}
                      alt={`${business.businessName} logo`}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                    />
                  ) : (
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: category?.color || '#64748b' }}
                    >
                      <IconComponent className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Business Info */}
                <div className="text-center mb-4">
                  <h3 className="font-bold text-slate-800 text-lg mb-1 line-clamp-1">
                    {business.businessName}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-slate-500 text-sm mb-2">
                    <MapPin className="w-3 h-3" />
                    {business.city}
                  </div>
                  {category && (
                    <span 
                      className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {business.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-4">
                  <a
                    href={`tel:${business.phone}`}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    Call
                  </a>
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      WhatsApp
                    </a>
                  )}
                </div>

                {/* View Details Link */}
                <Link
                  href={business.slug ? `/${business.slug}` : `/business/${business.id}`}
                  className="block w-full text-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  View Details
                </Link>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-8 py-3 bg-slate-800 text-white rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors duration-200"
          >
            View All Businesses
          </Link>
        </div>
      </div>
    </section>
  )
}