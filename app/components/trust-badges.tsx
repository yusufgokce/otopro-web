'use client'

import { useRef, useEffect, useState } from 'react'

const BADGES = ['certified detailers', 'fully insured', 'satisfaction guaranteed', 'mobile service']

export function TrustBadges() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const posRef = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const speed = 0.3 // px per frame (~18px/sec at 60fps)

    function tick() {
      if (!isPaused && el) {
        posRef.current += speed
        // Reset when first set scrolls fully off-screen
        const halfWidth = el.scrollWidth / 2
        if (posRef.current >= halfWidth) {
          posRef.current -= halfWidth
        }
        el.style.transform = `translateX(-${posRef.current}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPaused])

  // Duplicate badges enough to fill the screen and scroll seamlessly
  const items = [...BADGES, ...BADGES, ...BADGES, ...BADGES]

  return (
    <div
      className="mb-10 overflow-hidden rounded-full bg-surface-widget border border-dark-grey/15 cursor-grab active:cursor-grabbing"
      style={{ maxWidth: '100%' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div
        ref={scrollRef}
        className="flex items-center gap-0 whitespace-nowrap py-2.5 will-change-transform"
      >
        {items.map((badge, i) => (
          <span
            key={i}
            className="text-foreground-muted text-[11px] md:text-xs tracking-[0.5px] font-medium shrink-0 px-5"
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  )
}
