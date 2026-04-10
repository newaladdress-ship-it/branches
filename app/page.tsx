import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Metadata } from 'next'
import HeroSection from '@/components/home/hero-section'
import AboutSection from '@/components/home/about-section'
import StatsSection from '@/components/home/stats-section'
import FeaturedBusinessesSection from '@/components/featured-businesses-section'
import LatestBusinesses from '@/components/home/latest-businesses'
import CategoriesGrid from '@/components/home/categories-grid'
import CitiesGrid from '@/components/home/cities-grid'
import CTASection from '@/components/home/cta-section'

export const metadata: Metadata = {
  title: 'Pakistan Business Directory | Find Local Businesses',
  description:
    'Search Pakistan businesses by category and city. Compare phone numbers, locations, and services. List your business for free on PakBizBranches.',
  alternates: {
    canonical: 'https://pakbizbranhces.online/',
  },
  openGraph: {
    title: 'Pakistan Business Directory | Find Local Businesses',
    description:
      'Search Pakistan businesses by category and city. Compare phone numbers, locations, and services. List your business for free on PakBizBranches.',
    url: 'https://pakbizbranhces.online/',
    siteName: 'PakBizBranches',
    locale: 'en_PK',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <FeaturedBusinessesSection />
        <LatestBusinesses />
        <CategoriesGrid />
        <CitiesGrid />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
