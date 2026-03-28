'use client'

import { useRef, useEffect, useState } from 'react'

const BADGES = ['certified detailers', 'fully insured', 'satisfaction guaranteed', 'mobile service', 'canadian owned', 'based in markham']

export function TrustBadges() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [visible, setVisible] = useState(true)
  const [hovered, setHovered] = useState(false)
  const posRef = useRef(0)
  const rafRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  // Auto-fade after 10 seconds
  useEffect(() => {
    timerRef.current = setTimeout(() => setVisible(false), 10000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  // Hover restores visibility and resets the timer
  useEffect(() => {
    if (hovered) {
      setVisible(true)
      setIsPaused(true)
      if (timerRef.current) clearTimeout(timerRef.current)
    } else {
      setIsPaused(false)
      // Restart fade timer on mouse leave
      timerRef.current = setTimeout(() => setVisible(false), 10000)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [hovered])

  // Marquee scroll animation
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const speed = 0.15

    function tick() {
      if (!isPaused && el) {
        posRef.current += speed
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

  const items = [...BADGES, ...BADGES, ...BADGES, ...BADGES]

  return (
    <div
      className="w-full overflow-hidden backdrop-blur-sm border-b border-foreground-muted/10 transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
    >
      <div
        ref={scrollRef}
        className="flex items-center whitespace-nowrap py-1.5 will-change-transform"
      >
        {items.map((badge, i) => (
          <span
            key={i}
            className="text-foreground-muted/60 text-[10px] md:text-[11px] tracking-[0.5px] font-medium shrink-0 px-8 md:px-12"
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  )
}
