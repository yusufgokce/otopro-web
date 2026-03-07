'use client'

import Link from 'next/link'
import type { WizardState, TimeSlot } from '@/lib/types/booking'
import { TIME_SLOT_LABELS } from '@/lib/types/booking'

interface Props {
  state: WizardState
  totalPrice: number
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

export function Confirmation({ state, totalPrice }: Props) {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="w-16 h-16 bg-[#6B4EFF]/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-[#6B4EFF]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-2">Booking confirmed!</h1>
      <p className="text-white/50 mb-8">
        Your detailing session has been scheduled
      </p>

      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 text-left mb-8">
        <div className="space-y-4">
          <div>
            <span className="text-xs text-white/40 uppercase tracking-wider">Service</span>
            <p className="font-semibold mt-0.5">{state.selectedService?.name}</p>
          </div>
          <div>
            <span className="text-xs text-white/40 uppercase tracking-wider">Date & Time</span>
            <p className="font-semibold mt-0.5">
              {state.selectedDate ? formatDate(state.selectedDate) : ''}
            </p>
            <p className="text-white/50 text-sm">
              {state.selectedTime ? TIME_SLOT_LABELS[state.selectedTime as TimeSlot] : ''}
            </p>
          </div>
          <div>
            <span className="text-xs text-white/40 uppercase tracking-wider">Vehicle</span>
            <p className="font-semibold mt-0.5">
              {state.vehicleYear} {state.vehicleMake} {state.vehicleModel}
            </p>
          </div>
          <div>
            <span className="text-xs text-white/40 uppercase tracking-wider">Location</span>
            <p className="font-semibold mt-0.5">{state.streetAddress}</p>
            <p className="text-white/50 text-sm">
              {state.city}, {state.province} {state.postalCode}
            </p>
          </div>
          <div className="pt-3 border-t border-white/[0.06]">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-[#6B4EFF]">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-white/40 text-sm mb-8">
        Your detailer will reach out before the appointment to confirm details.
      </p>

      <Link
        href="/"
        className="inline-block bg-[#6B4EFF] hover:bg-[#5A3EEE] text-white font-semibold px-8 py-3.5 rounded-2xl transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}
