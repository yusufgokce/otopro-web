'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ThemeToggle } from './theme-toggle'

export function Nav() {
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
          ? 'bg-surface-primary/90 backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
          Oto<span className="text-accent-blue-500">Pro</span>
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
          <Link
            href="/book"
            className="bg-accent-blue-500 hover:bg-accent-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
          >
            Book Online
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-full hover:bg-surface-widget transition-colors"
          >
            <span
              className={`w-5 h-0.5 bg-foreground transition-all duration-200 ${
                open ? 'rotate-45 translate-y-1' : ''
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-foreground transition-all duration-200 ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-foreground transition-all duration-200 ${
                open ? '-rotate-45 -translate-y-1' : ''
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
          <div className="pt-3">
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="block text-center bg-accent-blue-500 hover:bg-accent-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Book Online
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
