'use client'

import { Building2, MapPin, BarChart3, Users } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { value: '50,000+', label: 'Active Businesses', icon: Building2, description: 'Verified local listings' },
  { value: '150+', label: 'Cities Covered', icon: MapPin, description: 'Across Pakistan' },
  { value: '12', label: 'Categories', icon: BarChart3, description: 'Major business types' },
  { value: '100K+', label: 'Active Users', icon: Users, description: 'Monthly visitors' },
]

export default function StatsSection() {
  return (
    <section className="bg-gradient-to-br from-white via-slate-50 to-blue-50 py-12" aria-label="Directory statistics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mx-auto mb-4 group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
                  <Icon className="w-7 h-7 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-slate-700 mb-1">{stat.label}</div>
                <div className="text-xs text-slate-500">{stat.description}</div>
              </div>
            )
          })}
        </div>

        <div className="mt-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center shadow-lg border border-blue-500">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Join Pakistan's Premier Business Directory
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
            Whether you're looking for local businesses or want to list your own, PakBizBranches is your gateway to success.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/add-business"
              className="px-6 sm:px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm sm:text-base"
            >
              List Your Business Free
            </Link>
            <Link
              href="/categories"
              className="px-6 sm:px-8 py-3 bg-blue-800 text-white font-semibold rounded-xl hover:bg-blue-900 transition-colors border border-blue-500 text-sm sm:text-base"
            >
              Browse Businesses
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
