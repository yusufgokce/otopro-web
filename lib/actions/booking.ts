'use server'

import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import type { BookingPayload } from '@/lib/types/booking'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

interface BookingResult {
  success: boolean
  bookingId?: string
  error?: string
}

export async function createBooking(payload: BookingPayload): Promise<BookingResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id ?? null

  let vehicleId: string | null = null

  // Only save vehicle to DB if user is authenticated
  if (userId) {
    const { data: existing } = await supabase
      .from('vehicles')
      .select('id')
      .eq('user_id', userId)
      .eq('make', payload.vehicleMake)
      .eq('model', payload.vehicleModel)
      .eq('year', payload.vehicleYear)
      .limit(1)

    if (existing && existing.length > 0) {
      vehicleId = existing[0].id
    } else {
      const { data: vehicle } = await supabase
        .from('vehicles')
        .insert({
          user_id: userId,
          make: payload.vehicleMake,
          model: payload.vehicleModel,
          year: payload.vehicleYear,
          color: payload.vehicleColor,
          body_style: payload.bodyStyle,
        })
        .select('id')
        .single()

      vehicleId = vehicle?.id ?? null
    }
  }

  // Save address if authenticated
  let addressId: string | null = null
  if (userId) {
    const { data: address } = await supabase
      .from('addresses')
      .insert({
        user_id: userId,
        label: 'Home',
        street_address: payload.streetAddress,
        city: payload.city,
        province: payload.province,
        postal_code: payload.postalCode,
        is_primary: true,
      })
      .select('id')
      .single()

    addressId = address?.id ?? null
  }

  // Create detailing session (works for both guest and authenticated users)
  const { data: session, error: sessionErr } = await supabase
    .from('detailing_sessions')
    .insert({
      customer_id: userId,
      vehicle_id: vehicleId,
      service_type_id: payload.serviceTypeId,
      scheduled_date: payload.scheduledDate,
      scheduled_time: payload.scheduledTime + ':00',
      base_price: payload.basePrice,
      body_style_surcharge: payload.bodyStyleSurcharge,
      total_price: payload.totalPrice,
      deposit_amount: payload.depositAmount,
      current_status: 'pending',
      special_requests: payload.specialRequests || null,
      service_address_id: addressId,
      service_address_label: 'Home',
      service_address_street: payload.streetAddress,
      service_address_city: payload.city,
      service_address_province: payload.province,
      service_address_postal: payload.postalCode,
      // guest_email is only set for unauthenticated bookings.
      // Requires a guest_email TEXT column on detailing_sessions — see DB note below.
      guest_email: userId ? null : (payload.guestEmail ?? null),
    })
    .select('id')
    .single()

  if (sessionErr) return { success: false, error: 'Failed to create booking' }

  return { success: true, bookingId: session.id }
}

// --------------- Stripe Payment ---------------

interface PaymentIntentResult {
  success: boolean
  clientSecret?: string
  paymentIntentId?: string
  error?: string
}

export async function createPaymentIntent(
  sessionId: string,
  amount: number,
): Promise<PaymentIntentResult> {
  try {
    const amountInCents = Math.round(amount * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'cad',
      metadata: { sessionId },
      automatic_payment_methods: { enabled: true },
    })

    return {
      success: true,
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    }
  } catch (err) {
    console.error('Stripe error:', err)
    return {
      success: false,
      error: 'Failed to create payment intent',
    }
  }
}

interface MarkPaidResult {
  success: boolean
  error?: string
}

export async function markDepositPaid(
  sessionId: string,
  paymentIntentId: string,
): Promise<MarkPaidResult> {
  const supabase = await createClient()

  // Allow both authenticated and guest users
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('detailing_sessions')
    .update({
      deposit_paid: true,
      stripe_deposit_payment_id: paymentIntentId,
      current_status: 'confirmed',
    })
    .eq('id', sessionId)

  // If authenticated, scope to user; otherwise just match session ID
  if (user) {
    query = query.eq('customer_id', user.id)
  }

  const { error } = await query

  if (error) return { success: false, error: 'Failed to update payment status' }
  return { success: true }
}

// --------------- Reschedule ---------------

const MAX_RESCHEDULES = 2
const RESCHEDULE_WINDOW_DAYS = 30
const MIN_NOTICE_HOURS = 24

interface RescheduleResult {
  success: boolean
  error?: string
}

export async function rescheduleBooking(
  sessionId: string,
  newDate: string,
  newTime: string,
): Promise<RescheduleResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'You must be signed in to reschedule.' }
  }

  // Fetch the booking and verify ownership
  const { data: booking, error: fetchErr } = await supabase
    .from('detailing_sessions')
    .select('id, customer_id, scheduled_date, scheduled_time, created_at, reschedule_count')
    .eq('id', sessionId)
    .single()

  if (fetchErr || !booking) {
    return { success: false, error: 'Booking not found.' }
  }

  if (booking.customer_id !== user.id) {
    return { success: false, error: 'You do not own this booking.' }
  }

  const rescheduleCount = booking.reschedule_count ?? 0

  // Check max reschedules
  if (rescheduleCount >= MAX_RESCHEDULES) {
    return {
      success: false,
      error: `You have already used all ${MAX_RESCHEDULES} reschedules for this booking.`,
    }
  }

  // Check 24-hour notice before current appointment
  const currentAppointment = new Date(
    `${booking.scheduled_date}T${booking.scheduled_time}`,
  )
  const now = new Date()
  const hoursUntilCurrent =
    (currentAppointment.getTime() - now.getTime()) / (1000 * 60 * 60)

  if (hoursUntilCurrent < MIN_NOTICE_HOURS) {
    return {
      success: false,
      error: 'You must provide at least 24 hours notice before your current appointment to reschedule.',
    }
  }

  // Check 30-day window from original creation
  const originalCreation = new Date(booking.created_at)
  const newAppointmentDate = new Date(`${newDate}T${newTime}`)
  const windowEnd = new Date(originalCreation)
  windowEnd.setDate(windowEnd.getDate() + RESCHEDULE_WINDOW_DAYS)

  if (newAppointmentDate > windowEnd) {
    return {
      success: false,
      error: `You cannot reschedule to a date beyond 30 days from your original booking.`,
    }
  }

  // Update the booking
  const { error: updateErr } = await supabase
    .from('detailing_sessions')
    .update({
      scheduled_date: newDate,
      scheduled_time: newTime + ':00',
      reschedule_count: rescheduleCount + 1,
    })
    .eq('id', sessionId)
    .eq('customer_id', user.id)

  if (updateErr) {
    return { success: false, error: 'Failed to reschedule booking. Please try again.' }
  }

  return { success: true }
}
