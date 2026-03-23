'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import type { WizardState, TimeSlot } from '@/lib/types/booking'
import { TIME_SLOT_LABELS } from '@/lib/types/booking'
import { sendBookingConfirmation } from '@/lib/actions/email'

interface Props {
  state: WizardState
  totalPrice: number
  depositAmount: number
  bookingId: string | null
  /** Guest email, or undefined when the user is authenticated (auth email used server-side). */
  email?: string
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Short confirmation number derived from the UUID (first 8 chars, uppercased). */
function shortConfirmationNumber(id: string | null) {
  if (!id) return '—'
  return id.replace(/-/g, '').slice(0, 8).toUpperCase()
}

function handlePrint() {
  window.print()
}

export function Confirmation({ state, totalPrice, depositAmount, bookingId, email }: Props) {
  const emailSent = useRef(false)
  const remaining = totalPrice - depositAmount

  const fullAddress = [
    state.streetAddress,
    state.city,
    state.province,
    state.postalCode,
  ]
    .filter(Boolean)
    .join(', ')

  // Fire-and-forget confirmation email once on mount
  useEffect(() => {
    if (emailSent.current || !bookingId || !email) return
    emailSent.current = true

    sendBookingConfirmation({
      bookingId,
      email,
      serviceName: state.selectedService?.name ?? '',
      date: state.selectedDate ? formatDate(state.selectedDate) : '',
      time: state.selectedTime ? TIME_SLOT_LABELS[state.selectedTime as TimeSlot] : '',
      address: fullAddress,
      total: totalPrice,
      deposit: depositAmount,
    }).catch(() => {
      // Silently swallow — the booking itself succeeded regardless
    })
  }, [bookingId, email, state, totalPrice, depositAmount, fullAddress])

  return (
    <div className="max-w-md mx-auto text-center py-12">
      {/* Success icon */}
      <div className="w-16 h-16 bg-accent-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-accent-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-2">Booking confirmed!</h1>
      <p className="text-dark-silver mb-1">
        Your deposit has been paid and your session is locked in.
      </p>

      {/* Confirmation number */}
      <p className="text-xs text-grey uppercase tracking-wider mb-1">
        Confirmation
      </p>
      <p className="font-mono font-bold text-accent-blue-500 text-lg mb-3">
        #{shortConfirmationNumber(bookingId)}
      </p>

      {/* Email notice */}
      {email && (
        <p className="text-sm text-dark-silver mb-8">
          Confirmation sent to{' '}
          <span className="text-foreground font-medium">{email}</span>
        </p>
      )}
      {!email && <div className="mb-8" />}

      {/* Booking summary card */}
      <div className="bg-surface-widget border border-dark-grey rounded-3xl p-6 text-left mb-6">
        <div className="space-y-4">
          <div>
            <span className="text-xs text-grey uppercase tracking-wider">Service</span>
            <p className="font-semibold mt-0.5">{state.selectedService?.name}</p>
          </div>
          <div>
            <span className="text-xs text-grey uppercase tracking-wider">Date &amp; Time</span>
            <p className="font-semibold mt-0.5">
              {state.selectedDate ? formatDate(state.selectedDate) : ''}
            </p>
            <p className="text-dark-silver text-sm">
              {state.selectedTime ? TIME_SLOT_LABELS[state.selectedTime as TimeSlot] : ''}
            </p>
          </div>
          <div>
            <span className="text-xs text-grey uppercase tracking-wider">Vehicle</span>
            <p className="font-semibold mt-0.5">
              {state.vehicleYear} {state.vehicleMake} {state.vehicleModel}
            </p>
          </div>
          <div>
            <span className="text-xs text-grey uppercase tracking-wider">Location</span>
            <p className="font-semibold mt-0.5">{state.streetAddress}</p>
            <p className="text-dark-silver text-sm">
              {state.city}, {state.province} {state.postalCode}
            </p>
          </div>

          {/* Price breakdown */}
          <div className="pt-3 border-t border-dark-grey space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-dark-silver">Service total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-400">
              <span>Deposit paid</span>
              <span>${depositAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold pt-1">
              <span>Remaining at appointment</span>
              <span className="text-accent-blue-500">${remaining.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* What happens next */}
      <div className="bg-surface-widget border border-dark-grey rounded-3xl p-5 text-left mb-8">
        <h3 className="font-semibold text-sm mb-3">What happens next</h3>
        <div className="space-y-3 text-sm text-dark-silver">
          <div className="flex items-start gap-3">
            <span className="text-accent-blue-500 font-bold mt-0.5">1</span>
            <span>
              {email
                ? `A confirmation email has been sent to ${email}.`
                : "You'll receive a confirmation email with your booking details."}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-accent-blue-500 font-bold mt-0.5">2</span>
            <span>Your detailer will reach out before the appointment to confirm.</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-accent-blue-500 font-bold mt-0.5">3</span>
            <span>
              Remaining balance of ${remaining.toFixed(2)} is collected at service.
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-2 border border-dark-grey hover:border-silver text-foreground font-semibold px-6 py-3.5 rounded-2xl transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print receipt
        </button>

        <Link
          href="/"
          className="inline-block bg-accent-blue-500 hover:bg-accent-blue-600 text-white font-semibold px-8 py-3.5 rounded-2xl transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
