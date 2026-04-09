import Link from 'next/link'
import { CATEGORIES } from '@/lib/data'
import * as Icons from '@/components/ui/icons'

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

export default function CategoriesGrid() {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50" aria-labelledby="categories-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-3">
            DISCOVER
          </span>
          <h2 id="categories-heading" className="text-3xl md:text-4xl font-bold text-slate-900 text-balance">
            Browse by Category
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Explore verified businesses across Pakistan
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => {
            const IconComponent = categoryIcons[cat.id]
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="group bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white mb-4 transition-transform duration-200 group-hover:scale-125 shadow-md"
                  style={{ backgroundColor: cat.color }}
                  aria-hidden="true"
                >
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1.5">{cat.count?.toLocaleString() || '0'} listings</p>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            View All Categories
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
