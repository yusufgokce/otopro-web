'use client'

import { useState, useEffect } from 'react'
import type { WizardState, WizardAction, BodyStylePricing, BodyStyle } from '@/lib/types/booking'
import { BODY_STYLES } from '@/lib/types/booking'

interface Props {
  state: WizardState
  dispatch: React.Dispatch<WizardAction>
  bodyStylePricing: BodyStylePricing[]
}

const selectClass =
  'w-full bg-surface-widget border border-dark-grey rounded-xl px-4 py-3 text-foreground focus:border-accent-blue-500 focus:outline-none focus:ring-1 focus:ring-accent-blue-500/50 transition-colors appearance-none cursor-pointer'

const labelClass = 'block text-sm text-dark-silver mb-1.5'

const DATA_BASE = '/data/vehicles'

export function VehicleStep({ state, dispatch, bodyStylePricing }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [makes, setMakes] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [years, setYears] = useState<number[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [loadingModels, setLoadingModels] = useState(false)

  useEffect(() => {
    fetch(`${DATA_BASE}/meta.json`)
      .then((r) => r.json())
      .then((meta) => {
        setYears(meta.years)
        setColors(meta.colors)
      })
      .catch(() => {})

    fetch(`${DATA_BASE}/makes.json`)
      .then((r) => r.json())
      .then(setMakes)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!state.vehicleMake) {
      setModels([])
      return
    }

    setLoadingModels(true)
    const slug = state.vehicleMake
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    fetch(`${DATA_BASE}/models/${slug}.json`)
      .then((r) => r.json())
      .then((data) => {
        setModels(data)
        setLoadingModels(false)
      })
      .catch(() => {
        setModels([])
        setLoadingModels(false)
      })
  }, [state.vehicleMake])

  function handleMakeChange(make: string) {
    dispatch({ type: 'SET_VEHICLE', payload: { vehicleMake: make, vehicleModel: '' } })
  }

  function getSurcharge(bs: BodyStyle) {
    return bodyStylePricing.find((b) => b.body_style === bs)?.surcharge ?? 0
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!state.vehicleYear) e.year = 'Required'
    if (!state.vehicleMake) e.make = 'Required'
    if (!state.vehicleModel) e.model = 'Required'
    if (!state.vehicleColor) e.color = 'Required'
    if (!state.bodyStyle) e.bodyStyle = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleContinue() {
    if (validate()) {
      dispatch({ type: 'NEXT_STEP' })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-center mb-2">Your vehicle</h1>
        <p className="text-dark-silver text-center mb-10">
          Tell us about your car so we can prepare the right service
        </p>

        <div className="bg-surface-widget border border-dark-grey rounded-2xl p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Year */}
            <div>
              <label className={labelClass}>Year</label>
              <div className="relative">
                <select
                  className={`${selectClass} ${!state.vehicleYear ? 'text-grey' : ''}`}
                  value={state.vehicleYear}
                  onChange={(e) =>
                    dispatch({ type: 'SET_VEHICLE', payload: { vehicleYear: e.target.value } })
                  }
                >
                  <option value="" className="bg-surface-primary text-grey">Select year</option>
                  {years.map((y) => (
                    <option key={y} value={y} className="bg-surface-primary text-foreground">{y}</option>
                  ))}
                </select>
                <ChevronIcon />
              </div>
              {errors.year && <span className="text-red-400 text-xs mt-1">{errors.year}</span>}
            </div>

            {/* Make */}
            <div>
              <label className={labelClass}>Make</label>
              <div className="relative">
                <select
                  className={`${selectClass} ${!state.vehicleMake ? 'text-grey' : ''}`}
                  value={state.vehicleMake}
                  onChange={(e) => handleMakeChange(e.target.value)}
                >
                  <option value="" className="bg-surface-primary text-grey">Select make</option>
                  {makes.map((m) => (
                    <option key={m} value={m} className="bg-surface-primary text-foreground">{m}</option>
                  ))}
                </select>
                <ChevronIcon />
              </div>
              {errors.make && <span className="text-red-400 text-xs mt-1">{errors.make}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Model */}
            <div>
              <label className={labelClass}>Model</label>
              <div className="relative">
                <select
                  className={`${selectClass} ${!state.vehicleModel ? 'text-grey' : ''}`}
                  value={state.vehicleModel}
                  onChange={(e) =>
                    dispatch({ type: 'SET_VEHICLE', payload: { vehicleModel: e.target.value } })
                  }
                  disabled={!state.vehicleMake || loadingModels}
                >
                  <option value="" className="bg-surface-primary text-grey">
                    {loadingModels
                      ? 'Loading...'
                      : !state.vehicleMake
                        ? 'Select make first'
                        : 'Select model'}
                  </option>
                  {models.map((m) => (
                    <option key={m} value={m} className="bg-surface-primary text-foreground">{m}</option>
                  ))}
                </select>
                <ChevronIcon />
              </div>
              {errors.model && <span className="text-red-400 text-xs mt-1">{errors.model}</span>}
            </div>

            {/* Color */}
            <div>
              <label className={labelClass}>Color</label>
              <div className="relative">
                <select
                  className={`${selectClass} ${!state.vehicleColor ? 'text-grey' : ''}`}
                  value={state.vehicleColor}
                  onChange={(e) =>
                    dispatch({ type: 'SET_VEHICLE', payload: { vehicleColor: e.target.value } })
                  }
                >
                  <option value="" className="bg-surface-primary text-grey">Select color</option>
                  {colors.map((c) => (
                    <option key={c} value={c} className="bg-surface-primary text-foreground">{c}</option>
                  ))}
                </select>
                <ChevronIcon />
              </div>
              {errors.color && <span className="text-red-400 text-xs mt-1">{errors.color}</span>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Body Style</label>
            <div className="grid grid-cols-3 gap-2">
              {BODY_STYLES.map((bs) => {
                const selected = state.bodyStyle === bs
                const extra = getSurcharge(bs)
                return (
                  <button
                    key={bs}
                    type="button"
                    onClick={() =>
                      dispatch({ type: 'SET_VEHICLE', payload: { bodyStyle: bs } })
                    }
                    className={`py-2.5 px-3 rounded-xl text-sm border transition-colors ${
                      selected
                        ? 'bg-accent-blue-500/10 border-accent-blue-500 text-foreground'
                        : 'bg-surface-widget border-dark-grey text-dark-silver hover:border-accent-blue-500/40'
                    }`}
                  >
                    {bs}
                    {extra > 0 && (
                      <span className="text-accent-blue-300 text-xs ml-1">+${extra}</span>
                    )}
                  </button>
                )
              })}
            </div>
            {errors.bodyStyle && (
              <span className="text-red-400 text-xs mt-1">{errors.bodyStyle}</span>
            )}
          </div>
        </div>
      </div>

      {/* Nav — always visible at bottom */}
      <div className="flex gap-3 pt-6 pb-2">
        <button
          onClick={() => dispatch({ type: 'PREV_STEP' })}
          className="px-6 py-3 rounded-xl text-sm font-medium bg-surface-widget border border-dark-grey hover:bg-surface-widget-hover transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 py-3 rounded-xl text-sm font-semibold bg-accent-blue-500 hover:bg-accent-blue-600 text-white transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

function ChevronIcon() {
  return (
    <svg
      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey pointer-events-none"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}
