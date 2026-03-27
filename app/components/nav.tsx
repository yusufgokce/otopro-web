'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ThemeToggle } from './theme-toggle'
import { UserMenu } from './user-menu'

const NAV_LINKS = [
  { href: '/', label: 'otopro' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/guides', label: 'Guides' },
  { href: '/faq', label: 'FAQ' },
]

function TypewriterLogo({ animate: shouldAnimate }: { animate: boolean }) {
  const [displayed, setDisplayed] = useState(shouldAnimate ? '' : 'otopro')
  const [showCursor, setShowCursor] = useState(shouldAnimate)

  useEffect(() => {
    if (!shouldAnimate) return

    const full = 'otopro.ca'
    const final = 'otopro'
    let cancelled = false

    async function animate() {
      // Phase 1: type out "otopro.ca"
      for (let i = 1; i <= full.length; i++) {
        if (cancelled) return
        setDisplayed(full.slice(0, i))
        await sleep(120)
      }

      // Phase 2: pause on "otopro.ca"
      await sleep(1000)

      // Phase 3: delete back to "otopro"
      for (let i = full.length - 1; i >= final.length; i--) {
        if (cancelled) return
        setDisplayed(full.slice(0, i))
        await sleep(80)
      }

      // Phase 4: cursor blinks then fades
      await sleep(1500)
      if (!cancelled) setShowCursor(false)
    }

    animate()
    return () => { cancelled = true }
  }, [shouldAnimate])

  return (
    <span className="inline-flex items-center text-2xl font-bold tracking-tight text-foreground" style={{ fontFamily: "Satoshi, sans-serif" }}>
      {displayed}
      {showCursor && (
        <span
          className="inline-block w-[2px] h-[1.1em] bg-foreground ml-[2px] align-middle opacity-100 animate-pulse"
        />
      )}
    </span>
  )
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface NavProps {
  user?: { name: string; email: string } | null
}

export function Nav({ user }: NavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface-primary/65 backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.03)]'
          : 'bg-transparent'
      }`}
    >
      <div className="relative flex items-end px-6 pb-0 pt-5 max-w-6xl mx-auto">
        {/* Left: Logo as a tab link with indicator */}
        <Link href="/" className="relative pb-4 group mr-auto">
          <TypewriterLogo animate={pathname === '/'} />
          <span
            className={`absolute bottom-0 left-0 right-0 h-[3px] rounded-t transition-all ${
              isActive('/')
                ? 'bg-accent-blue-500'
                : 'opacity-0 group-hover:opacity-100 bg-foreground-muted/40'
            }`}
          />
        </Link>

        {/* Desktop links — tab style, bottom-aligned with header */}
        <div className="hidden md:flex items-end gap-6">
          {NAV_LINKS.filter(l => l.href !== '/').map(link => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative pb-4 group"
              >
                <span
                  className={`text-sm font-medium tracking-normal transition-colors ${
                    active ? 'text-foreground' : 'text-foreground-muted hover:text-foreground'
                  }`}
                >
                  {link.label}
                </span>
                <span
                  className={`absolute bottom-0 left-0 right-0 h-[3px] rounded-t transition-all ${
                    active
                      ? 'bg-accent-blue-500'
                      : 'opacity-0 group-hover:opacity-100 bg-foreground-muted/40'
                  }`}
                />
              </Link>
            )
          })}
          {/* Center these with the tab link text (offset by half of pb-4 = pb-2) */}
          <div className="pb-[9px]"><ThemeToggle /></div>
          {user ? (
            <div className="pb-2"><UserMenu userName={user.name} userEmail={user.email} /></div>
          ) : null}
          <div className="pb-[16px]">
            {pathname === '/' ? (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-booking'))}
                className="bg-accent-blue-500 hover:bg-accent-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors cursor-pointer"
              >
                Book
              </button>
            ) : (
              <Link
                href="/?book=true"
                className="bg-accent-blue-500 hover:bg-accent-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
              >
                Book
              </Link>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-widget transition-colors"
          >
            <span
              className={`absolute w-5 h-0.5 bg-foreground transition-all duration-300 ${
                open ? 'rotate-45 translate-y-0' : '-translate-y-[5px]'
              }`}
            />
            <span
              className={`absolute w-5 h-0.5 bg-foreground transition-all duration-300 ${
                open ? 'opacity-0 scale-x-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute w-5 h-0.5 bg-foreground transition-all duration-300 ${
                open ? '-rotate-45 translate-y-0' : 'translate-y-[5px]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-6 space-y-1 bg-surface-primary animate-in fade-in slide-in-from-top-2 duration-200">
          {NAV_LINKS.filter(l => l.href !== '/').map(link => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block py-3 text-sm font-medium tracking-normal transition-colors ${
                  active ? 'text-foreground' : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                <span className="flex items-center gap-3">
                  {active && <span className="w-[3px] h-4 bg-accent-blue-500 rounded-full" />}
                  {link.label}
                </span>
              </Link>
            )
          })}
          {user && (
            <>
              <div className="border-t border-dark-grey/30 my-2" />
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="block py-3 text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/garage"
                onClick={() => setOpen(false)}
                className="block py-3 text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                My Garage
              </Link>
              <Link
                href="/dashboard/bookings"
                onClick={() => setOpen(false)}
                className="block py-3 text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                My Bookings
              </Link>
            </>
          )}
          <div className="pt-3">
            {pathname === '/' ? (
              <button
                onClick={() => {
                  setOpen(false)
                  window.dispatchEvent(new CustomEvent('open-booking'))
                }}
                className="block w-full text-center bg-accent-blue-500 hover:bg-accent-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors cursor-pointer"
              >
                Book
              </button>
            ) : (
              <Link
                href="/?book=true"
                onClick={() => setOpen(false)}
                className="block text-center bg-accent-blue-500 hover:bg-accent-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Book
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
