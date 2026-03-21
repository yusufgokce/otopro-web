import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-dark-grey/30 bg-surface-primary">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold tracking-tight">
              Oto<span className="text-accent-blue-500">Pro</span>
            </span>
            <p className="text-grey text-sm mt-3 leading-relaxed">
              Professional mobile car detailing, delivered to your driveway.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Services</h4>
            <div className="space-y-2">
              <Link href="/pricing" className="block text-sm text-grey hover:text-silver">Complete Detail</Link>
              <Link href="/pricing" className="block text-sm text-grey hover:text-silver">Exterior Detail</Link>
              <Link href="/pricing" className="block text-sm text-grey hover:text-silver">Interior Detail</Link>
              <Link href="/pricing" className="block text-sm text-grey hover:text-silver">Pricing</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Resources</h4>
            <div className="space-y-2">
              <Link href="/guides" className="block text-sm text-grey hover:text-silver">Guides</Link>
              <Link href="/faq" className="block text-sm text-grey hover:text-silver">FAQ</Link>
              <Link href="/book" className="block text-sm text-grey hover:text-silver">Book Online</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Company</h4>
            <div className="space-y-2">
              <span className="block text-sm text-grey">Toronto, ON</span>
              <span className="block text-sm text-grey">hello@otopro.ca</span>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-grey/30 pt-6 text-center text-dark-grey text-sm">
          &copy; {new Date().getFullYear()} OtoPro. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
