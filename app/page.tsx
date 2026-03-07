import Link from 'next/link'
import { Nav } from './components/nav'
import { Footer } from './components/footer'

const PACKAGES = [
  {
    name: 'Exterior Detail',
    price: 99,
    hours: 2,
    popular: false,
    desc: 'A thorough exterior refresh — hand wash, polish, and protection.',
    exterior: [
      'Full hand wash & dry',
      'Wheel & tire cleaning',
      'Tire shine application',
      'Window & mirror cleaning',
      'Door jamb detail',
      'High-gloss spray wax',
    ],
    interior: [],
  },
  {
    name: 'Complete Package',
    price: 219,
    hours: 4,
    popular: true,
    desc: 'Our most popular — full interior and exterior detail, head to toe.',
    exterior: [
      'Full hand wash & dry',
      'Wheel degreasing & tire shine',
      'Window & mirror cleaning',
      'Door jamb detail',
      'High-gloss spray wax',
    ],
    interior: [
      'Deep vacuum & crevice detail',
      'Full surface wipe-down',
      'Leather conditioning',
      'Steam cleaning',
      'Carpet & upholstery shampoo',
      'Salt & stain removal',
    ],
  },
  {
    name: 'Interior Detail',
    price: 149,
    hours: 2.5,
    popular: false,
    desc: 'Deep clean every surface inside your vehicle — like-new results.',
    exterior: [],
    interior: [
      'Deep vacuum & crevice detail',
      'Full surface wipe-down',
      'Leather conditioning',
      'Steam cleaning',
      'Carpet & upholstery shampoo',
      'Salt & stain removal',
      'Window & mirror cleaning',
      'Screen cleaning',
    ],
  },
]

const FEATURES = [
  { label: 'Mobile service at your door', us: true, them: false },
  { label: 'Vetted & certified detailers', us: true, them: false },
  { label: 'Transparent pricing', us: true, them: false },
  { label: 'Online booking in under 2 min', us: true, them: false },
  { label: 'Satisfaction guarantee', us: true, them: false },
  { label: 'Body-style-adjusted pricing', us: true, them: false },
  { label: 'No hidden fees', us: true, them: true },
]

