// Seed script: adds 50 realistic Pakistani businesses to Firestore.
// Usage (run once from project root):
//   node scripts/seed-businesses.mjs
//
// Every business is written to the `businesses` collection with status='approved',
// a proper slug, category/categoryId, and server timestamps. Emails are intentionally
// left blank and phone numbers are plausible but not real.
//
// Safe to re-run: existing documents with the same slug are skipped.

import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyC1dRJtLFMhBqieIj6JrtZsd4j0jd1xM_Y',
  authDomain: 'branches-app-ff0a2.firebaseapp.com',
  projectId: 'branches-app-ff0a2',
  storageBucket: 'branches-app-ff0a2.appspot.com',
  messagingSenderId: '817543103901',
  appId: '1:817543103901:web:0f1de5eacc949505dc9b74',
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)

function slugify(businessName, city) {
  const s = businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  return city ? `${s}-${city.toLowerCase().replace(/\s+/g, '-')}` : s
}

// 50 realistic Pakistani businesses spread across all 12 categories and major cities.
// Phone numbers follow the standard PK format but are not real business numbers.
const BUSINESSES = [
  // ===== Restaurants & Food (6) =====
  { name: 'Kolachi Seaview Restaurant', category: 'restaurants', city: 'Karachi', address: 'Do Darya, Phase 8, DHA, Karachi', phone: '021 111 565 224', desc: 'Open-air seaside dining with traditional Pakistani BBQ, Mughlai cuisine and family seating overlooking the Arabian Sea.' },
  { name: 'Monal Restaurant Pir Sohawa', category: 'restaurants', city: 'Islamabad', address: 'Pir Sohawa Road, Margalla Hills, Islamabad', phone: '051 261 1111', desc: 'Hilltop restaurant offering panoramic views of Islamabad with a multi-cuisine buffet and family-friendly terrace seating.' },
  { name: 'Cooco\'s Den & Cafe', category: 'restaurants', city: 'Lahore', address: 'Food Street, Fort Road, Walled City, Lahore', phone: '042 3735 8485', desc: 'Iconic rooftop restaurant inside a restored haveli, serving traditional Lahori food with a clear view of the Badshahi Mosque.' },
  { name: 'Chaaye Khana', category: 'restaurants', city: 'Rawalpindi', address: 'Saddar, Kashmir Road, Rawalpindi', phone: '051 584 5050', desc: 'Popular cafe serving desi breakfast, karak chai, paratha rolls and continental snacks in a cosy setting.' },
  { name: 'Bundu Khan Restaurant', category: 'restaurants', city: 'Faisalabad', address: 'Main Susan Road, Madina Town, Faisalabad', phone: '041 855 7777', desc: 'Family-style restaurant specialising in Pakistani BBQ, seekh kebabs, karahi and freshly baked naan.' },
  { name: 'Cafe Aylanto', category: 'restaurants', city: 'Multan', address: 'Gulgasht Colony, Multan', phone: '061 630 4040', desc: 'Upscale Italian and Mediterranean restaurant with a relaxed ambience, wood-fired pizza and homemade pasta.' },

  // ===== Real Estate (5) =====
  { name: 'Paragon City Estates', category: 'real-estate', city: 'Lahore', address: 'Main Boulevard, Paragon City, Barki Road, Lahore', phone: '042 3636 2828', desc: 'Authorised real estate dealers for plots and houses in Paragon City, DHA and Bahria Town Lahore.' },
  { name: 'Bahria Properties Karachi', category: 'real-estate', city: 'Karachi', address: 'Bahria Town Main Gate, Superhighway, Karachi', phone: '021 111 222 773', desc: 'Buying, selling and renting villas, apartments and commercial plots across Bahria Town and DHA City Karachi.' },
  { name: 'DHA Valley Consultants', category: 'real-estate', city: 'Islamabad', address: 'Sector F, DHA Valley, Islamabad', phone: '051 843 6600', desc: 'Specialists in DHA Valley, DHA Phase 2 and Bahria Town plot files, balloting support and resale properties.' },
  { name: 'Gulberg Greens Realtors', category: 'real-estate', city: 'Rawalpindi', address: 'Murree Road, Satellite Town, Rawalpindi', phone: '051 484 3232', desc: 'Residential and commercial real estate across Gulberg Greens, Bahria Town Phase 8 and Adiala Road.' },
  { name: 'Eastern Housing Properties', category: 'real-estate', city: 'Faisalabad', address: 'Eastern Housing Scheme, Sargodha Road, Faisalabad', phone: '041 844 0909', desc: 'Full-service property agency for plots, houses and commercial shops in Faisalabad and surrounding areas.' },

  // ===== Technology & IT (5) =====
  { name: 'NetSol Technologies', category: 'technology', city: 'Lahore', address: 'NetSol Avenue, Ghazi Road, Lahore Cantt', phone: '042 111 438 0765', desc: 'Global IT solutions provider delivering asset finance and leasing software, digital transformation and enterprise services.' },
  { name: 'Systems Limited', category: 'technology', city: 'Karachi', address: 'E-5, Central Commercial Area, Block 6, PECHS, Karachi', phone: '021 111 797 836', desc: 'One of Pakistan\'s largest software houses offering ERP, cloud, BPO and custom software development services.' },
  { name: 'Venture Dive', category: 'technology', city: 'Islamabad', address: '7th Avenue, G-8 Markaz, Islamabad', phone: '051 831 5510', desc: 'Technology company building data-driven products, mobile apps and AI solutions for global clients.' },
  { name: 'Kualitatem Software Testing', category: 'technology', city: 'Rawalpindi', address: 'Bahria Town Phase 7, Rawalpindi', phone: '051 111 582 548', desc: 'Independent software testing, QA automation and cybersecurity consulting for enterprises worldwide.' },
  { name: 'CodeNinja Technologies', category: 'technology', city: 'Peshawar', address: 'University Road, Hayatabad Phase 3, Peshawar', phone: '091 581 1011', desc: 'Offshore software development and IT consulting firm specialising in .NET, React, Node.js and mobile apps.' },

  // ===== Healthcare & Medical (5) =====
  { name: 'Aga Khan University Hospital', category: 'healthcare', city: 'Karachi', address: 'Stadium Road, Karachi', phone: '021 111 911 911', desc: 'JCI-accredited tertiary-care teaching hospital offering 24/7 emergency, surgery, diagnostics and specialist clinics.' },
  { name: 'Shaukat Khanum Memorial Hospital', category: 'healthcare', city: 'Lahore', address: '7A Block R-3, Johar Town, Lahore', phone: '042 3590 5000', desc: 'Cancer hospital and research centre offering diagnosis, chemotherapy, radiation therapy and surgical oncology.' },
  { name: 'Shifa International Hospital', category: 'healthcare', city: 'Islamabad', address: 'Sector H-8/4, Pitras Bukhari Road, Islamabad', phone: '051 846 4646', desc: 'Multi-specialty tertiary-care hospital with modern ICU, cardiac centre, transplant unit and outpatient clinics.' },
  { name: 'Nishtar Medical Complex', category: 'healthcare', city: 'Multan', address: 'Nishtar Road, Multan', phone: '061 921 0091', desc: 'Public tertiary-care teaching hospital providing free emergency care, surgery and specialist OPD services.' },
  { name: 'Rehman Medical Institute', category: 'healthcare', city: 'Peshawar', address: '5-B/2 Phase 5, Hayatabad, Peshawar', phone: '091 583 3041', desc: 'Private tertiary-care hospital offering cardiology, neurosurgery, oncology and 24/7 emergency services.' },

  // ===== Education & Training (4) =====
  { name: 'Beaconhouse School System', category: 'education', city: 'Lahore', address: '20-D-1 Gulberg III, Lahore', phone: '042 111 232 266', desc: 'Leading private school network offering Pre-K to A-Level education with British and Pakistani curricula.' },
  { name: 'IBA Karachi', category: 'education', city: 'Karachi', address: 'University Road, Karachi', phone: '021 3810 4700', desc: 'Institute of Business Administration - Pakistan\'s oldest business school offering BBA, MBA and PhD programmes.' },
  { name: 'NUST Islamabad', category: 'education', city: 'Islamabad', address: 'H-12, Islamabad', phone: '051 9085 1900', desc: 'National University of Sciences & Technology - top-ranked university for engineering, computing and sciences.' },
  { name: 'Punjab Group of Colleges', category: 'education', city: 'Faisalabad', address: 'East Canal Road, Faisalabad', phone: '041 111 111 014', desc: 'Nationwide college network offering FSc, ICS, I.Com and entry-test preparation for engineering and medical.' },

  // ===== Retail & Shopping (5) =====
  { name: 'Dolmen Mall Clifton', category: 'retail', city: 'Karachi', address: 'Marine Drive, Block 4, Clifton, Karachi', phone: '021 111 365 636', desc: 'Premier shopping mall with over 140 international and local brands, food court, cinema and sea-view dining.' },
  { name: 'Packages Mall Lahore', category: 'retail', city: 'Lahore', address: 'Walton Road, Nishtar Town, Lahore', phone: '042 111 222 111', desc: 'Largest shopping mall in Lahore featuring anchor stores, fashion brands, hypermarket and family entertainment.' },
  { name: 'Sialkot Sports Traders', category: 'retail', city: 'Sialkot', address: 'Paris Road, Commissioner Office, Sialkot', phone: '052 425 3344', desc: 'Wholesale and retail supplier of footballs, boxing gloves, cricket gear and hand-stitched sports equipment.' },
  { name: 'Lok Virsa Handicrafts', category: 'retail', city: 'Gujranwala', address: 'G.T. Road, Gujranwala Cantt', phone: '055 384 1919', desc: 'Retail store offering authentic Pakistani handicrafts, truck art, ajrak, hand-embroidered shawls and brassware.' },
  { name: 'Al-Fatah Shopping Mall', category: 'retail', city: 'Multan', address: 'Abdali Road, Multan Cantt', phone: '061 458 5858', desc: 'Family department store with grocery, garments, cosmetics, kitchenware and electronics under one roof.' },

  // ===== Construction (3) =====
  { name: 'Habib Construction Services', category: 'construction', city: 'Karachi', address: 'HCS Tower, Plot 3, Sector 24, KIA, Karachi', phone: '021 3506 0571', desc: 'Civil engineering contractor for highways, bridges, water treatment plants and infrastructure projects.' },
  { name: 'Descon Engineering', category: 'construction', city: 'Lahore', address: '18-KM Ferozepur Road, Lahore', phone: '042 111 337 266', desc: 'Integrated engineering, procurement and construction (EPC) contractor for oil, gas, power and industrial plants.' },
  { name: 'FWO Construction', category: 'construction', city: 'Islamabad', address: 'Qasim Market, Sector G-9/4, Islamabad', phone: '051 925 3840', desc: 'Frontier Works Organization - large-scale construction of motorways, tunnels, dams and defence projects.' },

  // ===== Automotive (4) =====
  { name: 'Indus Motor Toyota Center', category: 'automotive', city: 'Karachi', address: 'Plot N-1, S.I.T.E., Karachi', phone: '021 111 869 682', desc: 'Authorised Toyota dealer for new cars, genuine parts and certified after-sales service.' },
  { name: 'Honda Atlas Point', category: 'automotive', city: 'Lahore', address: '1-McLeod Road, Lahore', phone: '042 3636 6680', desc: 'Authorised Honda 3S dealership offering Civic, City, BR-V sales, service and genuine spare parts.' },
  { name: 'Suzuki Defence Motors', category: 'automotive', city: 'Rawalpindi', address: 'Main Murree Road, Chaklala Scheme 3, Rawalpindi', phone: '051 584 0606', desc: 'Pak Suzuki authorised dealership for Alto, Cultus, Swift, Wagon-R sales and service.' },
  { name: 'Kia Lucky Motors', category: 'automotive', city: 'Faisalabad', address: 'Jaranwala Road, Faisalabad', phone: '041 874 4444', desc: 'KIA authorised dealer for Sportage, Picanto, Stonic and Sorento with full service workshop.' },

  // ===== Finance & Banking (3) =====
  { name: 'HBL Plaza Branch', category: 'finance', city: 'Karachi', address: 'HBL Plaza, I.I. Chundrigar Road, Karachi', phone: '021 111 111 425', desc: 'Habib Bank Limited head-office branch offering personal, business and corporate banking, lockers and forex.' },
  { name: 'Meezan Bank Main Branch', category: 'finance', city: 'Lahore', address: '38-A Main Gulberg, Lahore', phone: '042 111 331 331', desc: 'Pakistan\'s first and largest Islamic bank providing Shariah-compliant deposits, car ijarah and home financing.' },
  { name: 'State Bank of Pakistan Islamabad Office', category: 'finance', city: 'Islamabad', address: 'SBP Building, Sector G-5, Islamabad', phone: '051 920 6001', desc: 'Regional office of the central bank handling currency operations, clearing and government banking.' },

  // ===== Travel & Tourism (4) =====
  { name: 'Travel Walji\'s', category: 'travel', city: 'Islamabad', address: '10-Khayaban-e-Suhrwardy, Aabpara, Islamabad', phone: '051 287 8342', desc: 'IATA-accredited travel agency offering airline ticketing, Umrah packages, Europe tours and visa services.' },
  { name: 'Sitara Travel Consultants', category: 'travel', city: 'Karachi', address: 'Shaheen Complex, M.R. Kiyani Road, Karachi', phone: '021 3565 1234', desc: 'Full-service travel agency for air tickets, hotel bookings, Umrah and Hajj packages and international tours.' },
  { name: 'Lahore Tour Specialists', category: 'travel', city: 'Lahore', address: 'Fortress Stadium, Lahore Cantt', phone: '042 3666 0505', desc: 'Local and international tour operator for Northern Areas, Turkey, Dubai, Azerbaijan and Saudi Arabia.' },
  { name: 'Karakoram Explorers', category: 'travel', city: 'Skardu', address: 'Main Bazaar, Skardu City', phone: '0581 4600 100', desc: 'Adventure tourism company offering Deosai, K2 Base Camp, Shigar Fort and Hunza trekking expeditions.' },

  // ===== Beauty & Wellness (3) =====
  { name: 'Nabila Salon', category: 'beauty', city: 'Karachi', address: 'N-Gents, 22nd Street, Khayaban-e-Shahbaz, DHA Phase 6, Karachi', phone: '021 3531 0001', desc: 'Award-winning salon offering bridal makeup, hair styling, colour, skin and nail services by Nabila\'s team.' },
  { name: 'Depilex Smile Studio', category: 'beauty', city: 'Lahore', address: '10-Commercial Zone, Liberty Market, Gulberg, Lahore', phone: '042 3578 1111', desc: 'Full-service beauty salon offering facials, laser treatments, bridal packages and dental smile makeovers.' },
  { name: 'Natasha Beauty Salon', category: 'beauty', city: 'Islamabad', address: 'F-7 Markaz, Islamabad', phone: '051 265 2020', desc: 'Signature salon for haircuts, hair colour, keratin, facials, waxing, threading and bridal makeovers.' },

  // ===== Logistics & Transport (3) =====
  { name: 'TCS Express & Logistics', category: 'logistics', city: 'Karachi', address: 'TCS Head Office, Plot 113, Sector 24, Korangi, Karachi', phone: '021 111 123 456', desc: 'Pakistan\'s leading courier and logistics company offering overnight delivery, e-commerce and freight services.' },
  { name: 'Leopards Courier Services', category: 'logistics', city: 'Lahore', address: '88-C, Block E, Main Boulevard, Gulberg III, Lahore', phone: '042 111 300 786', desc: 'Nationwide domestic and international courier service with same-day delivery and cash-on-delivery solutions.' },
  { name: 'M&P Express Logistics', category: 'logistics', city: 'Hyderabad', address: 'Auto Bhan Road, Latifabad, Hyderabad', phone: '022 381 1011', desc: 'Muller & Phipps logistics offering parcel delivery, warehousing and cash-on-delivery for online stores.' },
]

