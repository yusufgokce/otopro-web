'use client'

import { useState, useTransition } from 'react'
import type { WizardState, WizardAction } from '@/lib/types/booking'
import { signUp, signIn } from '@/lib/actions/auth'
import { createBooking } from '@/lib/actions/booking'

interface Props {
  state: WizardState
  dispatch: React.Dispatch<WizardAction>
  surcharge: number
  totalPrice: number
  depositAmount: number
  onBookingCreated: (bookingId: string) => void
}

const inputClass =
  'w-full bg-dune border border-dark-grey rounded-xl px-4 py-3 text-white placeholder:text-grey focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-colors'

const labelClass = 'block text-sm text-dark-silver mb-1.5'

export function AuthStep({
  state,
  dispatch,
  surcharge,
  totalPrice,
  depositAmount,
  onBookingCreated,
}: Props) {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  async function submitBooking() {
    const result = await createBooking({
      vehicleMake: state.vehicleMake,
      vehicleModel: state.vehicleModel,
      vehicleYear: parseInt(state.vehicleYear),
      vehicleColor: state.vehicleColor,
      bodyStyle: state.bodyStyle!,
      serviceTypeId: state.selectedService!.id,
      scheduledDate: state.selectedDate!,
      scheduledTime: state.selectedTime!,
      streetAddress: state.streetAddress,
      city: state.city,
      province: state.province,
      postalCode: state.postalCode,
      specialRequests: state.specialRequests,
      basePrice: state.selectedService!.base_price,
      bodyStyleSurcharge: surcharge,
      totalPrice,
      depositAmount,
    })

    if (result.success && result.bookingId) {
      onBookingCreated(result.bookingId)
    } else {
      setError(result.error || 'Failed to create booking')
    }
  }

  function handleSignUp() {
    if (!fullName.trim() || !email.trim() || password.length < 6) {
      setError('Please fill in all required fields (password min 6 chars)')
      return
    }

    setError('')
    startTransition(async () => {
      const result = await signUp(email, password, fullName, phone || undefined)
      if (!result.success) {
        setError(result.error || 'Sign up failed')
        return
      }
      await submitBooking()
    })
  }

  function handleSignIn() {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password')
      return
    }

    setError('')
    startTransition(async () => {
      const result = await signIn(email, password)
      if (!result.success) {
        setError(result.error || 'Sign in failed')
        return
      }
      await submitBooking()
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-2">Almost there!</h1>
      <p className="text-dark-silver text-center mb-8">
        Create an account or sign in to continue to payment
      </p>

      {/* Toggle */}
      <div className="flex bg-dune rounded-xl p-1 mb-8">
        <button
          onClick={() => { setMode('signup'); setError('') }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            mode === 'signup'
              ? 'bg-gold-400 text-black'
              : 'text-dark-silver hover:text-silver'
          }`}
        >
          Sign Up
        </button>
        <button
          onClick={() => { setMode('signin'); setError('') }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            mode === 'signin'
              ? 'bg-gold-400 text-black'
              : 'text-dark-silver hover:text-silver'
          }`}
        >
          Sign In
        </button>
      </div>

      <div className="bg-dune border border-dark-grey rounded-2xl p-6">
        {mode === 'signup' ? (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                className={inputClass}
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                className={inputClass}
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Phone (optional)</label>
              <input
                className={inputClass}
                type="tel"
                placeholder="(416) 555-0123"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input
                className={inputClass}
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Email</label>
              <input
                className={inputClass}
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input
                className={inputClass}
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm mt-4">{error}</p>
        )}

        <button
          onClick={mode === 'signup' ? handleSignUp : handleSignIn}
          disabled={isPending}
          className="w-full mt-6 py-3.5 rounded-xl text-sm font-semibold bg-gold-400 hover:bg-gold-500 text-black disabled:opacity-50 transition-colors"
        >
          {isPending
            ? 'Processing...'
            : mode === 'signup'
              ? 'Create Account & Continue'
              : 'Sign In & Continue'}
        </button>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => dispatch({ type: 'PREV_STEP' })}
          className="w-full px-6 py-3 rounded-xl text-sm font-medium bg-dune border border-dark-grey hover:bg-dark-grey transition-colors text-center"
        >
          Back to Review
        </button>
      </div>
    </div>
  )
}
