'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ThemeToggle } from './theme-toggle'
import { UserMenu } from './user-menu'

function TypewriterLogo() {
  const fullText = 'otopro'
  const [displayed, setDisplayed] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(fullText.slice(0, i))
      if (i >= fullText.length) {
        clearInterval(interval)
        setTimeout(() => setShowCursor(false), 1500)
      }
    }, 120)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="inline-flex items-center text-2xl font-bold tracking-tight">
      <span className="glass-text">
        <span className="glass-text-inner">{displayed.slice(0, 3)}</span>
      </span>
      <span className="glass-text glass-text-accent">
        <span className="glass-text-inner">{displayed.slice(3)}</span>
      </span>
      <span
        className={`inline-block w-[2px] h-[1.1em] bg-accent-blue-500 ml-[2px] align-middle transition-opacity duration-100 ${
          showCursor ? 'opacity-100 animate-pulse' : 'opacity-0'
        }`}
      />
    </span>
  )
}

interface NavProps {
  user?: { name: string; email: string } | null
}

export function Nav({ user }: NavProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface-primary/40 backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.03)]'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
          <TypewriterLogo />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/pricing"
            className="text-sm text-foreground-muted hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/guides"
            className="text-sm text-foreground-muted hover:text-foreground transition-colors"
          >
            Guides
          </Link>
          <Link
            href="/faq"
            className="text-sm text-foreground-muted hover:text-foreground transition-colors"
          >
            FAQ
          </Link>
          <ThemeToggle />
          {user ? (
            <UserMenu userName={user.name} userEmail={user.email} />
          ) : (
            <Link
              href="/book"
              className="bg-accent-blue-500 hover:bg-accent-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
            >
              Book
            </Link>
          )}
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
          <Link
            href="/pricing"
            onClick={() => setOpen(false)}
            className="block py-3 text-sm text-foreground-muted hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/guides"
            onClick={() => setOpen(false)}
            className="block py-3 text-sm text-foreground-muted hover:text-foreground transition-colors"
          >
            Guides
          </Link>
          <Link
            href="/faq"
            onClick={() => setOpen(false)}
            className="block py-3 text-sm text-foreground-muted hover:text-foreground transition-colors"
          >
            FAQ
          </Link>
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
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="block text-center bg-accent-blue-500 hover:bg-accent-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Book
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
