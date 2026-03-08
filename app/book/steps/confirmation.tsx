'use client'

import Link from 'next/link'
import type { WizardState, TimeSlot } from '@/lib/types/booking'
import { TIME_SLOT_LABELS } from '@/lib/types/booking'

interface Props {
  state: WizardState
  totalPrice: number
  depositAmount: number
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

export function Confirmation({ state, totalPrice, depositAmount }: Props) {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="w-16 h-16 bg-gold-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-gold-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-2">Booking confirmed!</h1>
      <p className="text-dark-silver mb-8">
        Your deposit has been paid and your session is locked in.
      </p>

      <div className="bg-dune border border-dark-grey rounded-2xl p-6 text-left mb-8">
        <div className="space-y-4">
          <div>
            <span className="text-xs text-grey uppercase tracking-wider">Service</span>
            <p className="font-semibold mt-0.5">{state.selectedService?.name}</p>
          </div>
          <div>
            <span className="text-xs text-grey uppercase tracking-wider">Date & Time</span>
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
          <div className="pt-3 border-t border-dune/50 space-y-1.5">
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
              <span className="text-gold-400">${(totalPrice - depositAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* What happens next */}
      <div className="bg-dune border border-dark-grey rounded-2xl p-5 text-left mb-8">
        <h3 className="font-semibold text-sm mb-3">What happens next</h3>
        <div className="space-y-3 text-sm text-dark-silver">
          <div className="flex items-start gap-3">
            <span className="text-gold-400 font-bold mt-0.5">1</span>
            <span>You&apos;ll receive a confirmation email with your booking details.</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-gold-400 font-bold mt-0.5">2</span>
            <span>Your detailer will reach out before the appointment to confirm.</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-gold-400 font-bold mt-0.5">3</span>
            <span>Remaining balance of ${(totalPrice - depositAmount).toFixed(2)} is collected at service.</span>
          </div>
        </div>
      </div>

      <Link
        href="/"
        className="inline-block bg-gold-400 hover:bg-gold-500 text-black font-semibold px-8 py-3.5 rounded-2xl transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}
