import Link from 'next/link'
import { NavServer } from '../components/nav-server'
import { Footer } from '../components/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing | otopro',
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
      'High gloss spray wax': true,
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
      'High gloss spray wax': true,
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
      'High gloss spray wax': false,
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
  { style: 'Crossover / Convertible / Wagon', surcharge: '+$15' },
  { style: 'SUV', surcharge: '+$30' },
  { style: 'Minivan', surcharge: '+$35' },
  { style: 'Truck / Van', surcharge: '+$40' },
]

const SERVICE_NAMES = Object.keys(PACKAGES[0].services)

export default function PricingPage() {
  return (
    <>
    <main className="relative z-10 min-h-screen bg-surface-primary text-foreground rounded-b-[32px] shadow-[0_4px_40px_rgba(0,0,0,0.15)]">
      <NavServer />

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-3">
          Simple, transparent pricing
        </h1>
        <p className="text-dark-silver text-center mb-12 max-w-xl mx-auto">
          All prices shown are base rates. A small surcharge may apply for larger vehicle types.
        </p>

        {/* Package cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative rounded-2xl p-6 border ${
                pkg.tag
                  ? 'bg-accent-blue-500/[0.08] border-accent-blue-500/40'
                  : 'bg-surface-widget border-dark-grey'
              }`}
            >
              {pkg.tag && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {pkg.tag}
                </div>
              )}
              <h3 className="font-semibold text-lg mb-1">{pkg.name}</h3>
              <div className="flex items-end gap-1 mb-4">
                <span className="text-4xl font-bold text-accent-blue-500">${pkg.price}</span>
                <span className="text-grey text-sm mb-1">{pkg.hours} Hours</span>
              </div>
              <Link
                href="/book"
                className={`block text-center py-3 rounded-xl text-sm font-semibold transition-colors ${
                  pkg.tag
                    ? 'bg-accent-blue-500 hover:bg-accent-blue-600 text-white'
                    : 'bg-surface-widget-hover hover:bg-foreground-muted/20 border border-dark-grey/30 text-foreground'
                }`}
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <h2 className="text-2xl font-bold text-center mb-8">Package comparison</h2>

        <div className="bg-surface-widget border border-dark-grey rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-grey/15">
                <th className="text-left p-4 text-grey font-medium">Service</th>
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
                  className={i < SERVICE_NAMES.length - 1 ? 'border-b border-dark-grey/15' : ''}
                >
                  <td className="p-4 text-dark-silver">{service}</td>
                  {PACKAGES.map((pkg) => (
                    <td key={pkg.name} className="p-4 text-center">
                      {pkg.services[service as keyof typeof pkg.services] ? (
                        <span className="text-accent-blue-500">&#10003;</span>
                      ) : (
                        <span className="text-dark-grey">&mdash;</span>
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
        <p className="text-dark-silver text-center mb-8 max-w-md mx-auto">
          Larger vehicles require more time and product. Here&apos;s the breakdown.
        </p>

        <div className="max-w-md mx-auto bg-surface-widget border border-dark-grey rounded-2xl overflow-hidden">
          {SURCHARGES.map((s, i) => (
            <div
              key={s.style}
              className={`flex items-center justify-between p-4 text-sm ${
                i < SURCHARGES.length - 1 ? 'border-b border-dark-grey/15' : ''
              }`}
            >
              <span className="text-foreground-muted">{s.style}</span>
              <span className={s.surcharge === '$0' ? 'text-foreground-muted/60' : 'text-accent-blue-500 font-medium'}>
                {s.surcharge}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/book"
            className="inline-block bg-accent-blue-500 hover:bg-accent-blue-600 text-white font-semibold px-10 py-4 rounded-2xl text-lg transition-colors"
          >
            Book a Detail
          </Link>
        </div>
      </section>

    </main>
    <Footer />
    </>
  )
}
