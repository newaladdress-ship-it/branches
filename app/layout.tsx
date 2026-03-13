import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PakBizBranches – Pakistan Free Business Listing Directory | Find Local Companies',
  description:
    'Pakistan\'s free business listing directory. Find local businesses by city and category. Add your business free, read reviews, and get contact details. Trusted across Pakistan.',
  keywords: 'Pakistan business directory, free business listing Pakistan, Pakistani business listing site, add business free Pakistan, local businesses Pakistan, find businesses Pakistan, business search Pakistan, companies directory Pakistan, services directory Pakistan, shop directory Pakistan, restaurant directory Pakistan, hospital directory Pakistan, school directory Pakistan',
  authors: [{ name: 'PakBizBranches', url: 'https://pakbizbranhces.online' }],
  metadataBase: new URL('https://pakbizbranhces.online'),
  openGraph: {
    title: 'PakBizBranches – Pakistan Free Business Listing Directory',
    description:
      'Pakistan\'s free business listing directory. Find local businesses by city and category. Add your business free—no fees, no credit card. For Pakistan.',
    url: 'https://pakbizbranhces.online',
    siteName: 'PakBizBranches',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PakBizBranches – Pakistan Free Business Listing Directory',
    description: 'Pakistan\'s free business listing directory. Find local businesses by city and category. Add your business free, read reviews, and get contact details.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': 'https://pakbizbranhces.online/#organization',
              name: 'PakBizBranches',
              url: 'https://pakbizbranhces.online',
              logo: 'https://pakbizbranhces.online/bizbranches.pk.png',
              description: 'PakBizBranches is a free business listing directory for Pakistan. It helps users find local businesses by city and category and allows business owners to add their listing for free.',
              sameAs: [],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: 'support@pakbizbranhces.online',
                telephone: '+923142552851',
                areaServed: {
                  '@type': 'Country',
                  name: 'Pakistan'
                }
              },
              areaServed: {
                '@type': 'Country',
                name: 'Pakistan'
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              '@id': 'https://pakbizbranhces.online/#website',
              name: 'PakBizBranches',
              url: 'https://pakbizbranhces.online',
              description: 'Free Pakistan business directory. Find local businesses by city and category. Add your business free.',
              publisher: {
                '@id': 'https://pakbizbranhces.online/#organization'
              },
              inLanguage: 'en-PK',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://pakbizbranhces.online/categories?q={search_term_string}'
                },
                'query-input': 'required name=search_term_string'
              }
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
