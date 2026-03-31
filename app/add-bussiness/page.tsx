import { Metadata } from 'next'
import AddBussinessClient from './add-bussiness-client'

// Add metadata for SEO
export const metadata: Metadata = {
  title: 'List Your Business for Free | PakBizBranches',
  description: 'Add your business to Pakistan\'s free directory. Get visibility, category placement, and local discovery across major cities.',
  keywords: 'add business Pakistan, free business listing Pakistan, business directory submission Pakistan, local business listing Pakistan',
}

export default function AddBussinessPage() {
  return <AddBussinessClient />
}
