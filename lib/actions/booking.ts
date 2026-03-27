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

  // Save address if authenticated (dedup by street + city + province)
  let addressId: string | null = null
  if (userId) {
    const { data: existingAddr } = await supabase
      .from('addresses')
      .select('id')
      .eq('user_id', userId)
      .eq('street_address', payload.streetAddress)
      .eq('city', payload.city)
      .eq('province', payload.province)
      .limit(1)

    if (existingAddr && existingAddr.length > 0) {
      addressId = existingAddr[0].id
    } else {
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
  }

  // --- Server-side price computation ---
  // Fetch base_price from DB for the selected service type
  const { data: serviceType, error: serviceTypeErr } = await supabase
    .from('service_types')
    .select('base_price')
    .eq('id', payload.serviceTypeId)
    .single()

  if (serviceTypeErr || !serviceType) {
    return { success: false, error: 'Invalid service type' }
  }

  // Fetch surcharge from DB for the selected body style
  const { data: bodyStylePricing, error: bodyStyleErr } = await supabase
    .from('body_style_pricing')
    .select('surcharge')
    .eq('body_style', payload.bodyStyle)
    .single()

  if (bodyStyleErr || !bodyStylePricing) {
    return { success: false, error: 'Invalid body style' }
  }

  const basePrice = serviceType.base_price
  const bodyStyleSurcharge = bodyStylePricing.surcharge
  const totalPrice = basePrice + bodyStyleSurcharge
  const depositAmount = Math.round(totalPrice * 0.3 * 100) / 100

  // Create detailing session (works for both guest and authenticated users)
  const { data: session, error: sessionErr } = await supabase
    .from('detailing_sessions')
    .insert({
      customer_id: userId,
      vehicle_id: vehicleId,
      service_type_id: payload.serviceTypeId,
      scheduled_date: payload.scheduledDate,
      scheduled_time: payload.scheduledTime + ':00',
      base_price: basePrice,
      body_style_surcharge: bodyStyleSurcharge,
      total_price: totalPrice,
      deposit_amount: depositAmount,
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
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch booking from DB to get the server-side deposit amount
    const { data: booking, error: bookingErr } = await supabase
      .from('detailing_sessions')
      .select('id, customer_id, deposit_amount, total_price, current_status, stripe_deposit_payment_id, guest_email')
      .eq('id', sessionId)
      .single()

    if (bookingErr || !booking) {
      return { success: false, error: 'Booking not found' }
    }

    // Verify ownership: must be the authenticated user's booking, or a guest booking
    if (booking.customer_id && (!user || booking.customer_id !== user.id)) {
      return { success: false, error: 'Unauthorized' }
    }

    // Don't allow payment on already-confirmed bookings
    if (booking.current_status !== 'pending') {
      return { success: false, error: 'Booking is not in a payable state' }
    }

    // Idempotency: if a PaymentIntent already exists, retrieve it instead of creating a new one
    if (booking.stripe_deposit_payment_id) {
      const existingIntent = await stripe.paymentIntents.retrieve(booking.stripe_deposit_payment_id)
      return {
        success: true,
        clientSecret: existingIntent.client_secret!,
        paymentIntentId: existingIntent.id,
      }
    }

    // Use the DB's deposit_amount, not the client-provided amount
    const amountInCents = Math.round(booking.deposit_amount * 100)

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountInCents,
        currency: 'cad',
        metadata: { sessionId },
        automatic_payment_methods: { enabled: true },
      },
      {
        idempotencyKey: `booking-${sessionId}`,
      },
    )

    // Store the PaymentIntent ID on the booking row immediately
    await supabase
      .from('detailing_sessions')
      .update({ stripe_deposit_payment_id: paymentIntent.id })
      .eq('id', sessionId)

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

  // Fetch the booking to check current state
  let bookingQuery = supabase
    .from('detailing_sessions')
    .select('id, customer_id, deposit_amount, deposit_paid')
    .eq('id', sessionId)

  if (user) {
    bookingQuery = bookingQuery.eq('customer_id', user.id)
  }

  const { data: booking, error: bookingErr } = await bookingQuery.single()

  if (bookingErr || !booking) {
    return { success: false, error: 'Booking not found' }
  }

  // Idempotent: if already marked as paid, return success
  if (booking.deposit_paid) {
    return { success: true }
  }

  // Verify the payment with Stripe API — don't trust the client
  let paymentIntent: Stripe.PaymentIntent
  try {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  } catch {
    return { success: false, error: 'Invalid payment intent' }
  }

  if (paymentIntent.status !== 'succeeded') {
    return { success: false, error: 'Payment has not succeeded' }
  }

  if (paymentIntent.metadata.sessionId !== sessionId) {
    return { success: false, error: 'Payment intent does not match this booking' }
  }

  const expectedAmountCents = Math.round(booking.deposit_amount * 100)
  if (paymentIntent.amount !== expectedAmountCents) {
    return { success: false, error: 'Payment amount does not match expected deposit' }
  }

  // All checks passed — update the DB
  const { error } = await supabase
    .from('detailing_sessions')
    .update({
      deposit_paid: true,
      stripe_deposit_payment_id: paymentIntentId,
      current_status: 'confirmed',
    })
    .eq('id', sessionId)

  if (error) return { success: false, error: 'Failed to update payment status' }
  return { success: true }
}