const FAQS = [
  {
    q: 'Do I need to provide water or electricity?',
    a: 'No. Our detailers arrive fully equipped with everything needed including water, power, and premium products.',
  },
  {
    q: 'How quickly can I get my car detailed?',
    a: 'You can book as early as next day. Choose your preferred date and time during the booking process.',
  },
  {
    q: 'What happens if I\'m not satisfied?',
    a: 'We stand behind our work. If you\'re not happy with the results, contact us and we\'ll make it right.',
  },
  {
    q: 'Is it safe for luxury or exotic vehicles?',
    a: 'Absolutely. Our detailers are trained on all vehicle types and use pH-balanced, paint-safe products suitable for any finish.',
  },
  {
    q: 'Can I reschedule or cancel?',
    a: 'Yes. You can reschedule up to 2 times per booking. Cancellations are free with 24-hour notice.',
  },
  {
    q: 'Do prices change based on my vehicle?',
    a: 'Base pricing is the same for all vehicles. A small surcharge may apply for larger body styles like SUVs and vans.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white">
      <Nav />

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-block bg-[#6B4EFF]/10 border border-[#6B4EFF]/30 text-[#A48FFF] text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          Mobile Detailing &middot; At Your Door
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
          Book the best car{' '}
          <span className="text-[#6B4EFF]">detailing</span>
          <br />
          near you.
        </h1>

        <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Professional interior and exterior car detailing, delivered to your
          driveway. Book in under a minute — we bring everything.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/book"
            className="bg-[#6B4EFF] hover:bg-[#5A3EEE] text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-colors"
          >
            Book a Detail
          </Link>
          <a
            href="#how-it-works"
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-colors"
          >
            How It Works
          </a>
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-white/30 text-sm">
          <span>Certified Detailers</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Fully Insured</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Satisfaction Guaranteed</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Eco-Friendly Products</span>
        </div>
      </section>

      {/* ── Packages ── */}
      <section id="packages" className="max-w-6xl mx-auto px-6 pb-28">
        <h2 className="text-3xl font-bold text-center mb-3">Our Packages</h2>
        <p className="text-white/50 text-center mb-12">
          Transparent pricing. No hidden fees. Surcharges may apply for larger vehicles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative rounded-2xl p-6 border transition-colors ${
                pkg.popular
                  ? 'bg-[#6B4EFF]/[0.08] border-[#6B4EFF]/40'
                  : 'bg-white/[0.04] border-white/[0.08] hover:border-[#6B4EFF]/30'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6B4EFF] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="font-semibold text-lg mb-1">{pkg.name}</h3>
              <p className="text-white/40 text-sm mb-4">{pkg.desc}</p>

              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold text-[#6B4EFF]">${pkg.price}</span>
                <span className="text-white/40 text-sm mb-1">~{pkg.hours} hrs</span>
              </div>

              {pkg.exterior.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs text-white/40 uppercase tracking-wider">Exterior</span>
                  <ul className="mt-2 space-y-1.5">
                    {pkg.exterior.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-white/70">
                        <span className="text-[#6B4EFF] mt-0.5">&#10003;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pkg.interior.length > 0 && (
                <div className="mb-6">
                  <span className="text-xs text-white/40 uppercase tracking-wider">Interior</span>
                  <ul className="mt-2 space-y-1.5">
                    {pkg.interior.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-white/70">
                        <span className="text-[#6B4EFF] mt-0.5">&#10003;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link
                href="/book"
                className={`block text-center py-3 rounded-xl text-sm font-semibold transition-colors ${
                  pkg.popular
                    ? 'bg-[#6B4EFF] hover:bg-[#5A3EEE] text-white'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                }`}
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-white/30 text-sm mt-6">
          <Link href="/pricing" className="text-[#A48FFF] hover:underline">
            View full pricing comparison &rarr;
          </Link>
        </p>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="bg-white/[0.02] border-y border-white/[0.06] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-3">How it works</h2>
          <p className="text-white/50 text-center mb-14">Book in under 2 minutes. We handle the rest.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose your package',
                desc: 'Pick the service that fits your needs. See transparent pricing based on your vehicle.',
              },
              {
                step: '02',
                title: 'Schedule & enter your address',
                desc: 'Pick a date, time, and tell us where to come. We arrive fully equipped — no prep needed.',
              },
              {
                step: '03',
                title: 'Sit back & enjoy',
                desc: 'Our certified detailer does the work. Inspect the results and drive away spotless.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-black text-[#6B4EFF]/20 mb-4">{item.step}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why OtoPro vs traditional ── */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-3">Why OtoPro?</h2>
        <p className="text-white/50 text-center mb-12">
          See how we compare to traditional car washes and freelance detailers.
        </p>

        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-3 text-sm font-semibold border-b border-white/[0.06]">
            <div className="p-4 text-white/40">Feature</div>
            <div className="p-4 text-center text-[#6B4EFF]">OtoPro</div>
            <div className="p-4 text-center text-white/40">Others</div>
          </div>
          {FEATURES.map((f, i) => (
            <div
              key={f.label}
              className={`grid grid-cols-3 text-sm ${
                i < FEATURES.length - 1 ? 'border-b border-white/[0.04]' : ''
              }`}
            >
              <div className="p-4 text-white/60">{f.label}</div>
              <div className="p-4 text-center text-[#6B4EFF]">{f.us ? '✓' : '—'}</div>
              <div className="p-4 text-center text-white/30">{f.them ? '✓' : '—'}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services grid ── */}
      <section className="bg-white/[0.02] border-y border-white/[0.06] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-3">What&apos;s included</h2>
          <p className="text-white/50 text-center mb-12">
            Every service performed by certified professionals with premium products.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'Interior Deep Clean', desc: 'Full vacuum, shampoo, leather conditioning, and odour elimination.' },
              { title: 'Exterior Wash & Polish', desc: 'Hand wash, clay bar, machine polish, and protective wax.' },
              { title: 'Ceramic Coating', desc: 'Long-lasting nano-ceramic protection — hydrophobic, scratch-resistant.' },
              { title: 'Paint Correction', desc: 'Remove swirl marks, oxidation, and light scratches for a showroom finish.' },
              { title: 'Steam Sanitization', desc: 'High-temperature steam kills bacteria and removes allergens from every surface.' },
              { title: 'Wheel & Tire Detail', desc: 'Degreasing, scrubbing, and tire dressing for a factory-fresh look.' },
            ].map((s) => (
              <div
                key={s.title}
                className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 hover:border-[#6B4EFF]/40 transition-colors"
              >
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-3">Frequently Asked Questions</h2>
        <p className="text-white/50 text-center mb-12">
          <Link href="/faq" className="text-[#A48FFF] hover:underline">
            View all FAQs &rarr;
          </Link>
        </p>

        <div className="space-y-4">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden"
            >
              <summary className="cursor-pointer p-5 text-sm font-medium flex items-center justify-between list-none">
                {faq.q}
                <span className="text-white/30 group-open:rotate-45 transition-transform text-lg">+</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-white/50 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#6B4EFF]/[0.06] border-y border-[#6B4EFF]/20 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-5">
            Ready for a cleaner ride?
          </h2>
          <p className="text-white/50 mb-10 text-lg">
            Book your first detail today. No commitment, no hidden fees.
          </p>
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
