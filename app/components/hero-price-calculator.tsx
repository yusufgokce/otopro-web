'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { ServiceType, BodyStylePricing, BodyStyle } from '@/lib/types/booking'

// ── Types ──

interface Meta {
  years: number[]
  bodyStyles: string[]
  colors: string[]
}

interface GarageVehicle {
  id: string
  year: number
  make: string
  model: string
  color: string | null
  body_style: string | null
}

// ── Icons ──

function SearchIcon() {
  return (
    <svg className="w-5 h-5 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function ChevronIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 text-foreground-muted pointer-events-none ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

// ── Helpers ──

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ── Typewriter animation sequences ──
// Each sequence is an array of steps: { text, pauseAfter }
// A "correction" is: type the wrong thing, pause, delete back, type the right thing

type AnimStep = { text: string; pauseAfter: number }

const SEQUENCES: AnimStep[][] = [
  // "2025 BMW Sup" → delete → "2025 Toyota Supra"
  [
    { text: '2025 BMW Sup', pauseAfter: 600 },
    { text: '2025 Toyota Supra', pauseAfter: 2500 },
  ],
  // Normal
  [
    { text: '2024 Porsche 911 Turbo', pauseAfter: 2500 },
  ],
  // "2025 Subaru GR86" → delete → "2025 Toyota GR86"
  [
    { text: '2025 Subaru GR86', pauseAfter: 600 },
    { text: '2025 Toyota GR86', pauseAfter: 2500 },
  ],
  // Normal
  [
    { text: '2025 Mercedes AMG GT', pauseAfter: 2500 },
  ],
  // Normal
  [
    { text: '2024 Tesla Model S', pauseAfter: 2500 },
  ],
]

// ── Component ──

interface Props {
  services: ServiceType[]
  bodyStylePricing: BodyStylePricing[]
  userVehicles?: GarageVehicle[]
  isAuthenticated?: boolean
}

export function HeroPriceCalculator({ services, bodyStylePricing, userVehicles, isAuthenticated }: Props) {
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
  const [availableBodyStyles, setAvailableBodyStyles] = useState<string[]>([])

  // UI state
  const [showPricing, setShowPricing] = useState(false)
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [isLoadingBodyStyles, setIsLoadingBodyStyles] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  // Garage picker
  const [showGaragePicker, setShowGaragePicker] = useState(false)

  // Typewriter state
  const [placeholder, setPlaceholder] = useState('')
  const searchBarRef = useRef<HTMLDivElement>(null)
  const cancelledRef = useRef(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  // Open modal from URL param (?book=true) or custom event
  useEffect(() => {
    if (searchParams.get('book') === 'true') {
      setModalOpen(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      // Clean URL without reload
      router.replace('/', { scroll: false })
    }
  }, [searchParams, router])

  useEffect(() => {
    const handler = () => {
      setModalOpen(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('open-booking', handler)
    return () => window.removeEventListener('open-booking', handler)
  }, [])

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

  // Typewriter animation
  useEffect(() => {
    let cancelled = false
    cancelledRef.current = false

    async function typeOut(text: string) {
      for (let i = 1; i <= text.length; i++) {
        if (cancelled) return
        setPlaceholder(text.slice(0, i))
        await sleep(60)
      }
    }

    async function deleteBack(from: string, to: number) {
      for (let i = from.length - 1; i >= to; i--) {
        if (cancelled) return
        setPlaceholder(from.slice(0, i))
        await sleep(30)
      }
    }

    async function typewriterLoop() {
      while (!cancelled) {
        for (const sequence of SEQUENCES) {
          if (cancelled) return

          // Check visibility
          if (searchBarRef.current) {
            const rect = searchBarRef.current.getBoundingClientRect()
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0
            if (!isVisible) {
              await sleep(1000)
              continue
            }
          }

          if (modalOpen) {
            await sleep(1000)
            continue
          }

          // Play each step in the sequence
          for (let s = 0; s < sequence.length; s++) {
            const step = sequence[s]
            if (cancelled) return

            if (s === 0) {
              // First step: type from empty
              await typeOut(step.text)
            } else {
              // Correction step: find common prefix, delete back to it, type new
              const prev = sequence[s - 1].text
              let common = 0
              while (common < prev.length && common < step.text.length && prev[common] === step.text[common]) {
                common++
              }
              await deleteBack(prev, common)
              // Type the rest from the common prefix
              for (let i = common + 1; i <= step.text.length; i++) {
                if (cancelled) return
                setPlaceholder(step.text.slice(0, i))
                await sleep(60)
              }
            }

            await sleep(step.pauseAfter)
          }

          // Delete everything
          const lastText = sequence[sequence.length - 1].text
          await deleteBack(lastText, 0)
          await sleep(400)
        }

        // Wait 15 seconds before replaying
        await sleep(15000)
      }
    }

    typewriterLoop()
    return () => {
      cancelled = true
      cancelledRef.current = true
    }
  }, [modalOpen])

  // All models data for current make: { "2025": ["Camry", ...], "2024": [...] }
  const [allModelsData, setAllModelsData] = useState<Record<string, string[]>>({})

  // Load models from static JSON, then filter by year client-side
  const loadModels = useCallback(async (makeName: string) => {
    if (!makeName) {
      setModels([])
      setAllModelsData({})
      return
    }
    setIsLoadingModels(true)
    try {
      const res = await fetch(`/data/vehicles/models/${toSlug(makeName)}.json`)
      const data = await res.json()
      // Support both formats: year-indexed object or flat array (legacy)
      if (Array.isArray(data)) {
        setAllModelsData({})
        setModels(data)
      } else {
        setAllModelsData(data)
        // Don't set models yet — will be filtered when year is set/changed
        setModels([])
      }
    } catch {
      setModels([])
      setAllModelsData({})
    }
    setIsLoadingModels(false)
  }, [])

  // Filter models by year whenever year or allModelsData changes
  useEffect(() => {
    if (Object.keys(allModelsData).length === 0) return
    if (year && allModelsData[year]) {
      setModels(allModelsData[year])
    } else if (year) {
      // Year not found — show all models as fallback
      const all = Array.from(new Set(Object.values(allModelsData).flat())).sort()
      setModels(all)
    }
  }, [year, allModelsData])

  // Load valid body styles when model is selected
  const loadBodyStyles = useCallback(async (y: string, mk: string, mdl: string) => {
    if (!y || !mk || !mdl) {
      setAvailableBodyStyles(meta?.bodyStyles ?? [])
      return
    }
    setIsLoadingBodyStyles(true)
    try {
      const params = new URLSearchParams({ year: y, make: mk, model: mdl })
      const res = await fetch(`/api/vehicles/body-styles?${params}`)
      const data: string[] = await res.json()
      setAvailableBodyStyles(data.length > 0 ? data : meta?.bodyStyles ?? [])
      // Auto-select if only one body style
      if (data.length === 1) setBodyStyle(data[0] as BodyStyle)
    } catch {
      setAvailableBodyStyles(meta?.bodyStyles ?? [])
    }
    setIsLoadingBodyStyles(false)
  }, [meta])

  // Compute surcharge
  const surcharge = bodyStylePricing.find((b) => b.body_style === bodyStyle)?.surcharge ?? 0

  const canSeePricing = year && make && model && bodyStyle && color

  const handleSeePricing = () => {
    if (!canSeePricing) return
    setModalOpen(false)
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
    'w-full appearance-none bg-surface-widget border border-dark-grey/20 rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent-blue-500 focus:ring-1 focus:ring-accent-blue-500/30 transition-all cursor-pointer'

  return (
    <div>
      {/* ── Search Bar ── */}
      <div className="max-w-lg mx-auto" ref={searchBarRef}>
        <button
          onClick={() => setModalOpen(true)}
          className="w-full h-14 px-5 bg-surface-widget border border-dark-grey/20 rounded-2xl inline-flex items-center gap-3 hover:border-dark-grey/40 transition-all cursor-text group pulse-ring"
        >
          <SearchIcon />
          <span className="flex-1 text-left text-base text-foreground-muted">
            {placeholder || 'Search...'}
            <span className="inline-block w-[2px] h-[1.1em] bg-foreground-muted/50 ml-[1px] align-middle animate-pulse" />
          </span>
        </button>
      </div>

      {/* ── Vehicle Selection Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop — click anywhere to close */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-3xl bg-surface-widget border border-dark-grey/15 rounded-3xl p-8 md:p-10 shadow-[0_4px_60px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-widget-hover flex items-center justify-center text-foreground-muted hover:text-foreground transition-colors"
            >
              <CloseIcon />
            </button>

            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted mb-1">
                  Instant Quote
                </p>
                <h3 className="text-lg font-semibold text-foreground">
                  Enter your vehicle details
                </h3>
              </div>
              {isAuthenticated && userVehicles && userVehicles.length > 0 && (
                <button
                  onClick={() => setShowGaragePicker(!showGaragePicker)}
                  className="text-xs font-medium text-accent-blue-500 hover:text-accent-blue-400 transition-colors whitespace-nowrap mt-1"
                >
                  Choose from my garage
                </button>
              )}
            </div>

            {/* Garage vehicle picker */}
            {showGaragePicker && userVehicles && userVehicles.length > 0 && (
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {userVehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setYear(String(v.year))
                      setMake(v.make)
                      setColor(v.color || '')
                      if (v.body_style) setBodyStyle(v.body_style as BodyStyle)
                      setShowGaragePicker(false)
                      // Load models for this make, then set model
                      loadModels(v.make).then(() => setModel(v.model))
                      if (v.body_style) {
                        setAvailableBodyStyles([v.body_style])
                      } else {
                        loadBodyStyles(String(v.year), v.make, v.model)
                      }
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface-widget-hover/50 hover:bg-surface-widget-hover border border-dark-grey/10 transition-all text-left"
                  >
                    <span className="w-8 h-8 rounded-lg bg-accent-blue-500/10 text-accent-blue-500 flex items-center justify-center text-xs font-bold">
                      {v.make.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{v.year} {v.make} {v.model}</p>
                      <p className="text-xs text-foreground-muted">{[v.body_style, v.color].filter(Boolean).join(' · ')}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
              {/* Year */}
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value)
                    setModel('')
                    setBodyStyle('')
                    setShowPricing(false)
                  }}
                  className={selectClass}
                >
                  <option value="">Year</option>
                  {meta?.years.map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
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
                    <option key={m} value={m}>{m}</option>
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
                    setBodyStyle('')
                    setShowPricing(false)
                    if (e.target.value) loadBodyStyles(year, make, e.target.value)
                  }}
                  className={selectClass}
                  disabled={!make || isLoadingModels}
                >
                  <option value="">
                    {isLoadingModels ? 'Loading...' : 'Model'}
                  </option>
                  {models.map((m) => (
                    <option key={m} value={m}>{m}</option>
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
                  disabled={!model || isLoadingBodyStyles}
                >
                  <option value="">
                    {isLoadingBodyStyles ? 'Loading...' : 'Body Style'}
                  </option>
                  {availableBodyStyles.map((bs) => (
                    <option key={bs} value={bs}>{bs}</option>
                  ))}
                </select>
                <ChevronIcon className="absolute right-4 top-1/2 -translate-y-1/2" />
              </div>

              {/* Color */}
              <div className="relative">
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Color</option>
                  {meta?.colors.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronIcon className="absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleSeePricing}
              disabled={!canSeePricing}
              className="w-full h-[50px] rounded-full text-sm font-semibold bg-accent-blue-500 hover:bg-accent-blue-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {canSeePricing
                ? `See pricing for ${year} ${make} ${model}`
                : 'See My Price'}
            </button>
          </div>
        </div>
      )}

      {/* ── Pricing Results ── */}
      {showPricing && (
        <div id="pricing-results" className="max-w-6xl mx-auto pt-20 pb-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted mb-3">
              Pricing for your {year} {make} {model}
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
                        : 'border-dark-grey/15 hover:border-dark-grey'
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
                      <span className="text-xs text-foreground-muted ml-auto">
                        {service.estimated_duration_hours} Hours
                      </span>
                    </div>

                    <Link
                      href={buildBookLink(service.id)}
                      className={`block text-center py-3.5 rounded-full text-sm font-semibold transition-all ${
                        isComplete
                          ? 'bg-accent-blue-500 hover:bg-accent-blue-600 text-white'
                          : 'bg-surface-widget hover:bg-surface-widget-hover border border-dark-grey/20 text-foreground'
                      }`}
                    >
                      Book
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
