'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import type { ServiceType, BodyStylePricing, BodyStyle } from '@/lib/types/booking'

// ── Types ──

interface Meta {
  years: number[]
  bodyStyles: string[]
  colors: string[]
}

// ── Chevron icon for selects ──

function ChevronIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`w-4 h-4 text-foreground-muted pointer-events-none ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

// ── Helpers ──

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// ── Component ──

interface Props {
  services: ServiceType[]
  bodyStylePricing: BodyStylePricing[]
}

export function HeroPriceCalculator({ services, bodyStylePricing }: Props) {
  // Vehicle state
  const [year, setYear] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [bodyStyle, setBodyStyle] = useState<BodyStyle | ''>('')
  const [color, setColor] = useState('')

  // Data
  const [meta, setMeta] = useState<Meta | null>(null)
  const [makes, setMakes] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])

  // UI state
  const [showPricing, setShowPricing] = useState(false)
  const [isLoadingModels, setIsLoadingModels] = useState(false)

  // Load makes + meta on mount
  useEffect(() => {
    Promise.all([
      fetch('/data/vehicles/makes.json').then((r) => r.json()),
      fetch('/data/vehicles/meta.json').then((r) => r.json()),
    ]).then(([makesData, metaData]) => {
      setMakes(makesData)
      setMeta(metaData)
    })
  }, [])

  // Load models when make changes
  const loadModels = useCallback(async (makeName: string) => {
    if (!makeName) {
      setModels([])
      return
    }
    setIsLoadingModels(true)
    try {
      const res = await fetch(`/data/vehicles/models/${toSlug(makeName)}.json`)
      const data: string[] = await res.json()
      setModels(data)
    } catch {
      setModels([])
    }
    setIsLoadingModels(false)
  }, [])

  // Compute surcharge
  const surcharge =
    bodyStylePricing.find((b) => b.body_style === bodyStyle)?.surcharge ?? 0

  const canSeePricing = year && make && model && bodyStyle

  const handleSeePricing = () => {
    if (!canSeePricing) return
    setShowPricing(true)
    setTimeout(() => {
      document.getElementById('pricing-results')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const buildBookLink = (serviceId: string) => {
    const params = new URLSearchParams({
      year,
      make,
      model,
      body: bodyStyle,
      ...(color && { color }),
    })
    return `/book?service=${serviceId}&${params.toString()}`
  }

  const selectClass =
    'w-full appearance-none bg-surface-widget border border-dark-grey/60 rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent-blue-500 focus:ring-1 focus:ring-accent-blue-500/30 transition-all cursor-pointer'

  return (
    <div>
      {/* ── Vehicle Selection Card ── */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-surface-widget border border-dark-grey/40 rounded-3xl p-8 md:p-10 shadow-[0_4px_40px_rgba(0,0,0,0.08)]">
          <p className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted mb-1 text-center">
            Instant Quote
          </p>
          <h3 className="text-lg font-semibold text-foreground mb-6 text-center">
            Enter your vehicle details
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            {/* Year */}
            <div className="relative">
              <select
                value={year}
                onChange={(e) => {
                  setYear(e.target.value)
                  setShowPricing(false)
                }}
                className={selectClass}
              >
                <option value="">Year</option>
                {meta?.years.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
              <ChevronIcon className="absolute right-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* Make */}
            <div className="relative">
              <select
                value={make}
                onChange={(e) => {
                  setMake(e.target.value)
                  setModel('')
                  setModels([])
                  setShowPricing(false)
                  if (e.target.value) loadModels(e.target.value)
                }}
                className={selectClass}
                disabled={!year}
              >
                <option value="">Make</option>
                {makes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronIcon className="absolute right-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* Model */}
            <div className="relative">
              <select
                value={model}
                onChange={(e) => {
                  setModel(e.target.value)
                  setShowPricing(false)
                }}
                className={selectClass}
                disabled={!make || isLoadingModels}
              >
                <option value="">
                  {isLoadingModels ? 'Loading...' : 'Model'}
                </option>
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronIcon className="absolute right-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* Body Style */}
            <div className="relative">
              <select
                value={bodyStyle}
                onChange={(e) => {
                  setBodyStyle(e.target.value as BodyStyle)
                  setShowPricing(false)
                }}
                className={selectClass}
                disabled={!model}
              >
                <option value="">Body Style</option>
                {meta?.bodyStyles.map((bs) => {
                  const bsSurcharge =
                    bodyStylePricing.find((b) => b.body_style === bs)?.surcharge ?? 0
                  return (
                    <option key={bs} value={bs}>
                      {bs}
                      {bsSurcharge > 0 ? ` (+$${bsSurcharge})` : ''}
                    </option>
                  )
                })}
              </select>
              <ChevronIcon className="absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Color + CTA */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="relative">
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className={selectClass}
              >
                <option value="">Color (optional)</option>
                {meta?.colors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronIcon className="absolute right-4 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={handleSeePricing}
              disabled={!canSeePricing}
              className="col-span-1 md:col-span-3 h-[50px] rounded-full text-sm font-semibold bg-accent-blue-500 hover:bg-accent-blue-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {canSeePricing
                ? `See pricing for ${year} ${make} ${model}`
                : 'See My Price'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Pricing Results ── */}
      {showPricing && (
        <div id="pricing-results" className="max-w-6xl mx-auto pt-20 pb-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted mb-3">
              Pricing for your {year} {make} {model}
              {surcharge > 0 && (
                <span className="text-accent-blue-400 ml-2">
                  ({bodyStyle} +${surcharge})
                </span>
              )}
            </p>
            <h2 className="text-[32px] font-bold tracking-[-0.5px] text-foreground mb-3">
              Choose your package
            </h2>
            <p className="text-sm text-foreground-muted">
              All prices include mobile service at your location. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services
              .filter((s) => s.is_active)
              .map((service) => {
                const total = service.base_price + surcharge
                const isComplete =
                  service.service_category === 'complete' ||
                  service.name.toLowerCase().includes('complete')

                return (
                  <div
                    key={service.id}
                    className={`relative bg-surface-widget border rounded-3xl p-7 transition-all ${
                      isComplete
                        ? 'border-accent-blue-500 shadow-[0_0_0_1px_rgba(58,130,255,0.3),0_8px_40px_rgba(58,130,255,0.1)]'
                        : 'border-dark-grey/40 hover:border-dark-grey'
                    }`}
                  >
                    {isComplete && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-blue-500 text-white text-[10px] font-semibold tracking-[0.5px] uppercase px-4 py-1 rounded-full">
                        Most Popular
                      </span>
                    )}

                    <h3 className="text-lg font-semibold text-foreground mb-1">{service.name}</h3>
                    <p className="text-sm text-foreground-muted mb-5 leading-relaxed">{service.description}</p>

                    <div className="flex items-baseline gap-2 mb-7">
                      <span className="text-4xl font-bold text-foreground">
                        ${total}
                      </span>
                      {surcharge > 0 && (
                        <span className="text-sm text-foreground-muted line-through">
                          ${service.base_price}
                        </span>
                      )}
                      <span className="text-xs text-foreground-muted ml-auto">
                        ~{service.estimated_duration_hours} hrs
                      </span>
                    </div>

                    <Link
                      href={buildBookLink(service.id)}
                      className={`block text-center py-3.5 rounded-full text-sm font-semibold transition-all ${
                        isComplete
                          ? 'bg-accent-blue-500 hover:bg-accent-blue-600 text-white'
                          : 'bg-surface-widget hover:bg-surface-widget-hover border border-dark-grey/60 text-foreground'
                      }`}
                    >
                      Book Now — ${total}
                    </Link>
                  </div>
                )
              })}
          </div>

          <p className="text-center mt-8 text-sm text-foreground-muted">
            <Link href="/pricing" className="text-accent-blue-400 hover:text-accent-blue-300 transition-colors">
              View full pricing comparison &rarr;
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
