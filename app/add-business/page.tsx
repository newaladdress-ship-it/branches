'use client'

import { useState, useRef } from 'react'
import { CheckCircle2, Upload, Loader2, AlertCircle, Eye, ChevronDown } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { CITIES, CATEGORIES } from '@/lib/data'
import { db, storage } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import Link from 'next/link'
import { sendBusinessSubmissionEmail } from '@/lib/email-service'

type Status = 'idle' | 'loading' | 'success' | 'error'

const MAX_LOGO_MB = 2.5
const MIN_DESCRIPTION_CHARS = 500
const MAX_DESCRIPTION_CHARS = 1000

// Sub-categories for each main category
const SUB_CATEGORIES: Record<string, string[]> = {
  'restaurants': ['Fast Food', 'Fine Dining', 'Cafe', 'Bakery', 'Catering', 'Food Truck'],
  'real-estate': ['Residential', 'Commercial', 'Industrial', 'Land', 'Rental', 'Property Management'],
  'technology': ['Software Development', 'Web Design', 'Mobile Apps', 'IT Support', 'Digital Marketing', 'E-commerce'],
  'healthcare': ['Hospitals', 'Clinics', 'Dental', 'Pharmacy', 'Laboratory', 'Medical Equipment'],
  'education': ['Schools', 'Colleges', 'Universities', 'Training Centers', 'Online Courses', 'Tutoring'],
  'retail': ['Clothing', 'Electronics', 'Grocery', 'Furniture', 'Books', 'Sports Equipment'],
  'construction': ['Residential Construction', 'Commercial Construction', 'Renovation', 'Interior Design', 'Architecture'],
  'automotive': ['Car Sales', 'Auto Repair', 'Car Wash', 'Auto Parts', 'Motorcycle', 'Car Rental'],
  'finance': ['Banks', 'Insurance', 'Investment', 'Accounting', 'Tax Services', 'Financial Planning'],
  'travel': ['Hotels', 'Travel Agencies', 'Tour Operators', 'Airlines', 'Car Rental', 'Tourism'],
  'beauty': ['Salons', 'Spas', 'Cosmetics', 'Fitness Centers', 'Yoga Studios', 'Beauty Products'],
  'logistics': ['Shipping', 'Courier Services', 'Warehousing', 'Transportation', 'Moving Services']
}

// Function to create URL slug from business name and city
function createSlug(businessName: string, city: string): string {
  const combined = `${businessName} ${city}`
  return combined
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .substring(0, 100) // Limit length
}

