import Link from 'next/link'
import { Nav } from '../components/nav'
import { Footer } from '../components/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing | OtoPro',
  description: 'Transparent pricing for professional mobile car detailing. No hidden fees.',
}

const PACKAGES = [
  {
    name: 'Exterior Detail',
    price: 99,
    hours: 2,
    tag: null,
    services: {
      'Full hand wash & dry': true,
      'Wheel & tire cleaning': true,
      'Tire shine application': true,
      'Window & mirror cleaning': true,
      'Door jamb detail': true,
      'High-gloss spray wax': true,
      'Wheel degreasing': false,
      'Deep vacuum & crevice detail': false,
      'Full surface wipe-down': false,
      'Leather conditioning': false,
      'Steam cleaning': false,
      'Carpet & upholstery shampoo': false,
      'Salt & stain removal': false,
      'Screen cleaning': false,
    },
  },
  {
    name: 'Complete Package',
    price: 219,
    hours: 4,
    tag: 'Most Popular',
    services: {
      'Full hand wash & dry': true,
      'Wheel & tire cleaning': true,
      'Tire shine application': true,
      'Window & mirror cleaning': true,
      'Door jamb detail': true,
      'High-gloss spray wax': true,
      'Wheel degreasing': true,
      'Deep vacuum & crevice detail': true,
      'Full surface wipe-down': true,
      'Leather conditioning': true,
      'Steam cleaning': true,
      'Carpet & upholstery shampoo': true,
      'Salt & stain removal': true,
      'Screen cleaning': true,
    },
  },
  {
    name: 'Interior Detail',
    price: 149,
    hours: 2.5,
    tag: null,
    services: {
      'Full hand wash & dry': false,
      'Wheel & tire cleaning': false,
      'Tire shine application': false,
      'Window & mirror cleaning': true,
      'Door jamb detail': false,
      'High-gloss spray wax': false,
      'Wheel degreasing': false,
      'Deep vacuum & crevice detail': true,
      'Full surface wipe-down': true,
      'Leather conditioning': true,
      'Steam cleaning': true,
      'Carpet & upholstery shampoo': true,
      'Salt & stain removal': true,
      'Screen cleaning': true,
    },
  },
]

const SURCHARGES = [
  { style: 'Sedan / Coupe / Hatchback', surcharge: '$0' },
  { style: 'Convertible / Wagon', surcharge: '+$15' },
  { style: 'SUV', surcharge: '+$30' },
  { style: 'Minivan', surcharge: '+$35' },
  { style: 'Truck / Van', surcharge: '+$40' },
]

const SERVICE_NAMES = Object.keys(PACKAGES[0].services)

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white">
      <Nav />

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-3">
          Simple, transparent pricing
        </h1>
        <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
          All prices shown are base rates. A small surcharge may apply for larger vehicle types.
        </p>

        {/* Package cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative rounded-2xl p-6 border ${
                pkg.tag
                  ? 'bg-[#6B4EFF]/[0.08] border-[#6B4EFF]/40'
                  : 'bg-white/[0.04] border-white/[0.08]'
              }`}
            >
              {pkg.tag && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6B4EFF] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {pkg.tag}
                </div>
              )}
              <h3 className="font-semibold text-lg mb-1">{pkg.name}</h3>
              <div className="flex items-end gap-1 mb-4">
                <span className="text-4xl font-bold text-[#6B4EFF]">${pkg.price}</span>
                <span className="text-white/40 text-sm mb-1">~{pkg.hours} hrs</span>
              </div>
              <Link
                href="/book"
                className={`block text-center py-3 rounded-xl text-sm font-semibold transition-colors ${
                  pkg.tag
                    ? 'bg-[#6B4EFF] hover:bg-[#5A3EEE] text-white'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                }`}
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <h2 className="text-2xl font-bold text-center mb-8">Package comparison</h2>

        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left p-4 text-white/40 font-medium">Service</th>
                {PACKAGES.map((p) => (
                  <th key={p.name} className="p-4 text-center font-semibold">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SERVICE_NAMES.map((service, i) => (
                <tr
                  key={service}
                  className={i < SERVICE_NAMES.length - 1 ? 'border-b border-white/[0.04]' : ''}
                >
                  <td className="p-4 text-white/60">{service}</td>
                  {PACKAGES.map((pkg) => (
                    <td key={pkg.name} className="p-4 text-center">
                      {pkg.services[service as keyof typeof pkg.services] ? (
                        <span className="text-[#6B4EFF]">&#10003;</span>
                      ) : (
                        <span className="text-white/15">&mdash;</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Body style surcharges */}
        <h2 className="text-2xl font-bold text-center mt-20 mb-3">Body style surcharges</h2>
        <p className="text-white/50 text-center mb-8 max-w-md mx-auto">
          Larger vehicles require more time and product. Here&apos;s the breakdown.
        </p>

        <div className="max-w-md mx-auto bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
          {SURCHARGES.map((s, i) => (
            <div
              key={s.style}
              className={`flex items-center justify-between p-4 text-sm ${
                i < SURCHARGES.length - 1 ? 'border-b border-white/[0.04]' : ''
              }`}
            >
              <span className="text-white/70">{s.style}</span>
              <span className={s.surcharge === '$0' ? 'text-white/30' : 'text-[#A48FFF] font-medium'}>
                {s.surcharge}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/book"
            className="inline-block bg-[#6B4EFF] hover:bg-[#5A3EEE] text-white font-semibold px-10 py-4 rounded-2xl text-lg transition-colors"
          >
            Book a Detail
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
