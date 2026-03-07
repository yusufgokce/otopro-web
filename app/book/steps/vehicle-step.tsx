'use client'

import { useState } from 'react'
import type { WizardState, WizardAction, BodyStylePricing, BodyStyle } from '@/lib/types/booking'
import { BODY_STYLES, PROVINCES } from '@/lib/types/booking'

interface Props {
  state: WizardState
  dispatch: React.Dispatch<WizardAction>
  bodyStylePricing: BodyStylePricing[]
}

const inputClass =
  'w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-[#6B4EFF] focus:outline-none focus:ring-1 focus:ring-[#6B4EFF]/50 transition-colors'

const labelClass = 'block text-sm text-white/60 mb-1.5'

export function VehicleStep({ state, dispatch, bodyStylePricing }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  function getSurcharge(bs: BodyStyle) {
    return bodyStylePricing.find((b) => b.body_style === bs)?.surcharge ?? 0
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!state.vehicleMake.trim()) e.make = 'Required'
    if (!state.vehicleModel.trim()) e.model = 'Required'
    const year = parseInt(state.vehicleYear)
    if (!year || year < 1990 || year > 2027) e.year = '1990–2027'
    if (!state.vehicleColor.trim()) e.color = 'Required'
    if (!state.bodyStyle) e.bodyStyle = 'Required'
    if (!state.streetAddress.trim()) e.street = 'Required'
    if (!state.city.trim()) e.city = 'Required'
    if (!state.province) e.province = 'Required'
    if (!state.postalCode.trim()) {
      e.postal = 'Required'
    } else if (!/^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/.test(state.postalCode.trim())) {
      e.postal = 'Format: A1A 1A1'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleContinue() {
    if (validate()) {
      dispatch({ type: 'NEXT_STEP' })
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-2">Your vehicle & location</h1>
      <p className="text-white/50 text-center mb-10">
        Tell us about your car and where to come
      </p>

      {/* Vehicle info */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">Vehicle</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Make</label>
            <input
              className={inputClass}
              placeholder="Toyota"
              value={state.vehicleMake}
              onChange={(e) =>
                dispatch({ type: 'SET_VEHICLE', payload: { vehicleMake: e.target.value } })
              }
            />
            {errors.make && <span className="text-red-400 text-xs mt-1">{errors.make}</span>}
          </div>
          <div>
            <label className={labelClass}>Model</label>
            <input
              className={inputClass}
              placeholder="Camry"
              value={state.vehicleModel}
              onChange={(e) =>
                dispatch({ type: 'SET_VEHICLE', payload: { vehicleModel: e.target.value } })
              }
            />
            {errors.model && <span className="text-red-400 text-xs mt-1">{errors.model}</span>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Year</label>
            <input
              className={inputClass}
              placeholder="2024"
              type="number"
              min={1990}
              max={2027}
              value={state.vehicleYear}
              onChange={(e) =>
                dispatch({ type: 'SET_VEHICLE', payload: { vehicleYear: e.target.value } })
              }
            />
            {errors.year && <span className="text-red-400 text-xs mt-1">{errors.year}</span>}
          </div>
          <div>
            <label className={labelClass}>Color</label>
            <input
              className={inputClass}
              placeholder="Black"
              value={state.vehicleColor}
              onChange={(e) =>
                dispatch({ type: 'SET_VEHICLE', payload: { vehicleColor: e.target.value } })
              }
            />
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
                      ? 'bg-[#6B4EFF]/10 border-[#6B4EFF] text-white'
                      : 'bg-white/[0.04] border-white/[0.08] text-white/60 hover:border-[#6B4EFF]/40'
                  }`}
                >
                  {bs}
                  {extra > 0 && (
                    <span className="text-[#A48FFF] text-xs ml-1">+${extra}</span>
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

      {/* Address */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 mb-6">
        <h2 className="font-semibold text-lg mb-1">Service Location</h2>
        <p className="text-white/40 text-sm mb-4">
          Where should we come to detail your vehicle?
        </p>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Street Address</label>
            <input
              className={inputClass}
              placeholder="123 Main St"
              value={state.streetAddress}
              onChange={(e) =>
                dispatch({ type: 'SET_ADDRESS', payload: { streetAddress: e.target.value } })
              }
            />
            {errors.street && <span className="text-red-400 text-xs mt-1">{errors.street}</span>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>City</label>
              <input
                className={inputClass}
                placeholder="Toronto"
                value={state.city}
                onChange={(e) =>
                  dispatch({ type: 'SET_ADDRESS', payload: { city: e.target.value } })
                }
              />
              {errors.city && <span className="text-red-400 text-xs mt-1">{errors.city}</span>}
            </div>
            <div>
              <label className={labelClass}>Province</label>
              <select
                className={inputClass}
                value={state.province}
                onChange={(e) =>
                  dispatch({ type: 'SET_ADDRESS', payload: { province: e.target.value } })
                }
              >
                <option value="" className="bg-[#0A0A0F]">Select</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p} className="bg-[#0A0A0F]">{p}</option>
                ))}
              </select>
              {errors.province && (
                <span className="text-red-400 text-xs mt-1">{errors.province}</span>
              )}
            </div>
          </div>
          <div className="max-w-[200px]">
            <label className={labelClass}>Postal Code</label>
            <input
              className={inputClass}
              placeholder="M5H 2N2"
              value={state.postalCode}
              onChange={(e) =>
                dispatch({ type: 'SET_ADDRESS', payload: { postalCode: e.target.value.toUpperCase() } })
              }
            />
            {errors.postal && <span className="text-red-400 text-xs mt-1">{errors.postal}</span>}
          </div>
          <div>
            <label className={labelClass}>Special Requests (optional)</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              maxLength={500}
              placeholder="Anything we should know?"
              value={state.specialRequests}
              onChange={(e) =>
                dispatch({ type: 'SET_ADDRESS', payload: { specialRequests: e.target.value } })
              }
            />
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex gap-3">
        <button
          onClick={() => dispatch({ type: 'PREV_STEP' })}
          className="px-6 py-3 rounded-xl text-sm font-medium bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 py-3 rounded-xl text-sm font-semibold bg-[#6B4EFF] hover:bg-[#5A3EEE] transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