async function slugExists(slug) {
  const q = query(collection(db, 'businesses'), where('slug', '==', slug))
  const snap = await getDocs(q)
  return !snap.empty
}

async function main() {
  console.log(`Seeding ${BUSINESSES.length} businesses into Firestore...`)

  let added = 0
  let skipped = 0
  let failed = 0

  for (const biz of BUSINESSES) {
    const slug = slugify(biz.name, biz.city)

    try {
      if (await slugExists(slug)) {
        console.log(`  skip  ${slug} (already exists)`)
        skipped++
        continue
      }

      const doc = {
        businessName: biz.name,
        description: biz.desc,
        phone: biz.phone,
        whatsapp: biz.phone,
        email: '',
        websiteUrl: '',
        facebookPage: '',
        youtubeChannel: '',
        logoUrl: '',
        address: biz.address,
        city: biz.city,
        category: biz.category,
        categoryId: biz.category,
        categorySlug: biz.category,
        subCategory: '',
        slug,
        status: 'approved',
        featured: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await addDoc(collection(db, 'businesses'), doc)
      console.log(`  added ${slug}`)
      added++
    } catch (err) {
      console.error(`  FAIL  ${slug}:`, err.message)
      failed++
    }
  }

  console.log('\nDone.')
  console.log(`  Added:   ${added}`)
  console.log(`  Skipped: ${skipped}`)
  console.log(`  Failed:  ${failed}`)

  // firebase-js keeps the process alive; force exit so the terminal returns
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(err => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