export default function AddBusinessPage() {
  const [status, setStatus] = useState<Status>('idle')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoError, setLogoError] = useState('')
  const [businessId, setBusinessId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    whatsapp: '',
    country: 'Pakistan',
    city: '',
    postalCode: '',
    address: '',
    category: '',
    subCategory: '',
    description: '',
    websiteUrl: '',
    facebookPage: '',
    googleBusiness: '',
    youtubeChannel: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [digitalPresenceCount, setDigitalPresenceCount] = useState(0)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ 
      ...prev, 
      [name]: value,
      // Reset sub-category when main category changes
      ...(name === 'category' ? { subCategory: '' } : {})
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Count digital presence fields
    if (['websiteUrl', 'facebookPage', 'googleBusiness', 'youtubeChannel'].includes(name)) {
      const updatedForm = { ...form, [name]: value }
      const count = [updatedForm.websiteUrl, updatedForm.facebookPage, updatedForm.googleBusiness, updatedForm.youtubeChannel]
        .filter(field => field.trim().length > 0).length
      setDigitalPresenceCount(count)
    }
  }

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Check file size (2.5MB)
    if (file.size > MAX_LOGO_MB * 1024 * 1024) {
      setLogoError(`Logo must be under ${MAX_LOGO_MB}MB.`)
      return
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      setLogoError('Logo must be JPG, PNG, WebP, or SVG format.')
      return
    }
    
    setLogoError('')
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }
  
  function validateForm(): boolean {
    const newErrors: Record<string, string> = {}
    
    // Required fields
    if (!form.businessName.trim()) newErrors.businessName = 'Business name is required'
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!form.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required'
    if (!form.city) newErrors.city = 'City is required'
    if (!form.category) newErrors.category = 'Category is required'
    if (!form.address.trim()) newErrors.address = 'Complete address is required'
    if (!form.description.trim()) newErrors.description = 'Business description is required'
    if (!form.email.trim()) newErrors.email = 'Email address is required'
    // Logo is optional for now
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (form.email && !emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    // Phone number validation (Pakistan format - exactly 10 digits)
    const phoneRegex = /^[0-9]{10}$/
    if (form.phone && !phoneRegex.test(form.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid Pakistani phone number (10 digits, e.g. 3001234567)'
    }
    if (form.whatsapp && !phoneRegex.test(form.whatsapp.replace(/[^0-9]/g, ''))) {
      newErrors.whatsapp = 'Please enter a valid Pakistani WhatsApp number (10 digits, e.g. 3001234567)'
    }
    
    // Description length validation
    if (form.description.length < MIN_DESCRIPTION_CHARS) {
      newErrors.description = `Description must be at least ${MIN_DESCRIPTION_CHARS} characters`
    }
    if (form.description.length > MAX_DESCRIPTION_CHARS) {
      newErrors.description = `Description must not exceed ${MAX_DESCRIPTION_CHARS} characters`
    }
    
    // Digital presence validation (at least one required)
    if (digitalPresenceCount === 0) {
      newErrors.digitalPresence = 'At least one digital presence field (Website URL or Facebook Page) is required'
    }
    
    // URL validation
    const urlRegex = /^https?:\/\/.+/
    if (form.websiteUrl && !urlRegex.test(form.websiteUrl)) {
      newErrors.websiteUrl = 'Please enter a valid URL starting with http:// or https://'
    }
    if (form.facebookPage && !urlRegex.test(form.facebookPage)) {
      newErrors.facebookPage = 'Please enter a valid URL starting with http:// or https://'
    }
    if (form.googleBusiness && !urlRegex.test(form.googleBusiness)) {
      newErrors.googleBusiness = 'Please enter a valid URL starting with http:// or https://'
    }
    if (form.youtubeChannel && !urlRegex.test(form.youtubeChannel)) {
      newErrors.youtubeChannel = 'Please enter a valid URL starting with http:// or https://'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Check if email is already used for another business
  async function checkEmailAvailability(): Promise<boolean> {
    if (!form.email.trim()) return false
    
    try {
      const q = query(
        collection(db, 'businesses'),
        where('email', '==', form.email.trim())
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.empty // Return true if email is available (no existing business)
    } catch (error) {
      console.error('Error checking email availability:', error)
      return false
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log('Submit button clicked!', { form, status })
    
    if (!validateForm()) {
      console.log('Form validation failed:', errors)
      return
    }
    
    setStatus('loading')
    console.log('Setting status to loading...')
    
    try {
      // Check if email is already used for another business
      const emailAvailable = await checkEmailAvailability()
      if (!emailAvailable) {
        setErrors(prev => ({ 
          ...prev, 
          email: 'This email is already registered with another business. One email can only be used for one business registration.' 
        }))
        setStatus('idle')
        return
      }
      
      // Create slug for business
      const slug = createSlug(form.businessName, form.city)
      console.log('Generated slug:', slug)
      
      // For now, skip logo upload to avoid CORS/permissions issues
      // Save business data to Firestore
      const businessData = {
        businessName: form.businessName,
        contactPerson: form.contactPerson || null,
        email: form.email || null,
        phone: form.phone,
        whatsapp: form.whatsapp,
        city: form.city,
        postalCode: form.postalCode || null,
        address: form.address,
        category: form.category,
        subCategory: form.subCategory || null,
        description: form.description,
        websiteUrl: form.websiteUrl || null,
        facebookPage: form.facebookPage || null,
        googleBusiness: form.googleBusiness || null,
        youtubeChannel: form.youtubeChannel || null,
        slug: slug,
        logoUrl: '', // Skip logo for now
        createdAt: serverTimestamp(),
        status: 'approved',
      }
      
      console.log('Saving business data:', businessData)
      const docRef = await addDoc(collection(db, 'businesses'), businessData)
      console.log('Business data saved successfully with ID:', docRef.id)
      
      // Send thank you email with referral request
      const emailSent = await sendBusinessSubmissionEmail({
        to: form.email,
        businessName: form.businessName,
        businessId: docRef.id
      })
      
      if (emailSent) {
        console.log('Thank you email sent successfully')
      } else {
        console.error('Failed to send thank you email')
      }
      
      setBusinessId(docRef.id)
      setStatus('success')
    } catch (err) {
      console.error('Firebase error:', err)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <>
        <Navbar />
        <main className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-10 max-w-md w-full text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Business Added Successfully!</h1>
            <p className="mt-3 text-slate-600 leading-relaxed mb-6">
              Your business listing is now live and ready to attract customers.
            </p>
            
            <div className="space-y-3">
              {businessId && (
                <Link
                  href={`/${createSlug(form.businessName, form.city)}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Live Preview Your Business
                </Link>
              )}
              
              <button
                onClick={() => {
                  setStatus('idle')
                  setBusinessId(null)
                  setForm({
                    businessName: '', contactPerson: '', email: '', phone: '',
                    whatsapp: '', city: '', postalCode: '', address: '', category: '', 
                    subCategory: '', description: '', websiteUrl: '', facebookPage: '',
                    googleBusiness: '', youtubeChannel: ''
                  })
                  setErrors({})
                  setDigitalPresenceCount(0)
                  setLogoFile(null)
                  setLogoPreview(null)
                }}
                className="w-full px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors"
              >
                Add Another Business
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-br from-slate-50 to-blue-50 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 text-balance">
              List Your Business – It&apos;s Free
            </h1>
            <p className="mt-3 text-slate-600 text-lg">
              Reach thousands of customers across Pakistan. Fill out the form below to get started.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
            aria-label="Add business listing form"
          >
            {/* Basic Info */}
            <fieldset className="p-6 md:p-8 border-b border-slate-100">
              <legend className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">1</span>
                Basic Information
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    required
                    value={form.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Ahmed Electronics"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/20 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Contact Person
                  </label>
                  <input
                    id="contactPerson"
                    name="contactPerson"
                    type="text"
                    value={form.contactPerson}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/20 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/20 transition-all"
                  />
                </div>
              </div>
            </fieldset>

            {/* Contact */}
            <fieldset className="p-6 md:p-8 border-b border-gray-100">
              <legend className="text-base font-semibold text-[#0f2b3d] mb-6 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#60a5fa] text-white text-xs flex items-center justify-center font-bold">2</span>
                Contact Details
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+92 300 0000000"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/20 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1.5">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    required
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="+92 300 0000000"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/20 transition-all"
                  />
                </div>
              </div>
            </fieldset>

            {/* Location */}
            <fieldset className="p-6 md:p-8 border-b border-gray-100">
              <legend className="text-base font-semibold text-[#0f2b3d] mb-6 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#60a5fa] text-white text-xs flex items-center justify-center font-bold">3</span>
                Location & Category
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    disabled
                    value={form.country}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="city"
                    name="city"
                    required
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/20 transition-all bg-white text-gray-700 cursor-pointer"
                  >
                    <option value="">Select a city</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Postal Code
                  </label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="e.g. 75500"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/20 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/20 transition-all bg-white text-gray-700 cursor-pointer"
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Sub Category
                  </label>
                  <select
                    id="subCategory"
                    name="subCategory"
                    value={form.subCategory}
                    onChange={handleChange}
                    disabled={!form.category}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/20 transition-all bg-white text-gray-700 cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select sub category</option>
                    {form.category && SUB_CATEGORIES[form.category]?.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Complete Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Street, area, landmark"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/20 transition-all"
                  />
                </div>
              </div>
            </fieldset>

            {/* Business Details */}
            <fieldset className="p-6 md:p-8 border-b border-gray-100">
              <legend className="text-base font-semibold text-[#0f2b3d] mb-6 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#60a5fa] text-white text-xs flex items-center justify-center font-bold">4</span>
                Business Details
              </legend>
              <div className="space-y-5">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Tell customers about your business, products, services..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/20 transition-all resize-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">{form.description.length}/{MAX_DESCRIPTION_CHARS} characters</p>
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business Logo <span className="text-gray-400">(max {MAX_LOGO_MB}MB)</span>
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#60a5fa] transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload business logo"
                    onKeyDown={(e) => { if (e.key === 'Enter') fileInputRef.current?.click() }}
                  >
                    {logoPreview ? (
                      <div className="flex flex-col items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logoPreview} alt="Logo preview" className="w-20 h-20 object-contain rounded-lg" />
                        <p className="text-sm text-[#60a5fa] font-medium">{logoFile?.name}</p>
                        <p className="text-xs text-gray-400">Click to change</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Upload className="w-8 h-8" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-600">Click to upload logo</p>
                        <p className="text-xs">JPG, PNG, WebP, SVG up to {MAX_LOGO_MB}MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleLogo}
                    className="hidden"
                    aria-label="Logo file input"
                  />
                  {logoError && (
                    <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {logoError}
                    </p>
                  )}
                </div>
              </div>
            </fieldset>

            {/* Digital Presence */}
            <fieldset className="p-6 md:p-8">
              <legend className="text-base font-semibold text-[#0f2b3d] mb-6 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#60a5fa] text-white text-xs flex items-center justify-center font-bold">5</span>
                Digital Presence
              </legend>
              <p className="text-sm text-gray-600 mb-5">At least one of the following is required:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Website URL
                  </label>
                  <input
                    id="websiteUrl"
                    name="websiteUrl"
                    type="url"
                    value={form.websiteUrl}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/20 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="facebookPage" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Facebook Page
                  </label>
                  <input
                    id="facebookPage"
                    name="facebookPage"
                    type="url"
                    value={form.facebookPage}
                    onChange={handleChange}
                    placeholder="https://facebook.com/yourpage"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/20 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="googleBusiness" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Google Business Profile
                  </label>
                  <input
                    id="googleBusiness"
                    name="googleBusiness"
                    type="url"
                    value={form.googleBusiness}
                    onChange={handleChange}
                    placeholder="https://google.com/business/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/20 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="youtubeChannel" className="block text-sm font-medium text-gray-700 mb-1.5">
                    YouTube Channel
                  </label>
                  <input
                    id="youtubeChannel"
                    name="youtubeChannel"
                    type="url"
                    value={form.youtubeChannel}
                    onChange={handleChange}
                    placeholder="https://youtube.com/@yourchannel"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/20 transition-all"
                  />
                </div>
              </div>
              {errors.digitalPresence && (
                <p className="mt-3 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.digitalPresence}
                </p>
              )}
            </fieldset>

            {/* Submit */}
            <div className="px-6 md:px-8 py-8 border-t border-gray-100">
              {status === 'error' && (
                <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Something went wrong. Please try again.
                </div>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-[#0f2b3d] hover:bg-[#1a3f57] disabled:opacity-60 text-white font-bold rounded-xl transition-colors duration-200 text-base flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Business Listing'
                )}
              </button>
              <p className="mt-3 text-center text-xs text-gray-400">
                By submitting, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
