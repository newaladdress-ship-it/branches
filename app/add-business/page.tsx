import { Metadata } from 'next'
import AddBusinessClient from './add-business-client'

// Add metadata for SEO
export const metadata: Metadata = {
  title: 'Add Business Free – PakBizBranches Pakistan Directory',
  description: 'Add your business to Pakistan\'s free directory without registration. Get instant online visibility, WhatsApp integration, and reach thousands of customers across Pakistan.',
  keywords: 'add business Pakistan, free business listing Pakistan, business directory submission Pakistan, add business free Pakistan, business registration Pakistan, local business listing Pakistan',
}

export default function AddBusinessPage() {
  return <AddBusinessClient />
}
