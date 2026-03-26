import { Metadata } from 'next'
import ContactClient from './contact-client'

// Add metadata for SEO
export const metadata: Metadata = {
  title: 'Contact PakBizBranches – Pakistan Business Directory',
  description: 'Get in touch with PakBizBranches team. Contact us for business listings, support, or partnerships. We\'re here to help Pakistani businesses grow.',
  keywords: 'contact PakBizBranches, business directory support Pakistan, business listing help Pakistan, contact business directory Pakistan, customer support Pakistan',
}

export default function ContactPage() {
  return <ContactClient />
}
