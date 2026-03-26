import { Metadata } from 'next'
import RealEstateClient from './real-estate-client'

// Add metadata for SEO
export const metadata: Metadata = {
  title: 'Real Estate Pakistan – Property & Housing Directory',
  description: 'Find real estate agents, property dealers, and housing services in Pakistan. Browse residential, commercial, and rental properties. Free property directory.',
  keywords: 'Pakistan real estate, property directory Pakistan, real estate agents Pakistan, housing Pakistan, property dealers Pakistan, commercial property Pakistan, residential property Pakistan',
}

export default function RealEstatePage() {
  return <RealEstateClient />
}