// --------------- Cancel Booking ---------------

const CANCEL_WINDOW_HOURS = 48

interface CancelResult {
  success: boolean
  error?: string
}

export async function cancelBooking(sessionId: string): Promise<CancelResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'You must be signed in to cancel a booking.' }
  }

  // Fetch the booking
  const { data: booking, error: fetchErr } = await supabase
    .from('detailing_sessions')
    .select('id, customer_id, current_status, deposit_paid, stripe_deposit_payment_id, created_at')
    .eq('id', sessionId)
    .single()

  if (fetchErr || !booking) {
    return { success: false, error: 'Booking not found.' }
  }

  if (booking.customer_id !== user.id) {
    return { success: false, error: 'You do not own this booking.' }
  }

  // Only confirmed or pending bookings can be cancelled
  if (!['confirmed', 'pending'].includes(booking.current_status)) {
    return { success: false, error: 'This booking cannot be cancelled.' }
  }

  // Check 48-hour cancellation window from creation
  const createdAt = new Date(booking.created_at)
  const now = new Date()
  const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)

  if (hoursSinceCreation > CANCEL_WINDOW_HOURS) {
    return {
      success: false,
      error: `Free cancellation is only available within the first ${CANCEL_WINDOW_HOURS} hours of booking. Please contact support for assistance.`,
    }
  }

  // If deposit was paid, issue a Stripe refund
  if (booking.deposit_paid && booking.stripe_deposit_payment_id) {
    try {
      await stripe.refunds.create({
        payment_intent: booking.stripe_deposit_payment_id,
      })
    } catch (err) {
      console.error('Stripe refund error:', err)
      return { success: false, error: 'Failed to process refund. Please contact support.' }
    }
  }

  // Update booking status
  const { error: updateErr } = await supabase
    .from('detailing_sessions')
    .update({
      current_status: 'cancelled',
    })
    .eq('id', sessionId)
    .eq('customer_id', user.id)

  if (updateErr) {
    return { success: false, error: 'Failed to cancel booking. Please try again.' }
  }

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
    .select('id, customer_id, current_status, scheduled_date, scheduled_time, created_at, reschedule_count')
    .eq('id', sessionId)
    .single()

  if (fetchErr || !booking) {
    return { success: false, error: 'Booking not found.' }
  }

  if (booking.customer_id !== user.id) {
    return { success: false, error: 'You do not own this booking.' }
  }

  // Only confirmed or pending bookings can be rescheduled
  if (!['confirmed', 'pending'].includes(booking.current_status)) {
    return { success: false, error: 'This booking cannot be rescheduled.' }
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
