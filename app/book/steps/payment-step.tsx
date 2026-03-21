'use client'

import { useState, useEffect, useCallback } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { createPaymentIntent, markDepositPaid } from '@/lib/actions/booking'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
)

// ---------- Inner form (must live inside <Elements>) ----------

interface PaymentFormProps {
  bookingId: string
  paymentIntentId: string
  depositAmount: number
  onPaymentComplete: () => void
}

function PaymentForm({
  bookingId,
  paymentIntentId,
  depositAmount,
  onPaymentComplete,
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    setError('')

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/book`,
      },
      redirect: 'if_required',
    })

    if (stripeError) {
      setError(stripeError.message || 'Payment failed')
      setProcessing(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      const result = await markDepositPaid(bookingId, paymentIntentId)
      if (!result.success) {
        setError(result.error || 'Payment succeeded but failed to update booking')
        setProcessing(false)
        return
      }
      onPaymentComplete()
    } else {
      setError('Payment was not completed. Please try again.')
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />

      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full mt-6 py-3.5 rounded-xl text-sm font-semibold bg-accent-blue-500 hover:bg-accent-blue-600 text-white disabled:opacity-50 transition-colors"
      >
        {processing ? 'Processing...' : `Pay Deposit — $${depositAmount.toFixed(2)}`}
      </button>
    </form>
  )
}

// ---------- Outer wrapper ----------

interface Props {
  bookingId: string
  depositAmount: number
  totalPrice: number
  onPaymentComplete: () => void
}

export function PaymentStep({
  bookingId,
  depositAmount,
  totalPrice,
  onPaymentComplete,
}: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const initPayment = useCallback(async () => {
    setLoading(true)
    setError('')

    const result = await createPaymentIntent(bookingId, depositAmount)

    if (!result.success || !result.clientSecret) {
      setError(result.error || 'Failed to initialise payment')
      setLoading(false)
      return
    }

    setClientSecret(result.clientSecret)
    setPaymentIntentId(result.paymentIntentId!)
    setLoading(false)
  }, [bookingId, depositAmount])

  useEffect(() => {
    initPayment()
  }, [initPayment])

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-2">Pay deposit</h1>
      <p className="text-dark-silver text-center mb-8">
        A 30% deposit secures your appointment. The remaining balance is collected at
        service.
      </p>

      {/* Price summary */}
      <div className="bg-surface-widget border border-dark-grey rounded-2xl p-5 mb-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-dark-silver">Service total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold text-accent-blue-500">
          <span>Due today (30% deposit)</span>
          <span>${depositAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-grey">
          <span>Due at appointment</span>
          <span>${(totalPrice - depositAmount).toFixed(2)}</span>
        </div>
      </div>

      {/* Stripe Elements */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-accent-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-dark-silver text-sm">Setting up payment...</span>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-10">
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button
            onClick={initPayment}
            className="px-6 py-2.5 rounded-xl text-sm font-medium bg-surface-widget border border-dark-grey hover:bg-surface-widget-hover transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {clientSecret && paymentIntentId && !loading && (
        <div className="bg-surface-widget border border-dark-grey rounded-2xl p-6">
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'night',
                variables: {
                  colorPrimary: '#3A82FF',
                  colorBackground: 'rgb(28, 28, 28)',
                  colorText: '#FFFFFF',
                  colorTextSecondary: '#a9a6a4',
                  colorDanger: 'rgb(232, 107, 89)',
                  fontFamily: 'Jost, sans-serif',
                  borderRadius: '12px',
                  spacingUnit: '4px',
                },
                rules: {
                  '.Input': {
                    backgroundColor: 'rgb(13, 13, 13)',
                    border: '1px solid rgb(46, 46, 46)',
                  },
                  '.Input:focus': {
                    borderColor: '#3A82FF',
                    boxShadow: '0 0 0 1px rgba(58,130,255,0.5)',
                  },
                  '.Label': {
                    color: '#a9a6a4',
                  },
                },
              },
            }}
          >
            <PaymentForm
              bookingId={bookingId}
              paymentIntentId={paymentIntentId}
              depositAmount={depositAmount}
              onPaymentComplete={onPaymentComplete}
            />
          </Elements>
        </div>
      )}

      {/* Security badges */}
      <div className="flex items-center justify-center gap-6 mt-6 text-dark-grey text-xs">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secured by Stripe
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          256-bit SSL
        </div>
      </div>
    </div>
  )
}
