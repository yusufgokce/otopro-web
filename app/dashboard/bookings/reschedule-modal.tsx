'use client'

import { useState, useTransition } from 'react'
import { TIME_SLOT_LABELS, type TimeSlot } from '@/lib/types/booking'
import { rescheduleBooking } from '@/lib/actions/booking'

interface RescheduleModalProps {
  sessionId: string
  currentDate: string
  currentTime: string
  createdAt: string
  rescheduleCount: number
}

const MAX_RESCHEDULES = 2
const TIME_SLOTS = Object.keys(TIME_SLOT_LABELS) as TimeSlot[]

export function RescheduleModal({
  sessionId,
  currentDate,
  currentTime,
  createdAt,
  rescheduleCount,
}: RescheduleModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(currentDate)
  const [selectedTime, setSelectedTime] = useState<TimeSlot>(
    (currentTime.slice(0, 5) as TimeSlot) || '08:00',
  )
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const usedCount = rescheduleCount

  function validate(): string | null {
    // Check max reschedules
    if (usedCount >= MAX_RESCHEDULES) {
      return `You have already used all ${MAX_RESCHEDULES} reschedules for this booking.`
    }

    // Check 24-hour notice before current appointment
    const currentAppointment = new Date(`${currentDate}T${currentTime}`)
    const now = new Date()
    const hoursUntilCurrent =
      (currentAppointment.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursUntilCurrent < 24) {
      return 'You must provide at least 24 hours notice before your current appointment to reschedule.'
    }

    // Check 30-day window from original creation
    const originalCreation = new Date(createdAt)
    const newAppointmentDate = new Date(`${selectedDate}T${selectedTime}`)
    const thirtyDaysFromCreation = new Date(originalCreation)
    thirtyDaysFromCreation.setDate(thirtyDaysFromCreation.getDate() + 30)

    if (newAppointmentDate > thirtyDaysFromCreation) {
      return `You cannot reschedule to a date beyond 30 days from your original booking (${thirtyDaysFromCreation.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}).`
    }

    // Check new date is in the future
    const newDate = new Date(`${selectedDate}T${selectedTime}`)
    if (newDate <= now) {
      return 'Please select a date and time in the future.'
    }

    return null
  }

  function handleSubmit() {
    setError(null)
    setSuccess(false)

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    startTransition(async () => {
      const result = await rescheduleBooking(sessionId, selectedDate, selectedTime)
      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          setOpen(false)
          setSuccess(false)
          window.location.reload()
        }, 1500)
      } else {
        setError(result.error || 'Failed to reschedule. Please try again.')
      }
    })
  }

  // Minimum selectable date is tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  // Max date: 30 days from original creation
  const maxDateObj = new Date(createdAt)
  maxDateObj.setDate(maxDateObj.getDate() + 30)
  const maxDate = maxDateObj.toISOString().split('T')[0]

  return (
    <>
      <button
        onClick={() => {
          setError(null)
          setSuccess(false)
          setSelectedDate(currentDate)
          setSelectedTime((currentTime.slice(0, 5) as TimeSlot) || '08:00')
          setOpen(true)
        }}
        className="bg-accent-blue-500 hover:bg-accent-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors"
      >
        Reschedule
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-surface-widget border border-dark-grey rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Reschedule Booking</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-foreground-muted hover:text-foreground transition-colors text-2xl leading-none"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Reschedule counter */}
            <div className="bg-surface-primary border border-dark-grey rounded-2xl p-4 mb-6">
              <p className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted mb-1">
                Reschedules Used
              </p>
              <p className="text-lg font-bold">
                <span className="text-accent-blue-500">{usedCount}</span>
                <span className="text-foreground-muted"> of {MAX_RESCHEDULES}</span>
              </p>
            </div>

            {/* Date picker */}
            <div className="mb-5">
              <label className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted block mb-2">
                New Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={minDate}
                max={maxDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-surface-primary border border-dark-grey rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-accent-blue-500 transition-colors"
              />
            </div>

            {/* Time slot selector */}
            <div className="mb-6">
              <label className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted block mb-2">
                New Time
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${
                      selectedTime === slot
                        ? 'bg-accent-blue-500 text-white border-accent-blue-500'
                        : 'bg-surface-primary border-dark-grey text-foreground hover:border-accent-blue-500/40'
                    }`}
                  >
                    {TIME_SLOT_LABELS[slot]}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-xl px-4 py-3 mb-4 text-sm"
                style={{ backgroundColor: 'rgba(232, 107, 89, 0.12)', color: 'rgb(232, 107, 89)' }}
              >
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="bg-green-500/12 text-green-500 rounded-xl px-4 py-3 mb-4 text-sm">
                Booking rescheduled successfully!
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isPending || success || usedCount >= MAX_RESCHEDULES}
              className="w-full bg-accent-blue-500 hover:bg-accent-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition-colors"
            >
              {isPending ? 'Rescheduling...' : 'Confirm Reschedule'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
