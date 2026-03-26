import { Metadata } from 'next'
import BusinessClient from './business-client'

// Add metadata for SEO
export const metadata: Metadata = {
  title: 'Business Details – PakBizBranches Pakistan Directory',
  description: 'View complete business information including contact details, address, phone numbers, and WhatsApp. Verified business listings across Pakistan.',
  keywords: 'business details Pakistan, business contact Pakistan, business information Pakistan, verified business Pakistan, business directory Pakistan',
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
}

export default function BusinessPage() {
  return <BusinessClient />
}