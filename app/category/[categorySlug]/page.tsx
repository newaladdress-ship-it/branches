import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Building2, Phone, ArrowRight, ChevronRight, MapPin } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { CITIES, CATEGORIES } from '@/lib/data'
import { generateCategoryContent } from '@/lib/seo-content'
import { getPossibleCategoryValues, LIVE_STATUSES } from '@/lib/category-mappings'

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

export async function generateStaticParams() {
  return CATEGORIES.map(cat => ({ categorySlug: cat.id }))
}

export async function generateMetadata(props: { params: Promise<{ categorySlug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const category = CATEGORIES.find(c => c.id === params.categorySlug)
  if (!category) return { title: 'Category Not Found | PakBizBranches' }

  const title = `Top ${category.name} in Pakistan | PakBizBranches`
  const description = `Find trusted ${category.name.toLowerCase()} businesses in Pakistan with contacts, locations, and real listings.`
  const url = `${BASE_URL}/categories/${params.categorySlug}`

  return {
    title,
    description,
    keywords: `${category.name} Pakistan, ${category.name.toLowerCase()} Pakistan, Pakistan ${category.name.toLowerCase()}, ${category.name} directory, ${category.name} businesses Pakistan`,
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
    const categoryValues = getPossibleCategoryValues(params.categorySlug).slice(0, 10)
    const queryVariants = [
      query(collection(db, 'businesses'), where('categoryId', '==', params.categorySlug), limit(60)),
      query(collection(db, 'businesses'), where('categorySlug', '==', params.categorySlug), limit(60)),
      query(collection(db, 'businesses'), where('category', 'in', categoryValues), limit(60)),
    ]
    const snapshots = await Promise.all(queryVariants.map(q => getDocs(q)))
    const merged = new Map<string, Business>()
    snapshots.forEach((snap) => {
      snap.docs.forEach((doc) => {
        const business = { id: doc.id, ...doc.data() } as Business
        const status = String((business as any).status ?? '').toLowerCase()
        if (!status || LIVE_STATUSES.has(status)) {
          merged.set(doc.id, business)
        }
      })
    })
    businesses = Array.from(merged.values()).slice(0, 40)
  } catch {}

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
              <span className="bg-white/10 px-3 py-1 rounded-full">{businesses.length}+ Listings</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">150+ Cities</span>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filter by City */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">{category.name} by City</h2>
            <div className="flex flex-wrap gap-3">
              {CITIES.map(city => (
                <Link
                  key={city}
                  href={`/locations/${city.toLowerCase().replace(/ /g, '-')}/${params.categorySlug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#60a5fa] hover:text-[#60a5fa] transition-colors shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {city}
                </Link>
              ))}
            </div>
          </section>

          {/* Business Listings */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">
              All {category.name} Businesses
              <span className="text-base font-normal text-gray-500 ml-3">({businesses.length} listings)</span>
            </h2>

            {businesses.length === 0 ? (
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
                {businesses.map(biz => (
                  <Link
                    key={biz.id}
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
                ))}
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
        </div>
      </main>
      <Footer />
    </>
  )
}
