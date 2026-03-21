'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import type { ServiceType, BodyStylePricing, BodyStyle } from '@/lib/types/booking'
import { OtoText } from './ui/oto-text'
import { OtoCard } from './ui/oto-card'

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
      className={`w-4 h-4 text-grey pointer-events-none ${className}`}
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
    'w-full appearance-none bg-surface-widget border border-dark-grey rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent-blue-500 transition-colors cursor-pointer'

  return (
    <div>
      {/* ── Vehicle Selection Card ── */}
      <div className="max-w-3xl mx-auto">
        <OtoCard variant="outlined" padding="lg" className="bg-surface-widget/80 backdrop-blur">
          <OtoText.H5 className="mb-1 text-center">Get your price instantly</OtoText.H5>
          <OtoText.BodySmall className="mb-6 text-center">
            Enter your vehicle details to see exact pricing.
          </OtoText.BodySmall>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
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
              <ChevronIcon className="absolute right-3 top-1/2 -translate-y-1/2" />
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
              <ChevronIcon className="absolute right-3 top-1/2 -translate-y-1/2" />
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
                  {isLoadingModels ? 'Loading…' : 'Model'}
                </option>
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronIcon className="absolute right-3 top-1/2 -translate-y-1/2" />
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
              <ChevronIcon className="absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Optional color + CTA row */}
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
              <ChevronIcon className="absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={handleSeePricing}
              disabled={!canSeePricing}
              className="col-span-1 md:col-span-3 h-[46px] rounded-xl text-sm font-semibold bg-accent-blue-500 hover:bg-accent-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {canSeePricing
                ? `See pricing for ${year} ${make} ${model}`
                : 'See My Price'}
            </button>
          </div>
        </OtoCard>
      </div>

      {/* ── Pricing Results ── */}
      {showPricing && (
        <div id="pricing-results" className="max-w-6xl mx-auto pt-16 pb-8">
          <div className="text-center mb-10">
            <OtoText.Label className="mb-2">
              Pricing for your {year} {make} {model}
              {surcharge > 0 && (
                <span className="text-accent-blue-400 ml-2">
                  ({bodyStyle} +${surcharge})
                </span>
              )}
            </OtoText.Label>
            <OtoText.H2 className="mb-2">Choose your package</OtoText.H2>
            <OtoText.BodySmall>
              All prices include mobile service at your location. No hidden fees.
            </OtoText.BodySmall>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {services
              .filter((s) => s.is_active)
              .map((service) => {
                const total = service.base_price + surcharge
                const isComplete =
                  service.service_category === 'complete' ||
                  service.name.toLowerCase().includes('complete')

                return (
                  <OtoCard
                    key={service.id}
                    variant="outlined"
                    padding="md"
                    highlight={isComplete}
                    className={`relative ${isComplete ? 'bg-accent-blue-800/20' : ''}`}
                  >
                    {isComplete && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-blue-500 text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    )}

                    <OtoText.H5 className="mb-1">{service.name}</OtoText.H5>
                    <OtoText.BodySmall className="mb-4">{service.description}</OtoText.BodySmall>

                    <div className="flex items-end gap-2 mb-6">
                      <span className="text-4xl font-bold text-accent-blue-500">
                        ${total}
                      </span>
                      {surcharge > 0 && (
                        <span className="text-sm text-grey line-through mb-1">
                          ${service.base_price}
                        </span>
                      )}
                      <span className="text-xs text-grey mb-1">
                        ~{service.estimated_duration_hours} hrs
                      </span>
                    </div>

                    <Link
                      href={buildBookLink(service.id)}
                      className={`block text-center py-3 rounded-xl text-sm font-semibold transition-colors ${
                        isComplete
                          ? 'bg-accent-blue-500 hover:bg-accent-blue-600 text-white'
                          : 'bg-surface-widget hover:bg-surface-widget-hover border border-dark-grey text-foreground'
                      }`}
                    >
                      Book Now — ${total}
                    </Link>
                  </OtoCard>
                )
              })}
          </div>

          <OtoText.BodySmall className="text-center mt-6">
            <Link href="/pricing" className="text-accent-blue-400 hover:underline">
              View full pricing comparison &rarr;
            </Link>
          </OtoText.BodySmall>
        </div>
      )}
    </div>
  )
}
