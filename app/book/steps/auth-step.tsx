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
  onBookingComplete: () => void
}

const inputClass =
  'w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-[#6B4EFF] focus:outline-none focus:ring-1 focus:ring-[#6B4EFF]/50 transition-colors'

const labelClass = 'block text-sm text-white/60 mb-1.5'

export function AuthStep({
  state,
  dispatch,
  surcharge,
  totalPrice,
  depositAmount,
  onBookingComplete,
}: Props) {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  // Sign up fields
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

    if (result.success) {
      onBookingComplete()
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
      <p className="text-white/50 text-center mb-8">
        Create an account or sign in to confirm your booking
      </p>

      {/* Toggle */}
      <div className="flex bg-white/[0.04] rounded-xl p-1 mb-8">
        <button
          onClick={() => { setMode('signup'); setError('') }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            mode === 'signup'
              ? 'bg-[#6B4EFF] text-white'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          Sign Up
        </button>
        <button
          onClick={() => { setMode('signin'); setError('') }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            mode === 'signin'
              ? 'bg-[#6B4EFF] text-white'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          Sign In
        </button>
      </div>

      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
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
          className="w-full mt-6 py-3.5 rounded-xl text-sm font-semibold bg-[#6B4EFF] hover:bg-[#5A3EEE] disabled:opacity-50 transition-colors"
        >
          {isPending
            ? 'Processing...'
            : mode === 'signup'
              ? 'Create Account & Book'
              : 'Sign In & Book'}
        </button>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => dispatch({ type: 'PREV_STEP' })}
          className="w-full px-6 py-3 rounded-xl text-sm font-medium bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-center"
        >
          Back to Review
        </button>
      </div>
    </div>
  )
}
