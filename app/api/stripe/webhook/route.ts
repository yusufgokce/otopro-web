import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event: Stripe.Event

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.warn(
      '[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set — skipping signature verification. ' +
        'Set this env var in production.'
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
      const { error } = await supabase
        .from('detailing_sessions')
        .update({ deposit_paid: true, current_status: 'confirmed' })
        .eq('stripe_deposit_payment_id', paymentIntent.id)

      if (error) {
        console.error('[stripe/webhook] payment_intent.succeeded — DB update failed:', error)
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
      }

      console.log('[stripe/webhook] payment_intent.succeeded — session confirmed for:', paymentIntent.id)
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const { error } = await supabase
        .from('detailing_sessions')
        .update({ current_status: 'payment_failed' })
        .eq('stripe_deposit_payment_id', paymentIntent.id)

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

      const { error } = await supabase
        .from('detailing_sessions')
        .update({ current_status: 'refunded' })
        .eq('stripe_deposit_payment_id', paymentIntentId)

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
