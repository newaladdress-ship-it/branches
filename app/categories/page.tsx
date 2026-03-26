import { Metadata } from 'next'
import CategoriesClient from './categories-client'

// Add metadata for SEO
export const metadata: Metadata = {
  title: 'Pakistan Business Categories | Find Local Services & Companies',
  description: 'Browse business categories in Pakistan. Find restaurants, real estate, healthcare, education, technology, and more. Search by city for local businesses.',
  keywords: 'Pakistan business categories, business directory Pakistan, find businesses by category Pakistan, local business categories Pakistan, business types Pakistan, Pakistani services directory',
}

export default function CategoriesPage() {
  return <CategoriesClient />
}
