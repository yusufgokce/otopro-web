'use server'

import { createClient } from '@/lib/supabase/server'
import type { BookingPayload } from '@/lib/types/booking'

interface BookingResult {
  success: boolean
  bookingId?: string
  error?: string
}

export async function createBooking(payload: BookingPayload): Promise<BookingResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Find or create vehicle
  const { data: existing } = await supabase
    .from('vehicles')
    .select('id')
    .eq('user_id', user.id)
    .eq('make', payload.vehicleMake)
    .eq('model', payload.vehicleModel)
    .eq('year', payload.vehicleYear)
    .limit(1)

  let vehicleId: string

  if (existing && existing.length > 0) {
    vehicleId = existing[0].id
  } else {
    const { data: vehicle, error: vehicleErr } = await supabase
      .from('vehicles')
      .insert({
        user_id: user.id,
        make: payload.vehicleMake,
        model: payload.vehicleModel,
        year: payload.vehicleYear,
        color: payload.vehicleColor,
        body_style: payload.bodyStyle,
      })
      .select('id')
      .single()

    if (vehicleErr) return { success: false, error: 'Failed to save vehicle' }
    vehicleId = vehicle.id
  }

  // Save address
  const { data: address } = await supabase
    .from('addresses')
    .insert({
      user_id: user.id,
      label: 'Home',
      street_address: payload.streetAddress,
      city: payload.city,
      province: payload.province,
      postal_code: payload.postalCode,
      is_primary: true,
    })
    .select('id')
    .single()

  // Create detailing session
  const { data: session, error: sessionErr } = await supabase
    .from('detailing_sessions')
    .insert({
      customer_id: user.id,
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
      service_address_id: address?.id || null,
      service_address_label: 'Home',
      service_address_street: payload.streetAddress,
      service_address_city: payload.city,
      service_address_province: payload.province,
      service_address_postal: payload.postalCode,
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
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data, error } = await supabase.functions.invoke(
    'create-payment-intent',
    { body: { sessionId, amount } },
  )

  if (error || !data) {
    return {
      success: false,
      error: (data as Record<string, string>)?.error || 'Failed to create payment intent',
    }
  }

  return {
    success: true,
    clientSecret: data.clientSecret,
    paymentIntentId: data.paymentIntentId,
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

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('detailing_sessions')
    .update({
      deposit_paid: true,
      stripe_deposit_payment_id: paymentIntentId,
      current_status: 'confirmed',
    })
    .eq('id', sessionId)
    .eq('customer_id', user.id)

  if (error) return { success: false, error: 'Failed to update payment status' }
  return { success: true }
}
