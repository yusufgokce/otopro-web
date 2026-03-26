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
  const [allModelsData, setAllModelsData] = useState<Record<string, string[]>>({})
  const [years, setYears] = useState<number[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [loadingModels, setLoadingModels] = useState(false)
  const [availableBodyStyles, setAvailableBodyStyles] = useState<string[]>([...BODY_STYLES])
  const [loadingBodyStyles, setLoadingBodyStyles] = useState(false)

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

  // Load models data when make changes
  useEffect(() => {
    if (!state.vehicleMake) {
      setModels([])
      setAllModelsData({})
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
        if (Array.isArray(data)) {
          // Legacy flat array format
          setAllModelsData({})
          setModels(data)
        } else {
          // Year-indexed format: { "2025": ["Camry", ...], ... }
          setAllModelsData(data)
          setModels([]) // Will be filtered by year effect below
        }
        setLoadingModels(false)
      })
      .catch(() => {
        setModels([])
        setAllModelsData({})
        setLoadingModels(false)
      })
  }, [state.vehicleMake])

  // Filter models by year when year-indexed data is available
  useEffect(() => {
    if (Object.keys(allModelsData).length === 0) return
    const y = state.vehicleYear
    if (y && allModelsData[y]) {
      setModels(allModelsData[y])
    } else if (y) {
      // Year not in data — show all as fallback
      const all = Array.from(new Set(Object.values(allModelsData).flat())).sort()
      setModels(all)
    }
  }, [state.vehicleYear, allModelsData])

  // Fetch valid body styles when model is selected
  useEffect(() => {
    if (!state.vehicleYear || !state.vehicleMake || !state.vehicleModel) {
      setAvailableBodyStyles([...BODY_STYLES])
      return
    }

    setLoadingBodyStyles(true)
    const params = new URLSearchParams({
      year: state.vehicleYear,
      make: state.vehicleMake,
      model: state.vehicleModel,
    })

    fetch(`/api/vehicles/body-styles?${params}`)
      .then((r) => r.json())
      .then((data: string[]) => {
        setAvailableBodyStyles(data.length > 0 ? data : [...BODY_STYLES])
        // Auto-select if only one body style
        if (data.length === 1) {
          dispatch({ type: 'SET_VEHICLE', payload: { bodyStyle: data[0] as BodyStyle } })
        }
        setLoadingBodyStyles(false)
      })
      .catch(() => {
        setAvailableBodyStyles([...BODY_STYLES])
        setLoadingBodyStyles(false)
      })
  }, [state.vehicleYear, state.vehicleMake, state.vehicleModel, dispatch])

  function handleMakeChange(make: string) {
    dispatch({ type: 'SET_VEHICLE', payload: { vehicleMake: make, vehicleModel: '', bodyStyle: '' as BodyStyle } })
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
        <h1 className="text-3xl font-bold text-center mb-2">Find your quote</h1>
        <p className="text-dark-silver text-center mb-10">
          Tell us about your vehicle to get an instant price
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
            <label className={labelClass}>
              Body Style
              {loadingBodyStyles && (
                <span className="ml-2 text-xs text-foreground-muted animate-pulse">detecting...</span>
              )}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableBodyStyles.map((bs) => {
                const selected = state.bodyStyle === bs
                return (
                  <button
                    key={bs}
                    type="button"
                    onClick={() =>
                      dispatch({ type: 'SET_VEHICLE', payload: { bodyStyle: bs as BodyStyle } })
                    }
                    className={`py-2.5 px-3 rounded-xl text-sm border transition-colors ${
                      selected
                        ? 'bg-accent-blue-500/10 border-accent-blue-500 text-foreground'
                        : 'bg-surface-widget border-dark-grey text-dark-silver hover:border-accent-blue-500/40'
                    }`}
                  >
                    {bs}
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

      {/* Footer nav — no back button on step 1 */}
      <div className="sticky bottom-0 bg-surface-primary pt-6 pb-6">
        <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-[var(--surface-primary)] to-transparent pointer-events-none" />
        <button
          onClick={handleContinue}
          className="w-full py-3 rounded-xl text-sm font-semibold bg-accent-blue-500 hover:bg-accent-blue-600 text-white transition-colors"
        >
          See My Prices
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
