'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, Mail, MapPin, MessageCircle, Building2, Globe, Facebook, Youtube } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { CATEGORIES } from '@/lib/data'

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
  websiteUrl?: string
  facebookPage?: string
  googleBusiness?: string
  youtubeChannel?: string
  createdAt: any
  status: string
}

export default function BusinessPage() {
  const params = useParams()
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchBusiness() {
      if (!params.slug) return
      
      try {
        const q = query(
          collection(db, 'businesses'),
          where('slug', '==', params.slug as string)
        )
        const querySnapshot = await getDocs(q)
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]
          setBusiness({
            id: doc.id,
            ...doc.data()
          } as Business)
        } else {
          setError('Business not found')
        }
      } catch (err) {
        console.error('Error fetching business:', err)
        setError('Failed to load business details')
      } finally {
        setLoading(false)
      }
    }
    
    fetchBusiness()
  }, [params.slug])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#60a5fa] mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading business details...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !business) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
          <div className="text-center">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Not Found</h1>
            <p className="text-gray-500 mb-6">{error || 'The business you are looking for does not exist.'}</p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#60a5fa] text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const category = CATEGORIES.find(c => c.id === business.category)
  const whatsappUrl = business.whatsapp ? `https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}` : null

  return (
    <>
      <Navbar />
      <main className="bg-[#f8fafc] min-h-screen">
        {/* Header */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-[#60a5fa] hover:text-blue-600 font-medium mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </Link>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Logo */}
              <div className="shrink-0">
                {business.logoUrl ? (
                  <img
                    src={business.logoUrl}
                    alt={`${business.businessName} logo`}
                    className="w-32 h-32 rounded-2xl object-cover border border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200">
                    <Building2 className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Business Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0f2b3d] mb-2">
                  {business.businessName}
                </h1>
                <div className="flex items-center gap-4 text-gray-500 mb-4">
                  {category && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                      <span style={{ color: category.color }}>{category.icon}</span>
                      {category.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {business.city}
                  </span>
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {business.description}
                </p>
                
                {/* Contact Actions */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`tel:${business.phone}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f2b3d] text-white rounded-xl font-semibold hover:bg-[#1a3f57] transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </a>
                  
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  )}
                  
                  {business.email && (
                    <a
                      href={`mailto:${business.email}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">About {business.businessName}</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {business.description}
                  </p>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-[#0f2b3d] mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-[#60a5fa] mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">{business.phone}</p>
                        <p className="text-sm text-gray-500">Phone</p>
                      </div>
                    </div>
                    
                    {business.whatsapp && (
                      <div className="flex items-start gap-3">
                        <MessageCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">{business.whatsapp}</p>
                          <p className="text-sm text-gray-500">WhatsApp</p>
                        </div>
                      </div>
                    )}
                    
                    {business.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-[#60a5fa] mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">{business.email}</p>
                          <p className="text-sm text-gray-500">Email</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#60a5fa] mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">{business.address}</p>
                        <p className="text-sm text-gray-500">{business.city}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Digital Presence */}
                {(business.websiteUrl || business.facebookPage || business.googleBusiness || business.youtubeChannel) && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-[#0f2b3d] mb-4">Digital Presence</h3>
                    <div className="space-y-3">
                      {business.websiteUrl && (
                        <a
                          href={business.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <Globe className="w-5 h-5 text-[#60a5fa] group-hover:text-blue-600" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">Website</span>
                        </a>
                      )}
                      {business.facebookPage && (
                        <a
                          href={business.facebookPage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <Facebook className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">Facebook</span>
                        </a>
                      )}
                      {business.youtubeChannel && (
                        <a
                          href={business.youtubeChannel}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <Youtube className="w-5 h-5 text-red-600 group-hover:text-red-700" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">YouTube</span>
                        </a>
                      )}
                      {business.googleBusiness && (
                        <a
                          href={business.googleBusiness}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <MapPin className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">Google Business</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
