'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Format date nicely
    const dateStr = new Date(details.date + 'T00:00:00').toLocaleDateString('en-CA', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

    const { error } = await resend.emails.send({
      from: 'otopro <noreply@otopro.ca>',
      to: details.email,
      subject: `Your otopro booking is confirmed — ${details.serviceName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Booking Confirmed</h1>
          <p style="color: #6B7280; margin-bottom: 32px;">Your detailing session has been scheduled.</p>

          <div style="background: #f9fafb; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Service</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${details.serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Date</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${dateStr}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Time</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${details.time}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Location</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${details.address}</td>
              </tr>
            </table>
          </div>

          <div style="background: #f9fafb; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Total</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 700; font-size: 18px;">$${details.total.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Deposit Paid</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #16a34a;">$${details.deposit.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Due at Appointment</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">$${remaining.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <p style="color: #6B7280; font-size: 13px; line-height: 1.6;">
            Free cancellation is available within 48 hours of booking. You can reschedule up to 2 times at no charge.
          </p>
          <p style="color: #6B7280; font-size: 13px; margin-top: 16px;">
            Booking ID: <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${details.bookingId}</code>
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
          <p style="color: #9CA3AF; font-size: 12px;">otopro — Professional car detailing, delivered.</p>
        </div>
      `,
    })

    if (error) {
      console.error('[otopro] Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('[otopro] Failed to send booking confirmation email:', err)
    return { success: false, error: 'Failed to send confirmation email' }
  }
}
