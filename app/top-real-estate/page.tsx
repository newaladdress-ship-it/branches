import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'Top Real Estate Companies in Pakistan | Property Dealers & Agents',
  description: 'Find verified real estate companies, property dealers, and agents in Pakistan. Search by city for residential and commercial properties with contact details.',
  keywords: 'real estate Pakistan, property dealers Pakistan, real estate companies Pakistan, property agents Pakistan, Pakistani real estate, property services Pakistan',
  alternates: { canonical: 'https://pakbizbranhces.online/top-real-estate' },
}

export default function TopRealEstatePage() {
  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta']
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="bg-[#0f2b3d] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Top Real Estate Companies in Pakistan
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Connect with verified real estate companies, property dealers, and agents across Pakistan. Find residential and commercial property services with phone numbers and addresses.
            </p>
          </div>
        </section>

        <section className="py-16 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#0f2b3d] mb-8">Real Estate Services by City</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cities.map((city) => (
                <a
                  key={city}
                  href={`/locations/${city.toLowerCase().replace(/ /g, '-')}/real-estate`}
                  className="block bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#60a5fa]/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <h3 className="font-bold text-lg text-[#0f2b3d] mb-2">Real Estate in {city}</h3>
                  <p className="text-gray-600 text-sm">Property dealers & agents in {city}</p>
                  <div className="mt-4 text-[#60a5fa] font-medium text-sm flex items-center gap-1">
                    Find Properties →
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="font-bold text-xl text-[#0f2b3d] mb-4">Residential Properties</h3>
                <p className="text-gray-600">Houses, apartments, flats, and residential plots for sale and rent</p>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl text-[#0f2b3d] mb-4">Commercial Properties</h3>
                <p className="text-gray-600">Shops, offices, warehouses, and commercial spaces</p>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl text-[#0f2b3d] mb-4">Property Services</h3>
                <p className="text-gray-600">Legal documentation, property valuation, and investment advice</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-[#0f2b3d] mb-4">List Your Real Estate Business</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Get discovered by property buyers and sellers across Pakistan. Free listing with instant approval.
            </p>
            <a
              href="/add-business"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#60a5fa] text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Add Your Real Estate Business Free
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
