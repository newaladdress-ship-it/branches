import { Metadata } from 'next'
import RestaurantsClient from './restaurants-client'

// Add metadata for SEO
export const metadata: Metadata = {
  title: 'Restaurants in Pakistan – Food & Dining Directory',
  description: 'Find best restaurants, cafes, and food businesses in Pakistan. Browse by city, get contact details, phone numbers, and addresses. Free restaurant directory.',
  keywords: 'Pakistan restaurants, food directory Pakistan, cafes Pakistan, dining Pakistan, restaurants near me Pakistan, food businesses Pakistan, restaurant contact details Pakistan',
}

export default function RestaurantsPage() {
  return <RestaurantsClient />
}
