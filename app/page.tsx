import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Nav } from './components/nav'
import { Footer } from './components/footer'
import { HeroPriceCalculator } from './components/hero-price-calculator'
import { OtoText } from './components/ui/oto-text'
import { OtoCard } from './components/ui/oto-card'
import { OtoAccordion } from './components/ui/oto-accordion'

// ── Static data ──

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
    q: "What happens if I'm not satisfied?",
    a: "We stand behind our work. If you're not happy with the results, contact us and we'll make it right.",
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

const SERVICES = [
  { title: 'Interior Deep Clean', desc: 'Full vacuum, shampoo, leather conditioning, and odour elimination.' },
  { title: 'Exterior Wash & Polish', desc: 'Hand wash, clay bar, machine polish, and protective wax.' },
  { title: 'Ceramic Coating', desc: 'Long-lasting nano-ceramic protection — hydrophobic, scratch-resistant.' },
  { title: 'Paint Correction', desc: 'Remove swirl marks, oxidation, and light scratches for a showroom finish.' },
  { title: 'Steam Sanitization', desc: 'High-temperature steam kills bacteria and removes allergens from every surface.' },
  { title: 'Wheel & Tire Detail', desc: 'Degreasing, scrubbing, and tire dressing for a factory-fresh look.' },
]

const STEPS = [
  {
    step: '01',
    title: 'Enter your vehicle',
    desc: 'Tell us your year, make, model, and body style. Get an exact price instantly.',
  },
  {
    step: '02',
    title: 'Pick a date & location',
    desc: 'Choose when and where. We come to your driveway fully equipped — no prep needed.',
  },
  {
    step: '03',
    title: 'Sit back & enjoy',
    desc: 'Our certified detailer does the work. Inspect the results and drive away spotless.',
  },
]

// ── Page ──

export default async function Home() {
  const supabase = await createClient()

  const [{ data: services }, { data: bodyStylePricing }] = await Promise.all([
    supabase.from('service_types').select('*').eq('is_active', true).order('base_price'),
    supabase.from('body_style_pricing').select('*').order('surcharge'),
  ])

  return (
    <main className="min-h-screen bg-surface-primary text-foreground">
      <Nav />

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 text-grey text-xs font-medium mb-8">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue-500" />
            Certified Detailers
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue-500" />
            Fully Insured
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue-500" />
            Satisfaction Guaranteed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue-500" />
            Mobile Service
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-5">
          Professional car{' '}
          <span className="text-accent-blue-500">detailing</span>
          <br />
          at your door.
        </h1>

        <OtoText.BodySmall className="max-w-xl mx-auto mb-12 !text-lg !leading-relaxed">
          Enter your vehicle details to get an instant price. Book in under a minute — we bring everything.
        </OtoText.BodySmall>

        {/* ── Price Calculator ── */}
        <HeroPriceCalculator
          services={services ?? []}
          bodyStylePricing={bodyStylePricing ?? []}
        />
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="bg-surface-widget/50 border-y border-surface-widget py-24">
        <div className="max-w-6xl mx-auto px-6">
          <OtoText.H2 className="text-center mb-3">How it works</OtoText.H2>
          <OtoText.BodySmall className="text-center mb-14">
            From price to clean car in 3 simple steps.
          </OtoText.BodySmall>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-black text-accent-blue-500/20 mb-4">{item.step}</div>
                <OtoText.H5 className="mb-2">{item.title}</OtoText.H5>
                <OtoText.BodySmall>{item.desc}</OtoText.BodySmall>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why OtoPro vs traditional ── */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <OtoText.H2 className="text-center mb-3">Why OtoPro?</OtoText.H2>
        <OtoText.BodySmall className="text-center mb-12">
          See how we compare to traditional car washes and freelance detailers.
        </OtoText.BodySmall>

        <OtoCard variant="outlined" padding="none" className="overflow-hidden">
          <div className="grid grid-cols-3 text-sm font-semibold border-b border-dark-grey">
            <div className="p-4 text-grey">Feature</div>
            <div className="p-4 text-center text-accent-blue-500">OtoPro</div>
            <div className="p-4 text-center text-grey">Others</div>
          </div>
          {FEATURES.map((f, i) => (
            <div
              key={f.label}
              className={`grid grid-cols-3 text-sm ${
                i < FEATURES.length - 1 ? 'border-b border-dark-grey/40' : ''
              }`}
            >
              <div className="p-4 text-dark-silver">{f.label}</div>
              <div className="p-4 text-center text-accent-blue-500">{f.us ? '✓' : '—'}</div>
              <div className="p-4 text-center text-dark-grey">{f.them ? '✓' : '—'}</div>
            </div>
          ))}
        </OtoCard>
      </section>

      {/* ── Services grid ── */}
      <section className="bg-surface-widget/50 border-y border-surface-widget py-24">
        <div className="max-w-6xl mx-auto px-6">
          <OtoText.H2 className="text-center mb-3">What&apos;s included</OtoText.H2>
          <OtoText.BodySmall className="text-center mb-12">
            Every service performed by certified professionals with premium products.
          </OtoText.BodySmall>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <OtoCard
                key={s.title}
                variant="outlined"
                padding="md"
                className="hover:border-accent-blue-500/40 transition-colors"
              >
                <OtoText.H5 className="mb-2">{s.title}</OtoText.H5>
                <OtoText.BodySmall>{s.desc}</OtoText.BodySmall>
              </OtoCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <OtoText.H2 className="text-center mb-3">Frequently Asked Questions</OtoText.H2>
        <OtoText.BodySmall className="text-center mb-12">
          <Link href="/faq" className="text-accent-blue-400 hover:underline">
            View all FAQs &rarr;
          </Link>
        </OtoText.BodySmall>

        <div>
          {FAQS.map((faq) => (
            <OtoAccordion key={faq.q} title={faq.q}>
              {faq.a}
            </OtoAccordion>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-accent-blue-800/30 border-y border-accent-blue-700/30 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-5">
            Ready for a cleaner ride?
          </h2>
          <OtoText.BodySmall className="mb-10 !text-lg">
            Enter your vehicle above or book directly — no commitment, no hidden fees.
          </OtoText.BodySmall>
          <Link
            href="/book"
            className="inline-flex items-center justify-center h-[52px] px-10 rounded-xl text-lg font-semibold bg-accent-blue-500 hover:bg-accent-blue-600 text-white transition-colors"
          >
            Book a Detail
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
