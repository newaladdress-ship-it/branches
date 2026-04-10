import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

const perks = [
  'Free to list – no credit card required',
  'Reach thousands of local customers',
  'Manage your business profile easily',
  'Get found on Google and other search engines',
]

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57]" aria-labelledby="cta-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          id="cta-heading"
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-balance"
        >
          Ready to Grow Your Business?
        </h2>
        <p className="mt-4 text-white/80 text-base sm:text-lg max-w-2xl mx-auto text-pretty">
          Join 50,000+ businesses already growing with PakBizBranches. List your business free and reach thousands of local customers.
        </p>

        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {perks.map((perk) => (
            <li key={perk} className="flex items-center gap-2 text-white/80 text-sm">
              <CheckCircle className="w-5 h-5 text-[#60a5fa] shrink-0" aria-hidden="true" />
              {perk}
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/add-business"
            className="px-8 py-4 bg-[#60a5fa] hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-200 text-base shadow-lg hover:shadow-2xl hover:-translate-y-0.5"
          >
            List Your Business Free
          </Link>
          <Link
            href="/categories"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors duration-200 text-base border border-white/30 hover:border-white/50"
          >
            Browse Businesses
          </Link>
        </div>
      </div>
    </section>
  )
}
