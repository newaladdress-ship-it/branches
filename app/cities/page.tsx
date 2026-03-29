import { Metadata } from 'next'
import CitiesClient from './cities-client'

// Add metadata for SEO
export const metadata: Metadata = {
  title: 'All Pakistan Cities | 200+ Cities Directory | Find Local Businesses',
  description: 'Explore all cities in Pakistan. Find businesses, services, and companies in 200+ Pakistani cities. Complete city-wise business directory with contact details.',
  keywords: 'Pakistan cities, Pakistani cities directory, all cities Pakistan, find businesses by city Pakistan, city business directory Pakistan, local businesses Pakistan, Pakistan city list',
}

export default function CitiesPage() {
  return <CitiesClient />
}
