import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: 'PakBizBranches – Pakistan Free Business Directory | 50,000+ Listings',
  description: 'Find verified Pakistani businesses by city & category. Get phone numbers, WhatsApp details & addresses. List your business free - no registration required. Instant approval.',
  keywords: 'Pakistan business directory, free business listing Pakistan, Pakistani business directory, local businesses Pakistan, add business free Pakistan, business contact details Pakistan, WhatsApp business directory Pakistan, verified local services Pakistan, companies directory Pakistan, find businesses Pakistan, Pakistan business search, Pakistani companies directory',
  authors: [{ name: 'PakBizBranches', url: 'https://pakbizbranhces.online' }],
  metadataBase: new URL('https://pakbizbranhces.online'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-dark-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'PakBizBranches – Pakistan Free Business Directory | 50,000+ Daily Users',
    description: 'Pakistan\'s #1 free business directory with 12,450+ listings. Add your business free without registration. Get phone numbers and verified listings.',
    url: 'https://pakbizbranhces.online',
    siteName: 'PakBizBranches',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PakBizBranches – Pakistan Free Business Directory | 50,000+ Daily Users',
    description: 'Pakistan\'s #1 free business directory with 12,450+ listings. Add your business free without registration.',
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
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
              description: 'Pakistan\'s #1 free business directory with 12,450+ listings. No registration required. Helps users find local businesses phone numbers by city and category and allows business owners to add their local citations for free.',
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
              description: 'Pakistan\'s #1 free business directory with 12,450+ listings. No registration required. Find local businesses phone numbers by city and category with WhatsApp details. Add your business free.',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              '@id': 'https://pakbizbranhces.online/#localbusiness',
              name: 'PakBizBranches Business Directory',
              url: 'https://pakbizbranhces.online',
              description: 'Free Pakistan business directory service connecting local businesses with customers',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'PK',
                addressLocality: 'Pakistan'
              },
              serviceType: 'Business Directory Service',
              areaServed: {
                '@type': 'Country',
                name: 'Pakistan'
              }
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased" cz-shortcut-listen="true">{children}</body>
    </html>
  )
}
