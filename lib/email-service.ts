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
