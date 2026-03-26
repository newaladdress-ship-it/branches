// Email service - simplified for development
export interface EmailData {
  to: string
  businessName: string
  businessId: string
}

export interface PriorityEmailData {
  to: string
  businessName: string
  referralCount: number
}

export interface ContactEmailData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export interface PriorityRequestEmailData {
  businessName: string
  contactPerson: string
  email: string
  phone: string
  city: string
  currentListing: string
  message: string
}

// Send thank you email with referral request
export async function sendBusinessSubmissionEmail(data: EmailData) {
  try {
    console.log('📧 SENDING BUSINESS SUBMISSION EMAIL:', {
      to: data.to,
      businessName: data.businessName,
      businessId: data.businessId,
      referralLink: `${typeof window !== 'undefined' ? window.location.origin : ''}/priority?email=${encodeURIComponent(data.to)}&business=${encodeURIComponent(data.businessName)}`,
    })
    
    // Simulate email sending for now
    // In production, integrate with EmailJS or SendGrid
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('✅ Business submission email sent successfully')
    return true
  } catch (error) {
    console.error('❌ Email sending error:', error)
    return false
  }
}

// Send priority confirmation email
export async function sendPriorityConfirmationEmail(data: PriorityEmailData) {
  try {
    console.log('📧 SENDING PRIORITY CONFIRMATION EMAIL:', {
      to: data.to,
      businessName: data.businessName,
      referralCount: data.referralCount,
    })
    
    // Simulate email sending for now
    // In production, integrate with EmailJS or SendGrid
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('✅ Priority confirmation email sent successfully')
    return true
  } catch (error) {
    console.error('❌ Email sending error:', error)
    return false
  }
}

// Send contact form email
export async function sendContactEmail(data: ContactEmailData) {
  try {
    console.log('📧 SENDING CONTACT EMAIL:', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    })
    
    // Simulate email sending for now
    // In production, integrate with EmailJS or SendGrid
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('✅ Contact email sent successfully')
    return true
  } catch (error) {
    console.error('❌ Email sending error:', error)
    return false
  }
}

// Send priority request email
export async function sendPriorityRequestEmail(data: PriorityRequestEmailData) {
  try {
    console.log('📧 SENDING PRIORITY REQUEST EMAIL:', {
      businessName: data.businessName,
      contactPerson: data.contactPerson,
      email: data.email,
      phone: data.phone,
      city: data.city,
      currentListing: data.currentListing,
      message: data.message,
    })
    
    // Simulate email sending for now
    // In production, integrate with EmailJS or SendGrid
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('✅ Priority request email sent successfully')
    return true
  } catch (error) {
    console.error('❌ Email sending error:', error)
    return false
  }
}
