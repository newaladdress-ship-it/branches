import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, Mail, MapPin, MessageCircle, Building2, Globe, Facebook, Youtube, ExternalLink } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { CATEGORIES } from '@/lib/data'
import { LIVE_STATUSES } from '@/lib/category-mappings'

interface Business {
  id: string
  businessName: string
  contactPerson?: string
  email?: string
  phone: string
  whatsapp?: string
  city: string
  address: string
  category: string
  subCategory?: string
  description: string
  logoUrl?: string
  websiteUrl?: string
  facebookPage?: string
  googleBusiness?: string
  youtubeChannel?: string
  createdAt: any
  status: string
  slug: string
}

async function getBusinessBySlug(slug: string): Promise<Business | null> {
  try {
    const q = query(
      collection(db, 'businesses'),
      where('slug', '==', slug),
      limit(1)
    )
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null
    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() } as Business
  } catch {
    return null
  }
}

async function getSimilarBusinesses(city: string, category: string, excludeSlug: string): Promise<Business[]> {
  try {
    const q = query(
      collection(db, 'businesses'),
      where('city', '==', city),
      where('category', '==', category),
      limit(5)
    )
    const snap = await getDocs(q)
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() } as Business))
      .filter(b => {
        const status = String((b as any).status ?? '').toLowerCase()
        return (!status || LIVE_STATUSES.has(status)) && b.slug !== excludeSlug
      })
      .slice(0, 4)
  } catch {
    return []
  }
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const business = await getBusinessBySlug(params.slug)

  if (!business) {
    return {
      title: 'Business Not Found | PakBizBranches',
      description: 'The business you are looking for could not be found.',
    }
  }

  const category = CATEGORIES.find(c => c.id === business.category)
  const title = `${business.businessName} – ${business.city}`
  const description = `${business.businessName} is a ${category?.name ?? business.category} business in ${business.city}, Pakistan. Contact: ${business.phone}`
  const url = `https://pakbizbranhces.online/${params.slug}`

  return {
    title,
    description,
    keywords: `${business.businessName}, ${business.city}, ${category?.name ?? business.category}, ${business.businessName} ${business.city}, ${business.city} Pakistan, business directory Pakistan`,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'PakBizBranches',
      locale: 'en_PK',
      type: 'website',
      images: business.logoUrl
        ? [{ url: business.logoUrl, alt: `${business.businessName} logo` }]
        : [{ url: 'https://pakbizbranhces.online/bizbranches.pk.png', alt: 'PakBizBranches' }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function BusinessPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const business = await getBusinessBySlug(params.slug)

  if (!business) {
    notFound()
  }

  const category = CATEGORIES.find(c => c.id === business.category)
  const whatsappUrl = business.whatsapp
    ? `https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`
    : null
  const mapQuery = encodeURIComponent(`${business.address}, ${business.city}, Pakistan`)
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&output=embed`
  const similarBusinesses = await getSimilarBusinesses(business.city, business.category, params.slug)

  const pageUrl = `https://pakbizbranhces.online/${params.slug}`
  const categoryUrl = `/categories/${business.category}`
  const cityUrl = `/cities/${encodeURIComponent(business.city.toLowerCase().replace(/ /g, '-'))}`

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': pageUrl,
    name: business.businessName,
    description: business.description,
    url: pageUrl,
    telephone: business.phone,
    ...(business.email && { email: business.email }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.city,
      addressCountry: 'PK',
    },
    ...(category && {
      '@type': ['LocalBusiness', 'Organization'],
    }),
    ...(business.logoUrl && {
      image: business.logoUrl,
    }),
    ...(business.websiteUrl && { sameAs: [business.websiteUrl] }),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pakbizbranhces.online' },
      { '@type': 'ListItem', position: 2, name: category?.name ?? business.category, item: `https://pakbizbranhces.online${categoryUrl}` },
      { '@type': 'ListItem', position: 3, name: business.businessName, item: pageUrl },
    ],
  }

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="bg-[#f8fafc] min-h-screen">
        {/* Header */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-[#60a5fa] transition-colors">Home</Link>
              <span>/</span>
              {category && (
                <>
                  <Link href={categoryUrl} className="hover:text-[#60a5fa] transition-colors">
                    {category.name}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-gray-800 font-medium truncate">{business.businessName}</span>
            </nav>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Logo */}
              <div className="shrink-0">
                {business.logoUrl ? (
                  <img
                    src={business.logoUrl}
                    alt={`${business.businessName} logo`}
                    className="w-32 h-32 rounded-2xl object-cover border border-gray-200 shadow-sm"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] flex items-center justify-center border border-gray-200">
                    <Building2 className="w-16 h-16 text-white/60" />
                  </div>
                )}
              </div>

              {/* Business Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0f2b3d] mb-2">
                  {business.businessName}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-gray-500 mb-4">
                  {category && (
                    <Link
                      href={categoryUrl}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-[#60a5fa] rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      {category.name}
                    </Link>
                  )}
                  <Link
                    href={cityUrl}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {business.city}
                  </Link>
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
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-[#0f2b3d] mb-4">
                    About {business.businessName}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {business.description}
                  </p>
                </div>

                {/* Google Maps Embed */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="p-6 pb-0">
                    <h2 className="text-xl font-bold text-[#0f2b3d] mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#60a5fa]" />
                      Location
                    </h2>
                  </div>
                  <div className="mt-4">
                    <iframe
                      src={mapSrc}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map of ${business.businessName}`}
                      className="w-full"
                    />
                  </div>
                  <div className="p-4 text-sm text-gray-500">
                    {business.address}, {business.city}, Pakistan
                  </div>
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
                        <p className="text-sm text-gray-500">{business.city}, Pakistan</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-[#0f2b3d] mb-4">Business Details</h3>
                  <div className="space-y-3">
                    {category && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Category</span>
                        <Link href={categoryUrl} className="text-sm font-medium text-[#60a5fa] hover:underline">
                          {category.name}
                        </Link>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">City</span>
                      <Link href={cityUrl} className="text-sm font-medium text-[#60a5fa] hover:underline">
                        {business.city}
                      </Link>
                    </div>
                    {business.subCategory && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Sub-category</span>
                        <span className="text-sm font-medium text-gray-900">{business.subCategory}</span>
                      </div>
                    )}
                    {business.contactPerson && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Contact Person</span>
                        <span className="text-sm font-medium text-gray-900">{business.contactPerson}</span>
                      </div>
                    )}
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
                          <Globe className="w-5 h-5 text-[#60a5fa]" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-1 truncate">Website</span>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                      )}
                      {business.facebookPage && (
                        <a
                          href={business.facebookPage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <Facebook className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-1">Facebook</span>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                      )}
                      {business.youtubeChannel && (
                        <a
                          href={business.youtubeChannel}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <Youtube className="w-5 h-5 text-red-600" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-1">YouTube</span>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                      )}
                      {business.googleBusiness && (
                        <a
                          href={business.googleBusiness}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <MapPin className="w-5 h-5 text-red-500" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-1">Google Business</span>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Similar Businesses */}
            {similarBusinesses.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">
                  Similar Businesses in {business.city}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {similarBusinesses.map(biz => (
                    <Link
                      key={biz.id}
                      href={`/${biz.slug}`}
                      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#60a5fa]/30 transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {biz.logoUrl ? (
                          <img
                            src={biz.logoUrl}
                            alt={biz.businessName}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-white/60" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 group-hover:text-[#60a5fa] transition-colors text-sm leading-tight truncate">
                            {biz.businessName}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {biz.city}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {biz.description}
                      </p>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link
                    href={`/locations/${business.city.toLowerCase().replace(/ /g, '-')}/${business.category}`}
                    className="inline-flex items-center gap-2 text-[#60a5fa] hover:text-blue-600 font-medium text-sm transition-colors"
                  >
                    View all {category?.name} businesses in {business.city}
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Link>
                </div>
              </div>
            )}

            {/* Internal Links */}
            <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#0f2b3d] mb-4">Explore More</h2>
              <div className="flex flex-wrap gap-3">
                <Link href={categoryUrl} className="px-4 py-2 bg-blue-50 text-[#60a5fa] rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                  More {category?.name} Businesses
                </Link>
                <Link href={cityUrl} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  All Businesses in {business.city}
                </Link>
                <Link href="/add-business" className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                  List Your Business Free
                </Link>
                <Link href="/categories" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Browse All Categories
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
