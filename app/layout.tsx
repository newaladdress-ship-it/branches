import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: 'PakBizBranches – Pakistan Free Business Listing Directory Without Registration',
  description:
    'Pakistan\'s free business listing directory. Find local businesses phone numbers by city and category. Add your business free, read reviews, and get contact details. Trusted across Pakistan.',
  keywords: 'Pakistan business directory, free business listing Pakistan without registration, free local citations pakistan, local businesses phone numbers in pakistan, verified local services near me pakistan, add business to google maps pakistan alternative, best companies in pakistan contact details, pakistan business directory with whatsapp numbers, Pakistani business listing site, add business free Pakistan, local businesses Pakistan, find businesses Pakistan, companies directory Pakistan',
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
    title: 'PakBizBranches – Pakistan Free Business Listing Directory Without Registration',
    description:
      'Pakistan\'s free business listing directory. Find local businesses phone numbers by city and category. Add your business free—no fees, no credit card. For Pakistan.',
    url: 'https://pakbizbranhces.online',
    siteName: 'PakBizBranches',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PakBizBranches – Pakistan Free Business Listing Directory Without Registration',
    description: 'Pakistan\'s free business listing directory. Find local businesses phone numbers by city and category. Add your business free, read reviews, and get contact details.',
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
              description: 'PakBizBranches is a free business listing directory for Pakistan without registration. It helps users find local businesses phone numbers by city and category and allows business owners to add their local citations for free.',
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
              description: 'Free Pakistan business directory without registration. Find local businesses phone numbers by city and category with WhatsApp details. Add your business free.',
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
      <body className="font-sans antialiased" cz-shortcut-listen="true">{children}</body>
    </html>
  )
}
