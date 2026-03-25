import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'Healthcare Services in Pakistan | Hospitals, Clinics & Doctors',
  description: 'Find verified healthcare services in Pakistan. Search hospitals, clinics, doctors, pharmacies, and medical services by city with phone numbers and addresses.',
  keywords: 'healthcare Pakistan, hospitals Pakistan, clinics Pakistan, doctors Pakistan, medical services Pakistan, pharmacies Pakistan, Pakistani healthcare',
  alternates: { canonical: 'https://pakbizbranhces.online/healthcare-services' },
}

export default function HealthcareServicesPage() {
  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta']
  const services = ['Hospitals', 'Clinics', 'Doctors', 'Pharmacies', 'Diagnostics', 'Medical Labs']
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="bg-[#0f2b3d] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Healthcare Services in Pakistan
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Find verified hospitals, clinics, doctors, pharmacies, and medical services across Pakistan. Get contact details, addresses, and service information.
            </p>
          </div>
        </section>

        <section className="py-16 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#0f2b3d] mb-8">Medical Services by City</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cities.map((city) => (
                <a
                  key={city}
                  href={`/locations/${city.toLowerCase().replace(/ /g, '-')}/healthcare`}
                  className="block bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#60a5fa]/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <h3 className="font-bold text-lg text-[#0f2b3d] mb-2">Healthcare in {city}</h3>
                  <p className="text-gray-600 text-sm">Hospitals, clinics & doctors in {city}</p>
                  <div className="mt-4 text-[#60a5fa] font-medium text-sm flex items-center gap-1">
                    Find Medical Services →
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#0f2b3d] mb-8 text-center">Browse Healthcare Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <a
                  key={service}
                  href={`/categories/${service.toLowerCase().replace(/ /g, '-')}`}
                  className="block bg-[#f8fafc] rounded-xl p-6 border border-gray-200 hover:border-[#60a5fa]/20 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="font-bold text-lg text-[#0f2b3d] mb-2">{service}</h3>
                  <p className="text-gray-600 text-sm">Find {service.toLowerCase()} across Pakistan</p>
                  <div className="mt-4 text-[#60a5fa] font-medium text-sm">
                    Browse {service} →
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-[#0f2b3d] mb-4">List Your Healthcare Service</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with patients seeking medical care across Pakistan. Free listing for hospitals, clinics, doctors, and medical services.
            </p>
            <a
              href="/add-business"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#60a5fa] text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Add Your Healthcare Service Free
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
