import { Metadata } from 'next'
import CitiesClient from './cities-client'
import { ORGANIC_SEED_KEYWORDS } from '@/lib/organic-keywords'

// Add metadata for SEO
export const metadata: Metadata = {
  title: 'Pakistan Cities Directory | Find Businesses by City',
  description:
    'Explore Pakistan cities and find local businesses by category, phone number, and location. City-wise business discovery for fast local search.',
  keywords: [
    'Pakistan cities business directory',
    'find businesses by city Pakistan',
    'city business directory Pakistan',
    ...ORGANIC_SEED_KEYWORDS.slice(8, 14),
  ],
  alternates: {
    canonical: 'https://pakbizbranhces.online/cities',
  },
}

export default function CitiesPage() {
  return <CitiesClient />
}
