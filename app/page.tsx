import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import HeroSection from '@/components/home/hero-section'
import AboutSection from '@/components/home/about-section'
import StatsSection from '@/components/home/stats-section'
import LatestBusinesses from '@/components/home/latest-businesses'
import CategoriesGrid from '@/components/home/categories-grid'
import CitiesGrid from '@/components/home/cities-grid'
import CTASection from '@/components/home/cta-section'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pakistan Business Directory | 50,000+ Local Businesses | List Free',
  description: 'Find verified Pakistani businesses by city & category. Get phone numbers, WhatsApp details & addresses. List your business free - no registration required. Instant approval.',
  alternates: { canonical: 'https://pakbizbranhces.online/' },
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <StatsSection />
        <CategoriesGrid />
        <LatestBusinesses />
        <CitiesGrid />
        <AboutSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
