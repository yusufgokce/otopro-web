'use server'

export interface BookingEmailDetails {
  bookingId: string
  email: string
  serviceName: string
  date: string
  time: string
  address: string
  total: number
  deposit: number
}

interface EmailResult {
  success: boolean
  error?: string
}

export async function sendBookingConfirmation(
  details: BookingEmailDetails,
): Promise<EmailResult> {
  try {
    const remaining = details.total - details.deposit

    // TODO: Connect a real email provider (e.g. Resend, SendGrid, Postmark).
    // For now, log the email payload so it can be verified end-to-end.
    console.log('[otopro] Booking confirmation email payload:', {
      to: details.email,
      subject: `Your otopro booking is confirmed — ${details.serviceName}`,
      bookingId: details.bookingId,
      service: details.serviceName,
      date: details.date,
      time: details.time,
      address: details.address,
      total: `$${details.total.toFixed(2)}`,
      depositPaid: `$${details.deposit.toFixed(2)}`,
      remainingAtAppointment: `$${remaining.toFixed(2)}`,
    })

    return { success: true }
  } catch (err) {
    console.error('[otopro] Failed to send booking confirmation email:', err)
    return { success: false, error: 'Failed to send confirmation email' }
  }
}
