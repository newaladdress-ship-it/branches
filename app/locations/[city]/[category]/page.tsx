import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { collection, getDocs, limit, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { CATEGORIES, CITIES } from '@/lib/data'
import { MapPin, Building2 } from 'lucide-react'

const BASE_URL = 'https://pakbizbranhces.online'

interface Business {
  id: string
  businessName: string
  city: string
  slug?: string
  description?: string
}

function cityFromSlug(slug: string): string | null {
  const normalized = slug.replace(/-/g, ' ').toLowerCase()
  return CITIES.find((c) => c.toLowerCase() === normalized) ?? null
}

export async function generateMetadata(props: { params: Promise<{ city: string; category: string }> }): Promise<Metadata> {
  const { city, category } = await props.params
  const cityName = cityFromSlug(city)
  const categoryData = CATEGORIES.find((c) => c.id === category)
  if (!cityName || !categoryData) return { title: 'Page Not Found | PakBizBranches' }

  const title = `${categoryData.name} in ${cityName} | Pakistan Directory`
  const description = `Discover ${categoryData.name.toLowerCase()} businesses in ${cityName}, Pakistan. Compare listings and contact businesses directly.`
  const url = `${BASE_URL}/locations/${city}/${category}`
  return { title, description, alternates: { canonical: url } }
}

export default async function LocationsPage(props: { params: Promise<{ city: string; category: string }> }) {
  const { city, category } = await props.params
  const cityName = cityFromSlug(city)
  const categoryData = CATEGORIES.find((c) => c.id === category)
  if (!cityName || !categoryData) notFound()

  let businesses: Business[] = []
  try {
    const q = query(collection(db, 'businesses'), where('city', '==', cityName), where('category', '==', category), limit(40))
    const snap = await getDocs(q)
    businesses = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Business))
  } catch {}

  return (
    <>
      <Navbar />
      <main className="bg-[#f8fafc] min-h-screen">
        <section className="bg-[#0f2b3d] py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl text-white font-bold">{categoryData.name} in {cityName}</h1>
            <p className="text-white/80 mt-3 max-w-2xl">Browse local listings and contact verified businesses in this city.</p>
          </div>
        </section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {businesses.length === 0 ? (
            <div className="bg-white rounded-xl border p-8 text-center">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No listings in this city-category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {businesses.map((biz) => (
                <Link key={biz.id} href={biz.slug ? `/${biz.slug}` : `/business/${biz.id}`} className="bg-white border rounded-xl p-4 hover:border-[#60a5fa]/40">
                  <h2 className="font-semibold text-gray-900">{biz.businessName}</h2>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{biz.city}</p>
                  {biz.description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{biz.description}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
