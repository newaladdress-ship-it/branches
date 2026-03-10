'use client'

import { useState, useRef } from 'react'
import { CheckCircle2, Upload, Loader2, AlertCircle } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { CITIES, CATEGORIES } from '@/lib/data'
import { db, storage } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

type Status = 'idle' | 'loading' | 'success' | 'error'

const MAX_LOGO_KB = 200

export default function AddBusinessPage() {
  const [status, setStatus] = useState<Status>('idle')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoError, setLogoError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    whatsapp: '',
    city: '',
    address: '',
    category: '',
    description: '',
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_LOGO_KB * 1024) {
      setLogoError(`Logo must be under ${MAX_LOGO_KB}KB.`)
      return
    }
    setLogoError('')
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      let logoUrl = ''
      
      // Try to upload logo if provided
      if (logoFile) {
        try {
          const timestamp = Date.now()
          const fileExtension = logoFile.name.split('.').pop()?.toLowerCase() || 'jpg'
          const fileName = `${timestamp}.${fileExtension}`
          
          const storageRef = ref(storage, `logos/${fileName}`)
          const metadata = { contentType: logoFile.type || 'image/jpeg' }
          
          const snapshot = await uploadBytes(storageRef, logoFile, metadata)
          logoUrl = await getDownloadURL(snapshot.ref)
        } catch (uploadError) {
          console.warn('Logo upload failed, continuing without logo:', uploadError)
          // Continue without logo instead of failing completely
        }
      }

      // Save business data
      await addDoc(collection(db, 'businesses'), {
        ...form,
        logoUrl,
        createdAt: serverTimestamp(),
        status: 'approved',
      })

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
        <main className="min-h-[70vh] flex items-center justify-center bg-[#f8fafc] px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#0f2b3d]">Listing Submitted!</h1>
            <p className="mt-3 text-gray-500 leading-relaxed">
              Your business listing has been submitted for review. We&apos;ll get it live within 24 hours.
            </p>
            <button
              onClick={() => {
                setStatus('idle')
                setForm({
                  businessName: '', contactPerson: '', email: '', phone: '',
                  whatsapp: '', city: '', address: '', category: '', description: '',
                })
                setLogoFile(null)
                setLogoPreview(null)
              }}
              className="mt-6 px-6 py-3 bg-[#0f2b3d] text-white rounded-xl font-semibold text-sm hover:bg-[#1a3f57] transition-colors"
            >
              Add Another Business
            </button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#f8fafc] py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0f2b3d] text-balance">
              List Your Business – It&apos;s Free
            </h1>
            <p className="mt-3 text-gray-500 text-lg">
              Reach thousands of customers across Pakistan. Fill out the form below to get started.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            aria-label="Add business listing form"
          >
            {/* Basic Info */}
            <fieldset className="p-6 md:p-8 border-b border-gray-100">
              <legend className="text-base font-semibold text-[#0f2b3d] mb-6 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#60a5fa] text-white text-xs flex items-center justify-center font-bold">1</span>
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
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contactPerson"
                    name="contactPerson"
                    type="text"
                    required
                    value={form.contactPerson}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/20 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
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
                    WhatsApp Number
                  </label>
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
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
                Location
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Address <span className="text-red-500">*</span>
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
            <fieldset className="p-6 md:p-8">
              <legend className="text-base font-semibold text-[#0f2b3d] mb-6 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#60a5fa] text-white text-xs flex items-center justify-center font-bold">4</span>
                Business Details
              </legend>
              <div className="space-y-5">
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
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business Logo <span className="text-gray-400">(max {MAX_LOGO_KB}KB)</span>
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
                        <p className="text-xs">PNG, JPG up to {MAX_LOGO_KB}KB</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
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

            {/* Submit */}
            <div className="px-6 md:px-8 pb-8">
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
