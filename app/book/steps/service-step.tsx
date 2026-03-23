'use client'

import { useState } from 'react'
import type { ServiceType, WizardState, WizardAction } from '@/lib/types/booking'

interface Props {
  services: ServiceType[]
  state: WizardState
  dispatch: React.Dispatch<WizardAction>
  /** Surcharge from body style selection (baked into displayed price) */
  surcharge: number
}

export function ServiceStep({ services, state, dispatch, surcharge }: Props) {
  const bookable = services.filter((s) => s.base_price > 0)
  const [error, setError] = useState('')

  function handleContinue() {
    if (!state.selectedService) {
      setError('Please select a service to continue')
      return
    }
    dispatch({ type: 'NEXT_STEP' })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-center mb-2">Choose your detail package</h1>
        <p className="text-dark-silver text-center mb-10">
          Select the service that fits your needs
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bookable.map((s) => {
            const selected = state.selectedService?.id === s.id
            const displayPrice = s.base_price + surcharge
            return (
              <button
                key={s.id}
                onClick={() => {
                  dispatch({ type: 'SELECT_SERVICE', payload: s })
                  setError('')
                }}
                className={`text-left p-6 rounded-2xl border transition-all ${
                  selected
                    ? 'bg-accent-blue-500/10 border-accent-blue-500'
                    : 'bg-surface-widget border-dark-grey hover:border-accent-blue-500/40'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{s.name}</h3>
                  {selected && (
                    <span className="text-accent-blue-500 text-lg">&#10003;</span>
                  )}
                </div>
                <p className="text-dark-silver text-sm leading-relaxed mb-4">
                  {s.description?.replace(/^-\s*/gm, '').replace(/\n-\s*/g, ', ')}
                </p>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-accent-blue-500">
                    ${displayPrice}
                  </span>
                  <span className="text-grey text-sm">
                    {s.estimated_duration_hours} Hours
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center mt-4">{error}</p>
        )}
      </div>

      {/* Footer nav */}
      <div className="sticky bottom-0 bg-surface-primary pt-6 pb-6">
        <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-[var(--surface-primary)] to-transparent pointer-events-none" />
        <div className="flex gap-3">
          <button
            onClick={() => dispatch({ type: 'PREV_STEP' })}
            className="px-6 py-3 rounded-xl text-sm font-medium bg-surface-widget border border-dark-grey hover:bg-surface-widget-hover transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!state.selectedService}
            className="flex-1 py-3 rounded-xl text-sm font-semibold bg-accent-blue-500 hover:bg-accent-blue-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
