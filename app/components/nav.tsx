'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0F]/80 backdrop-blur-lg border-b border-white/[0.06]">
      <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Oto<span className="text-[#6B4EFF]">Pro</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/pricing" className="text-sm text-white/60 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/guides" className="text-sm text-white/60 hover:text-white transition-colors">
            Guides
          </Link>
          <Link href="/faq" className="text-sm text-white/60 hover:text-white transition-colors">
            FAQ
          </Link>
          <Link
            href="/book"
            className="bg-[#6B4EFF] hover:bg-[#5A3EEE] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Book Online
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
        >
          <span className={`w-5 h-px bg-white transition-transform ${open ? 'rotate-45 translate-y-1' : ''}`} />
          <span className={`w-5 h-px bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-px bg-white transition-transform ${open ? '-rotate-45 -translate-y-1' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/[0.06] px-6 py-4 space-y-3 bg-[#0A0A0F]">
          <Link href="/pricing" onClick={() => setOpen(false)} className="block text-sm text-white/60 hover:text-white">Pricing</Link>
          <Link href="/guides" onClick={() => setOpen(false)} className="block text-sm text-white/60 hover:text-white">Guides</Link>
          <Link href="/faq" onClick={() => setOpen(false)} className="block text-sm text-white/60 hover:text-white">FAQ</Link>
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="block text-center bg-[#6B4EFF] hover:bg-[#5A3EEE] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Book Online
          </Link>
        </div>
      )}
    </nav>
  )
}
