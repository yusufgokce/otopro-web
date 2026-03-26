'use client'

import { useState, useEffect, useRef } from 'react'

const BADGES = ['Certified Detailers', 'Fully Insured', 'Satisfaction Guaranteed', 'Mobile Service']

function BadgePair({ b1, b2 }: { b1: string; b2: string }) {
  return (
    <div className="flex items-center gap-2.5 absolute inset-0 justify-center px-4">
      <span className="text-foreground-muted text-[9px] tracking-[0.3px] uppercase font-medium whitespace-nowrap">
        {b1}
      </span>
      <span className="w-px h-2.5 bg-dark-grey/30 shrink-0" />
      <span className="text-foreground-muted text-[9px] tracking-[0.3px] uppercase font-medium whitespace-nowrap">
        {b2}
      </span>
    </div>
  )
}

export function TrustBadges() {
  const [index, setIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayIndex, setDisplayIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(1)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const interval = setInterval(() => {
      setNextIndex((prev) => {
        const next = (displayIndex + 1) % BADGES.length
        return next
      })
      setIsTransitioning(true)

      // After transition completes, swap
      timeoutRef.current = setTimeout(() => {
        setDisplayIndex((prev) => (prev + 1) % BADGES.length)
        setIsTransitioning(false)
      }, 500)
    }, 3000)

    return () => {
      clearInterval(interval)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [displayIndex])

  const current1 = BADGES[displayIndex % BADGES.length]
  const current2 = BADGES[(displayIndex + 1) % BADGES.length]
  const next1 = BADGES[(displayIndex + 1) % BADGES.length]
  const next2 = BADGES[(displayIndex + 2) % BADGES.length]

  return (
    <>
      {/* Desktop — show all 4, no animation */}
      <div className="hidden md:inline-flex items-center justify-center gap-x-4 gap-y-2 mb-10 px-5 py-2.5 rounded-full bg-surface-widget border border-dark-grey/15">
        {BADGES.map((badge, i) => (
          <span key={badge} className="flex items-center gap-4 text-foreground-muted text-xs tracking-[0.5px] uppercase font-medium">
            {i > 0 && <span className="w-px h-3 bg-dark-grey/30" />}
            {badge}
          </span>
        ))}
      </div>

      {/* Mobile — two layers that crossfade/slide */}
      <div className="md:hidden inline-flex items-center justify-center mb-10 py-2.5 rounded-full bg-surface-widget border border-dark-grey/15 overflow-hidden relative" style={{ height: 36, minWidth: 280 }}>
        {/* Current pair — slides out left */}
        <div
          className="absolute inset-0 flex items-center justify-center px-4 gap-2.5 transition-all duration-500 ease-in-out"
          style={{
            transform: isTransitioning ? 'translateX(-100%)' : 'translateX(0)',
            opacity: isTransitioning ? 0 : 1,
          }}
        >
          <span className="text-foreground-muted text-[9px] tracking-[0.3px] uppercase font-medium whitespace-nowrap">
            {current1}
          </span>
          <span className="w-px h-2.5 bg-dark-grey/30 shrink-0" />
          <span className="text-foreground-muted text-[9px] tracking-[0.3px] uppercase font-medium whitespace-nowrap">
            {current2}
          </span>
        </div>

        {/* Next pair — slides in from right */}
        <div
          className="absolute inset-0 flex items-center justify-center px-4 gap-2.5 transition-all duration-500 ease-in-out"
          style={{
            transform: isTransitioning ? 'translateX(0)' : 'translateX(100%)',
            opacity: isTransitioning ? 1 : 0,
          }}
        >
          <span className="text-foreground-muted text-[9px] tracking-[0.3px] uppercase font-medium whitespace-nowrap">
            {next1}
          </span>
          <span className="w-px h-2.5 bg-dark-grey/30 shrink-0" />
          <span className="text-foreground-muted text-[9px] tracking-[0.3px] uppercase font-medium whitespace-nowrap">
            {next2}
          </span>
        </div>
      </div>
    </>
  )
}
