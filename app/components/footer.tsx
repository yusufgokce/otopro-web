import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-dark-grey/20">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold tracking-tight">
              Oto<span className="text-accent-blue-500">Pro</span>
            </span>
            <p className="text-foreground-muted text-sm mt-4 leading-relaxed max-w-[240px]">
              Professional mobile car detailing, delivered to your driveway.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold tracking-[1px] uppercase text-foreground-muted mb-4">
              Services
            </h4>
            <div className="space-y-3">
              <Link href="/pricing" className="block text-sm text-foreground-muted hover:text-foreground transition-colors">
                Complete Detail
              </Link>
              <Link href="/pricing" className="block text-sm text-foreground-muted hover:text-foreground transition-colors">
                Exterior Detail
              </Link>
              <Link href="/pricing" className="block text-sm text-foreground-muted hover:text-foreground transition-colors">
                Interior Detail
              </Link>
              <Link href="/pricing" className="block text-sm text-foreground-muted hover:text-foreground transition-colors">
                Pricing
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold tracking-[1px] uppercase text-foreground-muted mb-4">
              Resources
            </h4>
            <div className="space-y-3">
              <Link href="/guides" className="block text-sm text-foreground-muted hover:text-foreground transition-colors">
                Guides
              </Link>
              <Link href="/faq" className="block text-sm text-foreground-muted hover:text-foreground transition-colors">
                FAQ
              </Link>
              <Link href="/book" className="block text-sm text-foreground-muted hover:text-foreground transition-colors">
                Book Online
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold tracking-[1px] uppercase text-foreground-muted mb-4">
              Company
            </h4>
            <div className="space-y-3">
              <span className="block text-sm text-foreground-muted">Toronto, ON</span>
              <a
                href="mailto:hello@otopro.ca"
                className="block text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                hello@otopro.ca
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-grey/20 pt-8 text-center text-foreground-muted text-xs tracking-[0.3px]">
          &copy; {new Date().getFullYear()} OtoPro. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
