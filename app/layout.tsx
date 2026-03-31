import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: 'Pakistan Business Directory | Find Local Services Fast',
  description:
    'Find top businesses in Pakistan by city and category. Get verified phone numbers, addresses, and service details. List your business for free.',
  keywords:
    'Pakistan business directory, find businesses near you Pakistan, best local services Pakistan, free business listing Pakistan, city business listings Pakistan',
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
    title: 'Pakistan Business Directory | Find Local Services Fast',
    description:
      'Find top businesses in Pakistan by city and category. Compare listings and contact local services quickly.',
    url: 'https://pakbizbranhces.online',
    siteName: 'PakBizBranches',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pakistan Business Directory | Find Local Services Fast',
    description:
      'Find top businesses in Pakistan by city and category. List your business for free and get discovered.',
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
