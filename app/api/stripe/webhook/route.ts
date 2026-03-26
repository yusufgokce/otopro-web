import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { sendBookingConfirmation, type BookingEmailDetails } from '@/lib/actions/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

/**
 * Look up a detailing session by stripe_deposit_payment_id first,
 * then fall back to metadata.sessionId. When the fallback matches,
 * stripe_deposit_payment_id is back-filled on the row.
 */
async function findSessionByPaymentIntent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  paymentIntentId: string,
  metadata: Stripe.Metadata,
) {
  // Primary: match by stripe_deposit_payment_id
  const { data: primary, error: primaryError } = await supabase
    .from('detailing_sessions')
    .select('*')
    .eq('stripe_deposit_payment_id', paymentIntentId)

  if (primaryError) {
    console.error('[stripe/webhook] Primary lookup failed:', primaryError)
    return { session: null, error: primaryError }
  }

  if (primary && primary.length > 0) {
    return { session: primary[0], error: null, matchedVia: 'stripe_deposit_payment_id' as const }
  }

  // Fallback: match by metadata.sessionId
  const sessionId = metadata?.sessionId
  if (!sessionId) {
    return { session: null, error: null, matchedVia: null }
  }

  const { data: fallback, error: fallbackError } = await supabase
    .from('detailing_sessions')
    .select('*')
    .eq('id', sessionId)

  if (fallbackError) {
    console.error('[stripe/webhook] Fallback lookup by sessionId failed:', fallbackError)
    return { session: null, error: fallbackError }
  }

  if (fallback && fallback.length > 0) {
    // Back-fill the stripe_deposit_payment_id so future lookups use the primary path
    await supabase
      .from('detailing_sessions')
      .update({ stripe_deposit_payment_id: paymentIntentId })
      .eq('id', sessionId)

    return { session: fallback[0], error: null, matchedVia: 'metadata.sessionId' as const }
  }

  return { session: null, error: null, matchedVia: null }
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event: Stripe.Event

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    // Block unsigned webhooks in production
    if (process.env.NODE_ENV === 'production') {
      console.error('[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set in production — rejecting request.')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    console.warn(
      '[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set — skipping signature verification (dev only).'
    )
    try {
      event = JSON.parse(body) as Stripe.Event
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
  } else {
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('[stripe/webhook] Signature verification failed:', message)
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${message}` },
        { status: 400 }
      )
    }
  }

  const supabase = await createClient()

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      // Find the booking (primary lookup + metadata fallback)
      const { session: booking, error: lookupError } = await findSessionByPaymentIntent(
        supabase,
        paymentIntent.id,
        paymentIntent.metadata,
      )

      if (lookupError) {
        console.error('[stripe/webhook] payment_intent.succeeded — lookup failed:', lookupError)
        return NextResponse.json({ error: 'Database lookup failed' }, { status: 500 })
      }

      if (!booking) {
        console.error('[stripe/webhook] payment_intent.succeeded — no matching session for:', paymentIntent.id)
        return NextResponse.json({ error: 'No matching booking found' }, { status: 404 })
      }

      // Idempotency: skip if already confirmed
      if (booking.deposit_paid === true) {
        console.log('[stripe/webhook] payment_intent.succeeded — already confirmed, skipping:', paymentIntent.id)
        return NextResponse.json({ received: true })
      }

      // Amount verification (warn only — don't block)
      if (booking.deposit_amount != null) {
        const expectedAmount = Math.round(booking.deposit_amount * 100)
        if (paymentIntent.amount !== expectedAmount) {
          console.warn(
            `[stripe/webhook] payment_intent.succeeded — amount mismatch: ` +
            `Stripe=${paymentIntent.amount}, expected=${expectedAmount} (booking ${booking.id})`
          )
        }
      }

      // Confirm the booking
      const { error: updateError } = await supabase
        .from('detailing_sessions')
        .update({ deposit_paid: true, current_status: 'confirmed' })
        .eq('id', booking.id)

      if (updateError) {
        console.error('[stripe/webhook] payment_intent.succeeded — DB update failed:', updateError)
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
      }

      console.log('[stripe/webhook] payment_intent.succeeded — session confirmed for:', paymentIntent.id)

      // Send confirmation email (non-blocking — failure should not fail the webhook)
      try {
        // Fetch service name via service_type join
        const { data: fullBooking } = await supabase
          .from('detailing_sessions')
          .select('*, service_types(name)')
          .eq('id', booking.id)
          .single()

        let recipientEmail: string | null = null

        if (fullBooking?.customer_id) {
          const { data: user } = await supabase
            .from('users')
            .select('email')
            .eq('id', fullBooking.customer_id)
            .single()
          recipientEmail = user?.email ?? null
        } else {
          recipientEmail = fullBooking?.guest_email ?? null
        }

        if (recipientEmail && fullBooking) {
          const serviceName =
            (fullBooking.service_types as { name?: string } | null)?.name ?? 'Detailing Service'

          const emailDetails: BookingEmailDetails = {
            bookingId: fullBooking.id,
            email: recipientEmail,
            serviceName,
            date: fullBooking.scheduled_date ?? '',
            time: fullBooking.scheduled_time ?? '',
            address: [fullBooking.service_address_street, fullBooking.service_address_city, fullBooking.service_address_province, fullBooking.service_address_postal].filter(Boolean).join(', '),
            total: fullBooking.total_price ?? 0,
            deposit: fullBooking.deposit_amount ?? 0,
          }

          const emailResult = await sendBookingConfirmation(emailDetails)
          if (!emailResult.success) {
            console.warn('[stripe/webhook] Confirmation email failed (non-fatal):', emailResult.error)
          }
        } else {
          console.warn('[stripe/webhook] No recipient email found for booking:', booking.id)
        }
      } catch (emailErr) {
        console.warn('[stripe/webhook] Confirmation email error (non-fatal):', emailErr)
      }

      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      const { session: booking, error: lookupError } = await findSessionByPaymentIntent(
        supabase,
        paymentIntent.id,
        paymentIntent.metadata,
      )

      if (lookupError) {
        console.error('[stripe/webhook] payment_intent.payment_failed — lookup failed:', lookupError)
        return NextResponse.json({ error: 'Database lookup failed' }, { status: 500 })
      }

      if (!booking) {
        console.warn('[stripe/webhook] payment_intent.payment_failed — no matching session for:', paymentIntent.id)
        break
      }

      const { error } = await supabase
        .from('detailing_sessions')
        .update({ current_status: 'payment_failed' })
        .eq('id', booking.id)

      if (error) {
        console.error('[stripe/webhook] payment_intent.payment_failed — DB update failed:', error)
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
      }

      console.log('[stripe/webhook] payment_intent.payment_failed — status updated for:', paymentIntent.id)
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      const paymentIntentId = charge.payment_intent

      if (!paymentIntentId) {
        console.warn('[stripe/webhook] charge.refunded — no payment_intent on charge:', charge.id)
        break
      }

      // For charge.refunded, retrieve the full PaymentIntent to get metadata
      let piMetadata: Stripe.Metadata = {}
      try {
        const pi = await stripe.paymentIntents.retrieve(paymentIntentId as string)
        piMetadata = pi.metadata
      } catch (err) {
        console.warn('[stripe/webhook] charge.refunded — could not retrieve PaymentIntent metadata:', err)
      }

      const { session: booking, error: lookupError } = await findSessionByPaymentIntent(
        supabase,
        paymentIntentId as string,
        piMetadata,
      )

      if (lookupError) {
        console.error('[stripe/webhook] charge.refunded — lookup failed:', lookupError)
        return NextResponse.json({ error: 'Database lookup failed' }, { status: 500 })
      }

      if (!booking) {
        console.warn('[stripe/webhook] charge.refunded — no matching session for payment_intent:', paymentIntentId)
        break
      }

      const { error } = await supabase
        .from('detailing_sessions')
        .update({ current_status: 'refunded' })
        .eq('id', booking.id)

      if (error) {
        console.error('[stripe/webhook] charge.refunded — DB update failed:', error)
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
      }

      console.log('[stripe/webhook] charge.refunded — status updated for payment_intent:', paymentIntentId)
      break
    }

    default:
      // Unhandled event type — acknowledge receipt without processing
      break
  }

  return NextResponse.json({ received: true })
}
