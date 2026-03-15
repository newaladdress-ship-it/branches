'use client'

import { useState, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Upload, X, CheckCircle2, Star, TrendingUp } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { sendPriorityConfirmationEmail } from '@/lib/email-service'

export default function PriorityPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [email, setEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [screenshots, setScreenshots] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [referralCount, setReferralCount] = useState(0)
  
  const MAX_SCREENSHOTS = 10
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  // Get email and business name from URL params
  useState(() => {
    const urlEmail = searchParams.get('email')
    const urlBusiness = searchParams.get('business')
    if (urlEmail) setEmail(decodeURIComponent(urlEmail))
    if (urlBusiness) setBusinessName(decodeURIComponent(urlBusiness))
  })

  async function checkBusinessExists() {
    if (!email || !businessName) return false
    
    try {
      const q = query(
        collection(db, 'businesses'),
        where('email', '==', email),
        where('businessName', '==', businessName)
      )
      const querySnapshot = await getDocs(q)
      return !querySnapshot.empty
    } catch (error) {
      console.error('Error checking business:', error)
      return false
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File ${file.name} is too large. Maximum size is 5MB.`)
        return false
      }
      if (!file.type.startsWith('image/')) {
        setError(`File ${file.name} is not an image. Please upload image files only.`)
        return false
      }
      return true
    })

    if (screenshots.length + validFiles.length > MAX_SCREENSHOTS) {
      setError(`You can only upload up to ${MAX_SCREENSHOTS} screenshots.`)
      return
    }

    setError('')
    setScreenshots(prev => [...prev, ...validFiles])
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  function removeScreenshot(index: number) {
    setScreenshots(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    
    if (!email || !businessName) {
      setError('Email and business name are required.')
      return
    }

    if (screenshots.length < 7) {
      setError('Please upload at least 7 screenshots to submit.')
      return
    }

    const businessExists = await checkBusinessExists()
    if (!businessExists) {
      setError('Business not found or email does not match.')
      return
    }

    setLoading(true)

    try {
      // Update business referral count
      const businessesRef = collection(db, 'businesses')
      const businessQuery = query(
        businessesRef,
        where('email', '==', email),
        where('businessName', '==', businessName)
      )
      const querySnapshot = await getDocs(businessQuery)
      
      if (!querySnapshot.empty) {
        const businessDoc = doc(db, 'businesses', querySnapshot.docs[0].id)
        const currentCount = querySnapshot.docs[0].data().referralCount || 0
        const newCount = currentCount + screenshots.length
        
        await updateDoc(businessDoc, {
          referralCount: newCount,
          lastReferralAt: serverTimestamp(),
          priorityRanking: newCount >= 10 ? 'high' : newCount >= 5 ? 'medium' : 'normal'
        })

        // Send confirmation email
        const emailSent = await sendPriorityConfirmationEmail({
          to: email,
          businessName: businessName,
          referralCount: newCount
        })

        if (emailSent) {
          setSuccess(true)
          setReferralCount(newCount)
        } else {
          setError('Failed to send confirmation email. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error submitting screenshots:', error)
      setError('Failed to submit screenshots. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-14">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-10 text-center">
              <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Screenshots Submitted Successfully!
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for referring our website! Your business "{businessName}" is now ranked in priority.
              </p>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-900">{referralCount}</span>
                  <span className="text-gray-600">Total Referrals</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <span className="text-lg font-semibold text-emerald-600">
                    {referralCount >= 10 ? 'High Priority Ranking!' : 
                     referralCount >= 5 ? 'Medium Priority' : 'Normal Priority'}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-8">
                Your business will appear higher in search results. Keep referring to improve your ranking!
              </p>
              
              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
              >
                Back to Home
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
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Boost Your Business Ranking
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Refer our website to get priority ranking on Google. Upload screenshots to prove you referred us!
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8">
              {/* Business Info */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Business Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Your Business Name"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Screenshot Upload */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Upload Screenshots ({screenshots.length}/{MAX_SCREENSHOTS})
                </h2>
                <p className="text-gray-600 mb-6">
                  Upload at least 7 screenshots showing that you referred our website to others. 
                  Each screenshot should include proof of referral.
                </p>
                
                <div
                  className="border-3 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-blue-400') }}
                  onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-blue-400') }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.remove('border-blue-400')
                    const files = Array.from(e.dataTransfer.files)
                    // Handle dropped files
                    const event = { target: { files } } as React.ChangeEvent<HTMLInputElement>
                    handleFileSelect(event)
                  }}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF up to 5MB each
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Previews */}
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeScreenshot(index)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <p className="text-red-600 font-medium">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || screenshots.length < 7}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors text-lg flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting Screenshots...
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6" />
                      Submit Screenshots for Priority Ranking
                    </>
                  )}
                </button>
                
                <p className="text-center text-sm text-gray-500 mt-4">
                  By submitting, you confirm that these screenshots show genuine referrals to our website.
                </p>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </>
    )
  }
}
