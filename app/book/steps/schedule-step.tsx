'use client'

import { useState } from 'react'
import type { WizardState, WizardAction, TimeSlot } from '@/lib/types/booking'
import { TIME_SLOT_LABELS } from '@/lib/types/booking'

interface Props {
  state: WizardState
  dispatch: React.Dispatch<WizardAction>
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function formatMonth(year: number, month: number) {
  return new Date(year, month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

function toDateString(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function ScheduleStep({ state, dispatch }: Props) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + 60)

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth)

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1)
      setViewMonth(11)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1)
      setViewMonth(0)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  function isDisabled(day: number) {
    const d = new Date(viewYear, viewMonth, day)
    return d < tomorrow || d > maxDate
  }

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth())

  const canGoNext = new Date(viewYear, viewMonth + 1, 1) <= maxDate

  const timeSlots: TimeSlot[] = ['08:00', '10:00', '12:00', '14:00']

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-2">Pick your date & time</h1>
      <p className="text-dark-silver text-center mb-10">
        Choose when you&apos;d like us to come
      </p>

      {/* Calendar */}
      <div className="bg-dune border border-dark-grey rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            disabled={!canGoPrev}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-dark-grey disabled:opacity-20 disabled:cursor-not-allowed"
          >
            &larr;
          </button>
          <span className="font-semibold">{formatMonth(viewYear, viewMonth)}</span>
          <button
            onClick={nextMonth}
            disabled={!canGoNext}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-dark-grey disabled:opacity-20 disabled:cursor-not-allowed"
          >
            &rarr;
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-grey mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateStr = toDateString(viewYear, viewMonth, day)
            const disabled = isDisabled(day)
            const selected = state.selectedDate === dateStr
            const isToday =
              viewYear === today.getFullYear() &&
              viewMonth === today.getMonth() &&
              day === today.getDate()

            return (
              <button
                key={day}
                disabled={disabled}
                onClick={() => dispatch({ type: 'SET_DATE', payload: dateStr })}
                className={`h-10 rounded-lg text-sm transition-colors relative ${
                  disabled
                    ? 'text-dark-grey cursor-not-allowed'
                    : selected
                      ? 'bg-gold-400 text-black font-semibold'
                      : 'hover:bg-dark-grey text-silver'
                }`}
              >
                {day}
                {isToday && !selected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-400" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time slots */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {timeSlots.map((slot) => {
          const selected = state.selectedTime === slot
          return (
            <button
              key={slot}
              onClick={() => dispatch({ type: 'SET_TIME', payload: slot })}
              className={`py-3 rounded-xl text-sm font-medium border transition-colors ${
                selected
                  ? 'bg-gold-400 border-gold-400 text-black'
                  : 'bg-dune border-dark-grey text-dark-silver hover:border-gold-400/40'
              }`}
            >
              {TIME_SLOT_LABELS[slot]}
            </button>
          )
        })}
      </div>

      {/* Nav */}
      <div className="flex gap-3">
        <button
          onClick={() => dispatch({ type: 'PREV_STEP' })}
          className="px-6 py-3 rounded-xl text-sm font-medium bg-dune border border-dark-grey hover:bg-dark-grey transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => dispatch({ type: 'NEXT_STEP' })}
          disabled={!state.selectedDate || !state.selectedTime}
          className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gold-400 hover:bg-gold-500 text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
