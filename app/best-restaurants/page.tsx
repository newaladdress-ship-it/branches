import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'Best Restaurants in Pakistan | Top Food Places & Dining',
  description: 'Find the best restaurants in Pakistan by city. Discover top dining places, cafes, and food services with phone numbers, addresses, and reviews. List your restaurant free.',
  keywords: 'best restaurants Pakistan, top dining Pakistan, food places Pakistan, restaurant directory Pakistan, cafes Pakistan, Pakistani restaurants, dining guide Pakistan',
  alternates: { canonical: 'https://pakbizbranhces.online/best-restaurants' },
}

export default function BestRestaurantsPage() {
  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta']
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="bg-[#0f2b3d] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Best Restaurants in Pakistan
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Discover top-rated restaurants, cafes, and dining places across Pakistan. Find verified listings with phone numbers, addresses, and customer reviews.
            </p>
          </div>
        </section>

        <section className="py-16 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#0f2b3d] mb-8">Explore Restaurants by City</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cities.map((city) => (
                <a
                  key={city}
                  href={`/locations/${city.toLowerCase().replace(/ /g, '-')}/restaurants`}
                  className="block bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#60a5fa]/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <h3 className="font-bold text-lg text-[#0f2b3d] mb-2">Best Restaurants in {city}</h3>
                  <p className="text-gray-600 text-sm">Find top dining places in {city}</p>
                  <div className="mt-4 text-[#60a5fa] font-medium text-sm flex items-center gap-1">
                    Explore Restaurants →
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-[#0f2b3d] mb-4">List Your Restaurant Free</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of restaurants across Pakistan. Get discovered by customers looking for dining options in your area.
            </p>
            <a
              href="/add-business"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#60a5fa] text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Add Your Restaurant Free
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
