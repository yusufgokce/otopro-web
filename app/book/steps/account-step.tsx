'use client'

import { useState, useTransition } from 'react'
import { signIn, signUp } from '@/lib/actions/auth'
import type { WizardAction } from '@/lib/types/booking'

type Mode = 'choose' | 'login' | 'signup' | 'guest' | 'verify-email'

interface Props {
  dispatch: React.Dispatch<WizardAction>
  onAuthenticated: () => void
  onGuest: (email: string) => void
}

export function AccountStep({ dispatch, onAuthenticated, onGuest }: Props) {
  const [mode, setMode] = useState<Mode>('choose')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleLogin() {
    setError('')
    startTransition(async () => {
      const result = await signIn(email, password)
      if (result.success) {
        onAuthenticated()
      } else {
        setError(result.error || 'Login failed')
      }
    })
  }

  function handleSignup() {
    setError('')
    if (!fullName.trim()) { setError('Name is required'); return }
    startTransition(async () => {
      const result = await signUp(email, password, fullName)
      if (result.success) {
        onAuthenticated()
      } else if (result.needsVerification) {
        setMode('verify-email')
      } else {
        setError(result.error || 'Sign up failed')
      }
    })
  }

  function handleGuest() {
    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      setError('A valid email is required for booking confirmation')
      return
    }
    onGuest(guestEmail)
  }

  function handleCheckVerification() {
    setError('')
    startTransition(async () => {
      const result = await signIn(email, password)
      if (result.success) {
        onAuthenticated()
      } else {
        setError('Email not verified yet. Please check your inbox and click the confirmation link.')
      }
    })
  }

  // ─── Verify email ───
  if (mode === 'verify-email') {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-center mb-2">Check your email</h1>
          <p className="text-dark-silver text-center mb-6">
            We sent a verification link to <strong className="text-foreground">{email}</strong>
          </p>
          <p className="text-dark-silver text-center mb-10 text-sm">
            Click the link in your email — you&apos;ll be brought back here automatically to complete your booking.
          </p>

          <div className="space-y-3 max-w-md mx-auto">
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <p className="text-[11px] text-grey text-center">
              Didn&apos;t get the email? Check your spam folder, or try again below.
            </p>
            <button
              onClick={handleCheckVerification}
              disabled={isPending}
              className="w-full py-3.5 rounded-full text-sm font-medium text-foreground-muted border border-dark-grey hover:bg-surface-widget transition-colors"
            >
              {isPending ? 'Checking...' : 'I\'ve already verified'}
            </button>
            <button
              onClick={() => { setMode('choose'); setError('') }}
              className="w-full py-3.5 rounded-full text-sm font-medium text-foreground-muted border border-dark-grey hover:bg-surface-widget transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Choose mode ───
  if (mode === 'choose') {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-center mb-2">How would you like to continue?</h1>
          <p className="text-dark-silver text-center mb-10">
            Sign in to manage bookings, reschedule, and save your vehicles
          </p>

          <div className="space-y-3 max-w-md mx-auto">
            <button
              onClick={() => { setMode('login'); setError('') }}
              className="w-full py-3.5 rounded-full text-sm font-semibold bg-accent-blue-500 hover:bg-accent-blue-600 text-white transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => { setMode('signup'); setError('') }}
              className="w-full py-3.5 rounded-full text-sm font-semibold border border-accent-blue-500 text-accent-blue-500 hover:bg-accent-blue-500/10 transition-colors"
            >
              Create account
            </button>
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-grey/50" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-surface-primary px-4 text-xs text-grey uppercase tracking-wider">or</span>
              </div>
            </div>
            <button
              onClick={() => { setMode('guest'); setError('') }}
              className="w-full py-3.5 rounded-full text-sm font-medium text-foreground-muted border border-dark-grey hover:bg-surface-widget transition-colors"
            >
              Continue as guest
            </button>
          </div>

          <p className="text-[11px] text-grey text-center mt-6 max-w-sm mx-auto leading-relaxed">
            Guest bookings require a valid email for confirmation. By continuing as a guest, you acknowledge that booking date and times are final and cannot be rescheduled.
          </p>
        </div>

        {/* Back button */}
        <div className="sticky bottom-0 bg-surface-primary pt-6 pb-6">
          <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-[var(--surface-primary)] to-transparent pointer-events-none" />
          <button
            onClick={() => dispatch({ type: 'PREV_STEP' })}
            className="px-6 py-3 rounded-xl text-sm font-medium bg-surface-widget border border-dark-grey hover:bg-surface-widget-hover transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    )
  }

  // ─── Login ───
  if (mode === 'login') {
    return (
      <div>
        <h1 className="text-3xl font-bold text-center mb-2">Welcome back</h1>
        <p className="text-dark-silver text-center mb-10">
          Log in to your otopro account
        </p>

        <div className="space-y-4 max-w-md mx-auto">
          <div>
            <label className="block text-xs text-grey uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-widget border border-dark-grey text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue-500/50 transition-all"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-xs text-grey uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-widget border border-dark-grey text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={isPending || !email || !password}
            className="w-full py-3.5 rounded-full text-sm font-semibold bg-accent-blue-500 hover:bg-accent-blue-600 text-white disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Logging in...' : 'Log in'}
          </button>

          <div className="flex items-center justify-between text-sm">
            <button
              onClick={() => { setMode('choose'); setError('') }}
              className="text-foreground-muted hover:text-foreground transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => { setMode('signup'); setError('') }}
              className="text-accent-blue-400 hover:text-accent-blue-300 transition-colors"
            >
              Create account instead
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Sign up ───
  if (mode === 'signup') {
    return (
      <div>
        <h1 className="text-3xl font-bold text-center mb-2">Create your account</h1>
        <p className="text-dark-silver text-center mb-10">
          Save vehicles, reschedule bookings, and more
        </p>

        <div className="space-y-4 max-w-md mx-auto">
          <div>
            <label className="block text-xs text-grey uppercase tracking-wider mb-1.5">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-widget border border-dark-grey text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue-500/50 transition-all"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-xs text-grey uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-widget border border-dark-grey text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue-500/50 transition-all"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-xs text-grey uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-widget border border-dark-grey text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleSignup}
            disabled={isPending || !email || !password || !fullName}
            className="w-full py-3.5 rounded-full text-sm font-semibold bg-accent-blue-500 hover:bg-accent-blue-600 text-white disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Creating account...' : 'Create account'}
          </button>

          <div className="flex items-center justify-between text-sm">
            <button
              onClick={() => { setMode('choose'); setError('') }}
              className="text-foreground-muted hover:text-foreground transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => { setMode('login'); setError('') }}
              className="text-accent-blue-400 hover:text-accent-blue-300 transition-colors"
            >
              Log in instead
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Guest ───
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-2">Continue as guest</h1>
      <p className="text-dark-silver text-center mb-10">
        Enter your email to receive your booking confirmation and receipt
      </p>

      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="block text-xs text-grey uppercase tracking-wider mb-1.5">Email</label>
          <input
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface-widget border border-dark-grey text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue-500/50 transition-all"
            placeholder="you@email.com"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleGuest}
          disabled={!guestEmail}
          className="w-full py-3.5 rounded-full text-sm font-semibold bg-accent-blue-500 hover:bg-accent-blue-600 text-white disabled:opacity-50 transition-colors"
        >
          Continue to payment
        </button>

        <p className="text-[11px] text-center leading-relaxed" style={{ color: 'rgb(232, 107, 89)' }}>
          By continuing as a guest, you acknowledge that your booking date and time are final. Guest bookings cannot be rescheduled or modified. Creating an account allows up to 2 reschedules within 30 days of your booking.
        </p>

        <div className="flex items-center justify-center text-sm pt-2">
          <button
            onClick={() => { setMode('choose'); setError('') }}
            className="text-foreground-muted hover:text-foreground transition-colors"
          >
            ← Back to options
          </button>
        </div>
      </div>
    </div>
  )
}
