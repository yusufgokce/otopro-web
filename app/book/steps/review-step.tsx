'use client'

import { useState, useTransition } from 'react'
import type { WizardState, WizardAction } from '@/lib/types/booking'
import { TIME_SLOT_LABELS, type TimeSlot } from '@/lib/types/booking'
import { createBooking } from '@/lib/actions/booking'

interface Props {
  state: WizardState
  dispatch: React.Dispatch<WizardAction>
  surcharge: number
  totalPrice: number
  depositAmount: number
  isAuthenticated: boolean
  onBookingCreated: (bookingId: string) => void
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

export function ReviewStep({
  state,
  dispatch,
  surcharge,
  totalPrice,
  depositAmount,
  isAuthenticated,
  onBookingCreated,
}: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function handleEdit(step: number) {
    dispatch({ type: 'EDIT_FROM_REVIEW', payload: step })
  }

  function handleSubmit() {
    if (!isAuthenticated) {
      dispatch({ type: 'NEXT_STEP' })
      return
    }

    startTransition(async () => {
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
        setError(result.error || 'Something went wrong')
      }
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-2">Review your booking</h1>
      <p className="text-dark-silver text-center mb-10">
        Make sure everything looks good
      </p>

      <div className="bg-surface-widget border border-dark-grey rounded-2xl divide-y divide-dune/50">
        {/* Service */}
        <div className="p-5 flex justify-between items-start">
          <div>
            <span className="text-xs text-grey uppercase tracking-wider">Service</span>
            <p className="font-semibold mt-1">{state.selectedService?.name}</p>
            <p className="text-grey text-sm">
              ~{state.selectedService?.estimated_duration_hours} hours
            </p>
          </div>
          <button
            onClick={() => handleEdit(0)}
            className="text-accent-blue-300 text-sm hover:text-accent-blue-500"
          >
            Edit
          </button>
        </div>

        {/* Date/Time */}
        <div className="p-5 flex justify-between items-start">
          <div>
            <span className="text-xs text-grey uppercase tracking-wider">Date & Time</span>
            <p className="font-semibold mt-1">
              {state.selectedDate ? formatDate(state.selectedDate) : ''}
            </p>
            <p className="text-grey text-sm">
              {state.selectedTime ? TIME_SLOT_LABELS[state.selectedTime as TimeSlot] : ''}
            </p>
          </div>
          <button
            onClick={() => handleEdit(1)}
            className="text-accent-blue-300 text-sm hover:text-accent-blue-500"
          >
            Edit
          </button>
        </div>

        {/* Vehicle */}
        <div className="p-5 flex justify-between items-start">
          <div>
            <span className="text-xs text-grey uppercase tracking-wider">Vehicle</span>
            <p className="font-semibold mt-1">
              {state.vehicleYear} {state.vehicleMake} {state.vehicleModel}
            </p>
            <p className="text-grey text-sm">
              {state.vehicleColor} &middot; {state.bodyStyle}
            </p>
          </div>
          <button
            onClick={() => handleEdit(2)}
            className="text-accent-blue-300 text-sm hover:text-accent-blue-500"
          >
            Edit
          </button>
        </div>

        {/* Address */}
        <div className="p-5 flex justify-between items-start">
          <div>
            <span className="text-xs text-grey uppercase tracking-wider">Location</span>
            <p className="font-semibold mt-1">{state.streetAddress}</p>
            <p className="text-grey text-sm">
              {state.city}, {state.province} {state.postalCode}
            </p>
          </div>
          <button
            onClick={() => handleEdit(3)}
            className="text-accent-blue-300 text-sm hover:text-accent-blue-500"
          >
            Edit
          </button>
        </div>

        {/* Special Requests */}
        {state.specialRequests && (
          <div className="p-5">
            <span className="text-xs text-grey uppercase tracking-wider">
              Special Requests
            </span>
            <p className="text-dark-silver text-sm mt-1">{state.specialRequests}</p>
          </div>
        )}

        {/* Price breakdown */}
        <div className="p-5 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-dark-silver">Base price</span>
            <span>${state.selectedService?.base_price.toFixed(2)}</span>
          </div>
          {surcharge > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-dark-silver">Body style surcharge ({state.bodyStyle})</span>
              <span>+${surcharge.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-surface-widget/50">
            <span>Total</span>
            <span className="text-accent-blue-500">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-accent-blue-500/80 pt-1">
            <span>Due today (30% deposit)</span>
            <span>${depositAmount.toFixed(2)}</span>
          </div>
          <p className="text-dark-grey text-xs">
            Remaining ${(totalPrice - depositAmount).toFixed(2)} collected at your appointment.
          </p>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center mt-4">{error}</p>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => dispatch({ type: 'PREV_STEP' })}
          className="px-6 py-3 rounded-xl text-sm font-medium bg-surface-widget border border-dark-grey hover:bg-surface-widget-hover transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="flex-1 py-3 rounded-xl text-sm font-semibold bg-accent-blue-500 hover:bg-accent-blue-600 text-white disabled:opacity-50 transition-colors"
        >
          {isPending
            ? 'Creating booking...'
            : isAuthenticated
              ? 'Continue to Payment'
              : 'Continue to Sign In'}
        </button>
      </div>
    </div>
  )
}
