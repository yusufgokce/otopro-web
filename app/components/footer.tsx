import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0A0A0F]">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold tracking-tight">
              Oto<span className="text-[#6B4EFF]">Pro</span>
            </span>
            <p className="text-white/40 text-sm mt-3 leading-relaxed">
              Professional mobile car detailing, delivered to your driveway.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Services</h4>
            <div className="space-y-2">
              <Link href="/pricing" className="block text-sm text-white/40 hover:text-white/70">Complete Detail</Link>
              <Link href="/pricing" className="block text-sm text-white/40 hover:text-white/70">Exterior Detail</Link>
              <Link href="/pricing" className="block text-sm text-white/40 hover:text-white/70">Interior Detail</Link>
              <Link href="/pricing" className="block text-sm text-white/40 hover:text-white/70">Pricing</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Resources</h4>
            <div className="space-y-2">
              <Link href="/guides" className="block text-sm text-white/40 hover:text-white/70">Guides</Link>
              <Link href="/faq" className="block text-sm text-white/40 hover:text-white/70">FAQ</Link>
              <Link href="/book" className="block text-sm text-white/40 hover:text-white/70">Book Online</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Company</h4>
            <div className="space-y-2">
              <span className="block text-sm text-white/40">Toronto, ON</span>
              <span className="block text-sm text-white/40">hello@otopro.ca</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-6 text-center text-white/30 text-sm">
          &copy; {new Date().getFullYear()} OtoPro. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
