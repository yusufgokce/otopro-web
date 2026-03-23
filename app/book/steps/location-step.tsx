'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { WizardState, WizardAction } from '@/lib/types/booking'
import { PROVINCES } from '@/lib/types/booking'

interface Props {
  state: WizardState
  dispatch: React.Dispatch<WizardAction>
}

const inputClass =
  'w-full bg-surface-widget border border-dark-grey rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:border-accent-blue-500 focus:outline-none focus:ring-1 focus:ring-accent-blue-500/50 transition-colors'

const selectClass =
  'w-full bg-surface-widget border border-dark-grey rounded-lg px-3 py-2.5 text-sm text-foreground focus:border-accent-blue-500 focus:outline-none focus:ring-1 focus:ring-accent-blue-500/50 transition-colors appearance-none cursor-pointer'

const labelClass = 'block text-xs text-foreground mb-1'

// ── Address autocomplete via Nominatim (OpenStreetMap, free) ──
interface NominatimResult {
  display_name: string
  lat: string
  lon: string
  address: {
    house_number?: string
    road?: string
    city?: string
    town?: string
    village?: string
    state?: string
    postcode?: string
    country_code?: string
  }
}

const PROVINCE_MAP: Record<string, string> = {
  'ontario': 'ON',
  'quebec': 'QC',
  'british columbia': 'BC',
  'alberta': 'AB',
  'manitoba': 'MB',
  'saskatchewan': 'SK',
  'nova scotia': 'NS',
  'new brunswick': 'NB',
  'newfoundland and labrador': 'NL',
  'prince edward island': 'PE',
  'northwest territories': 'NT',
  'nunavut': 'NU',
  'yukon': 'YT',
}

function parseNominatimAddress(addr: NominatimResult['address']) {
  const street = [addr.house_number, addr.road].filter(Boolean).join(' ')
  const city = addr.city || addr.town || addr.village || ''
  const province = PROVINCE_MAP[(addr.state || '').toLowerCase()] || ''
  const postalCode = (addr.postcode || '').toUpperCase()
  return { street, city, province, postalCode }
}

/** Format suggestion as: "29 Marcus Crescent, Markham, ON" (no postal in suggestion — we fetch it precisely on select) */
function formatSuggestion(result: NominatimResult): string {
  const addr = result.address
  const street = [addr.house_number, addr.road].filter(Boolean).join(' ')
  const city = addr.city || addr.town || addr.village || ''
  const province = PROVINCE_MAP[(addr.state || '').toLowerCase()] || addr.state || ''

  const parts: string[] = []
  if (street) parts.push(street)
  if (city) parts.push(city)
  if (province) parts.push(province)

  return parts.join(', ') || result.display_name
}

export function LocationStep({ state, dispatch }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Close suggestions on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // ── Forward search: fast, no reverse geocoding per result ──
  const searchAddress = useCallback((query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }

    setSearching(true)
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=ca&limit=5&q=${encodeURIComponent(query)}`,
      { headers: { 'Accept-Language': 'en' } }
    )
      .then((r) => r.json())
      .then((results: NominatimResult[]) => {
        // Filter to street-level results only
        const streetLevel = results.filter(
          (r) => r.address.house_number || r.address.road,
        )
        const candidates = streetLevel.length > 0 ? streetLevel : results
        setSuggestions(candidates)
        setShowSuggestions(candidates.length > 0)
        setSearching(false)
      })
      .catch(() => {
        setSuggestions([])
        setSearching(false)
      })
  }, [])

  function handleSearchChange(value: string) {
    setSearchQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => searchAddress(value), 400)
  }

  // ── On select: fill street/city/province, leave postal code for user ──
  // Nominatim's Canadian postal codes are unreliable (returns nearby area codes),
  // so we intentionally skip it to avoid billing errors.
  function selectSuggestion(result: NominatimResult) {
    setShowSuggestions(false)

    const parsed = parseNominatimAddress(result.address)

    dispatch({
      type: 'SET_ADDRESS',
      payload: {
        streetAddress: parsed.street,
        city: parsed.city,
        province: parsed.province,
        postalCode: '', // intentionally blank — Nominatim postal codes are inaccurate for Canada
      },
    })

    setSearchQuery('')
    setSuggestions([])
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!state.streetAddress.trim()) e.street = 'Required'
    if (!state.city.trim()) e.city = 'Required'
    if (!state.province) e.province = 'Required'
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
      <div>
        <h1 className="text-3xl font-bold text-center mb-2">Service location</h1>
        <p className="text-foreground-secondary text-center mb-6">
          Where should we come to detail your vehicle?
        </p>

        {/* ── Search address ── */}
        <div ref={wrapperRef} className="relative mb-5">
          <p className="text-sm font-medium text-foreground mb-2">Search address</p>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className={`${inputClass} pl-10`}
              placeholder="123 Main St, Toronto, ON..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            />
            {searching && (
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin w-4 h-4 text-foreground-muted" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && (
            <div className="absolute z-20 left-0 right-0 mt-1 bg-surface-widget border border-dark-grey rounded-xl overflow-hidden shadow-lg">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectSuggestion(s)}
                  className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-surface-widget-hover transition-colors border-b border-dark-grey/50 last:border-0"
                >
                  {formatSuggestion(s)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Enter address manually ── */}
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Enter address manually</p>
          <div className="bg-surface-widget border border-dark-grey rounded-2xl p-4 space-y-3">
            {/* Row 1: Street Address (full width) */}
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
              {errors.street && <span className="text-red-400 text-xs">{errors.street}</span>}
            </div>

            {/* Row 2: City, Province, Postal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                {errors.city && <span className="text-red-400 text-xs">{errors.city}</span>}
              </div>
              <div>
                <label className={labelClass}>Province</label>
                <div className="relative">
                  <select
                    className={`${selectClass} ${!state.province ? 'text-foreground-muted' : ''}`}
                    value={state.province}
                    onChange={(e) =>
                      dispatch({ type: 'SET_ADDRESS', payload: { province: e.target.value } })
                    }
                  >
                    <option value="" className="bg-surface-primary text-foreground-muted">Select</option>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p} className="bg-surface-primary text-foreground">{p}</option>
                    ))}
                  </select>
                  <ChevronIcon />
                </div>
                {errors.province && <span className="text-red-400 text-xs">{errors.province}</span>}
              </div>
            </div>

            {/* Row 3: Special requests */}
            <div>
              <label className={labelClass}>Special Requests (optional)</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={2}
                maxLength={500}
                placeholder="Gate code, parking instructions, etc."
                value={state.specialRequests}
                onChange={(e) =>
                  dispatch({ type: 'SET_ADDRESS', payload: { specialRequests: e.target.value } })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Nav — always visible at bottom */}
      <div className="flex gap-3 pt-4 pb-2">
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
      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}
