import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Building2, ArrowRight, ChevronRight, MapPin } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { CITIES, CATEGORIES } from '@/lib/data'

const BASE_URL = 'https://pakbizbranhces.online'

interface Business {
  id: string
  businessName: string
  slug?: string
  city: string
  description?: string
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ categorySlug: cat.id }))
}

export async function generateMetadata(props: { params: Promise<{ categorySlug: string }> }): Promise<Metadata> {
  const { categorySlug } = await props.params
  const category = CATEGORIES.find((c) => c.id === categorySlug)
  if (!category) return { title: 'Category Not Found | PakBizBranches' }

  const title = `${category.name} in Pakistan | Business Listings`
  const description = `Explore verified ${category.name.toLowerCase()} businesses in Pakistan by city. Call directly or list your business for free.`
  const url = `${BASE_URL}/categories/${categorySlug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' },
  }
}

export default async function CategoryPage(props: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await props.params
  const category = CATEGORIES.find((c) => c.id === categorySlug)
  if (!category) notFound()

  let businesses: Business[] = []
  try {
    const q = query(collection(db, 'businesses'), where('category', '==', categorySlug), limit(36))
    const snap = await getDocs(q)
    businesses = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Business))
  } catch {}

  return (
    <>
      <Navbar />
      <main className="bg-[#f8fafc] min-h-screen">
        <section className="bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/70 mb-5">
              <Link href="/">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/categories">Categories</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{category.name}</span>
            </nav>
            <h1 className="text-4xl font-bold text-white mb-3">{category.name} Businesses in Pakistan</h1>
            <p className="text-white/85 max-w-2xl">
              Browse local listings and discover trusted providers by city and category.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#0f2b3d] mb-4">{category.name} by City</h2>
            <div className="flex flex-wrap gap-2">
              {CITIES.slice(0, 20).map((city) => (
                <Link
                  key={city}
                  href={`/locations/${city.toLowerCase().replace(/ /g, '-')}/${categorySlug}`}
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:border-[#60a5fa]"
                >
                  <MapPin className="w-3 h-3" />
                  {city}
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0f2b3d] mb-5">Top {category.name} Listings</h2>
            {businesses.length === 0 ? (
              <div className="bg-white rounded-xl p-8 border text-center">
                <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No listings yet in this category.</p>
                <Link href="/add-business" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#60a5fa] text-white rounded-lg">
                  List Your Business for Free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {businesses.map((biz) => (
                  <Link key={biz.id} href={biz.slug ? `/${biz.slug}` : `/business/${biz.id}`} className="bg-white rounded-xl p-4 border hover:border-[#60a5fa]/40">
                    <h3 className="font-semibold text-gray-900">{biz.businessName}</h3>
                    <p className="text-sm text-gray-500 mt-1">{biz.city}</p>
                    {biz.description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{biz.description}</p>}
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
