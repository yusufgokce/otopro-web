import Link from 'next/link'

export function Footer() {
  return (
    <footer className="sticky bottom-0 z-0 bg-surface-widget h-screen rounded-t-[32px] overflow-hidden">
      <div className="relative h-full">

        {/* ── Main footer content ── */}
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto w-full px-8 pt-10 md:pt-20">
          {/* Left side — columns */}
          <div className="flex-1">
            {/* Columns — stacked on mobile, 3-col on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16">
              {/* Services */}
              <div>
                <h4 className="text-[11px] font-semibold tracking-[2px] uppercase text-foreground-muted mb-3 md:mb-5">
                  Services
                </h4>
                <div className="space-y-2 md:space-y-3.5">
                  <Link href="/pricing" className="block text-xs md:text-sm text-foreground-muted hover:text-foreground transition-colors">
                    Complete Detail
                  </Link>
                  <Link href="/pricing" className="block text-xs md:text-sm text-foreground-muted hover:text-foreground transition-colors">
                    Exterior Detail
                  </Link>
                  <Link href="/pricing" className="block text-xs md:text-sm text-foreground-muted hover:text-foreground transition-colors">
                    Interior Detail
                  </Link>
                  <Link href="/pricing" className="block text-xs md:text-sm text-foreground-muted hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </div>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-[11px] font-semibold tracking-[2px] uppercase text-foreground-muted mb-3 md:mb-5">
                  Resources
                </h4>
                <div className="space-y-2 md:space-y-3.5">
                  <Link href="/guides" className="block text-xs md:text-sm text-foreground-muted hover:text-foreground transition-colors">
                    Guides
                  </Link>
                  <Link href="/faq" className="block text-xs md:text-sm text-foreground-muted hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                  <Link href="/?book=true" className="block text-xs md:text-sm text-foreground-muted hover:text-foreground transition-colors">
                    Book Online
                  </Link>
                </div>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-[11px] font-semibold tracking-[2px] uppercase text-foreground-muted mb-3 md:mb-5">
                  Company
                </h4>
                <div className="space-y-2 md:space-y-3.5">
                  <span className="block text-xs md:text-sm text-foreground-muted">Toronto, ON</span>
                  <a
                    href="mailto:hello@otopro.ca"
                    className="block text-xs md:text-sm text-foreground-muted hover:text-foreground transition-colors break-all md:break-normal"
                  >
                    hello@otopro.ca
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right side — vertical copyright (desktop) */}
          <div className="hidden md:flex items-end justify-end pl-10">
            <span
              className="text-[11px] tracking-[2px] uppercase text-foreground-muted/50 whitespace-nowrap"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              &copy; {new Date().getFullYear()} otopro. all rights reserved.
            </span>
          </div>
        </div>

        {/* ── Descriptor text + mobile copyright — tight below columns ── */}
        <div className="max-w-6xl mx-auto px-8 mt-6 md:mt-8">
          <p className="text-foreground-muted text-sm leading-relaxed max-w-[320px]">
            Professional mobile car detailing, delivered to your driveway. No prep needed.
          </p>
          <p className="md:hidden text-foreground-muted/50 text-[10px] tracking-[0.5px] mt-2">
            &copy; {new Date().getFullYear()} otopro. All rights reserved.
          </p>
        </div>

        {/* ── Giant oversized logo — pinned to absolute bottom, spans full width ── */}
        <div
          className="absolute bottom-0 left-0 right-0 w-full pointer-events-none select-none overflow-hidden"
          style={{ aspectRatio: '429 / 105' }}
        >
          <svg
            viewBox="85 -37 429 175"
            className="w-full"
            preserveAspectRatio="xMidYMin meet"
            style={{ display: 'block' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="300"
              y="105"
              textAnchor="middle"
              className="fill-foreground"
              style={{
                fontFamily: 'Satoshi, sans-serif',
                fontSize: '140px',
                fontWeight: 900,
                letterSpacing: '-0.03em',
              }}
            >
              otopro
            </text>
          </svg>
        </div>
      </div>
    </footer>
  )
}
