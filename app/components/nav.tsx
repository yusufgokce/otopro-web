'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ThemeToggle } from './theme-toggle'

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-surface-primary/80 backdrop-blur-lg border-b border-dark-grey/30">
      <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
          Oto<span className="text-accent-blue-500">Pro</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5">
          <Link href="/pricing" className="text-sm text-foreground-secondary hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/guides" className="text-sm text-foreground-secondary hover:text-foreground transition-colors">
            Guides
          </Link>
          <Link href="/faq" className="text-sm text-foreground-secondary hover:text-foreground transition-colors">
            FAQ
          </Link>
          <ThemeToggle />
          <Link
            href="/book"
            className="bg-accent-blue-500 hover:bg-accent-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Book Online
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-1.5"
          >
            <span className={`w-5 h-px bg-foreground transition-transform ${open ? 'rotate-45 translate-y-1' : ''}`} />
            <span className={`w-5 h-px bg-foreground transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-px bg-foreground transition-transform ${open ? '-rotate-45 -translate-y-1' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-dark-grey/30 px-6 py-4 space-y-3 bg-surface-primary">
          <Link href="/pricing" onClick={() => setOpen(false)} className="block text-sm text-foreground-secondary hover:text-foreground">Pricing</Link>
          <Link href="/guides" onClick={() => setOpen(false)} className="block text-sm text-foreground-secondary hover:text-foreground">Guides</Link>
          <Link href="/faq" onClick={() => setOpen(false)} className="block text-sm text-foreground-secondary hover:text-foreground">FAQ</Link>
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="block text-center bg-accent-blue-500 hover:bg-accent-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Book Online
          </Link>
        </div>
      )}
    </nav>
  )
}
