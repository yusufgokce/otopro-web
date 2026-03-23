import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NavServer } from './components/nav-server'
import { Footer } from './components/footer'
import { HeroPriceCalculator } from './components/hero-price-calculator'
import { OtoAccordion } from './components/ui/oto-accordion'

// ── Static data ──

const FEATURES = [
  { label: 'Mobile service at your door', us: true, them: false },
  { label: 'Vetted & certified detailers', us: true, them: false },
  { label: 'Transparent pricing', us: true, them: false },
  { label: 'Online booking in under 2 min', us: true, them: false },
  { label: 'Satisfaction guarantee', us: true, them: false },
  { label: 'Body style adjusted pricing', us: true, them: false },
  { label: 'No hidden fees', us: true, them: false },
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
  {
    title: 'Interior Deep Clean',
    desc: 'Full vacuum, shampoo, leather conditioning, and odour elimination.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    title: 'Exterior Wash & Polish',
    desc: 'Hand wash, clay bar, machine polish, and protective wax.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
  {
    title: 'Ceramic Coating',
    desc: 'Long lasting nano ceramic protection with hydrophobic, scratch resistant finish.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: 'Paint Correction',
    desc: 'Remove swirl marks, oxidation, and light scratches for a showroom finish.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
      </svg>
    ),
  },
  {
    title: 'Steam Sanitization',
    desc: 'High-temperature steam kills bacteria and removes allergens from every surface.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
      </svg>
    ),
  },
  {
    title: 'Wheel & Tire Detail',
    desc: 'Degreasing, scrubbing, and tire dressing for a factory fresh look.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m0 0l4.5-7.795M12 12l4.5 7.794M12 12L7.5 19.795" />
      </svg>
    ),
  },
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
    desc: 'Choose when and where. We come to your driveway fully equipped with no prep needed.',
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
      <NavServer />

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-20 text-center">
        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-10">
          {['Certified Detailers', 'Fully Insured', 'Satisfaction Guaranteed', 'Mobile Service'].map(
            (badge) => (
              <span key={badge} className="flex items-center gap-2 text-foreground-muted text-xs tracking-[0.5px] uppercase font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-blue-500" />
                {badge}
              </span>
            ),
          )}
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
          Professional car
          <br />
          <span className="text-accent-blue-500">detailing</span>, delivered.
        </h1>

        <p className="text-lg md:text-xl text-foreground-muted max-w-xl mx-auto mb-14 leading-relaxed">
          Enter your vehicle to get an instant price. Book in under a minute, we bring everything to you.
        </p>

        {/* Price Calculator */}
        <HeroPriceCalculator
          services={services ?? []}
          bodyStylePricing={bodyStylePricing ?? []}
        />
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-28 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted text-center mb-3">
            How it works
          </p>
          <h2 className="text-[32px] md:text-[40px] font-bold tracking-[-0.5px] text-foreground text-center mb-4">
            Three simple steps
          </h2>
          <p className="text-foreground-muted text-center mb-16 max-w-md mx-auto">
            From price to clean car. No phone calls, no guesswork.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="bg-surface-widget border border-dark-grey/15 rounded-3xl p-8 text-left group hover:border-dark-grey/60 transition-colors"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent-blue-500/10 text-accent-blue-500 text-lg font-bold mb-5">
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why otopro vs traditional ── */}
      <section className="py-28 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted text-center mb-3">
            The difference
          </p>
          <h2 className="text-[32px] md:text-[40px] font-bold tracking-[-0.5px] text-foreground text-center mb-4">
            Why otopro?
          </h2>
          <p className="text-foreground-muted text-center mb-14 max-w-md mx-auto">
            See how we compare to traditional car washes and freelance detailers.
          </p>

          <div className="bg-surface-widget border border-dark-grey/15 rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1fr_80px_80px] md:grid-cols-[1fr_100px_100px] text-xs font-semibold tracking-[0.5px] uppercase border-b border-dark-grey/15">
              <div className="p-5 text-foreground-muted">Feature</div>
              <div className="p-5 text-center text-accent-blue-500">otopro</div>
              <div className="p-5 text-center text-foreground-muted">Others</div>
            </div>
            {/* Rows */}
            {FEATURES.map((f, i) => (
              <div
                key={f.label}
                className={`grid grid-cols-[1fr_80px_80px] md:grid-cols-[1fr_100px_100px] text-sm ${
                  i < FEATURES.length - 1 ? 'border-b border-dark-grey/10' : ''
                }`}
              >
                <div className="p-5 text-foreground-muted">{f.label}</div>
                <div className="p-5 text-center">
                  {f.us ? (
                    <svg className="w-5 h-5 text-accent-blue-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <span className="text-foreground-muted">—</span>
                  )}
                </div>
                <div className="p-5 text-center">
                  {f.them ? (
                    <svg className="w-5 h-5 text-foreground-muted mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <span className="text-foreground-muted">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services grid ── */}
      <section className="py-28 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted text-center mb-3">
            Our services
          </p>
          <h2 className="text-[32px] md:text-[40px] font-bold tracking-[-0.5px] text-foreground text-center mb-4">
            What&apos;s included
          </h2>
          <p className="text-foreground-muted text-center mb-14 max-w-md mx-auto">
            Every service performed by certified professionals with premium products.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="bg-surface-widget border border-dark-grey/15 rounded-3xl p-7 hover:border-dark-grey/60 transition-colors group"
              >
                <div className="w-11 h-11 rounded-2xl bg-accent-blue-500/10 text-accent-blue-500 flex items-center justify-center mb-5 group-hover:bg-accent-blue-500/15 transition-colors">
                  {s.icon}
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-foreground-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-28 md:py-32">
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted text-center mb-3">
            Support
          </p>
          <h2 className="text-[32px] md:text-[40px] font-bold tracking-[-0.5px] text-foreground text-center mb-4">
            Frequently asked questions
          </h2>
          <p className="text-foreground-muted text-center mb-14">
            <Link href="/faq" className="text-accent-blue-400 hover:text-accent-blue-300 transition-colors">
              View all FAQs &rarr;
            </Link>
          </p>

          <div>
            {FAQS.map((faq) => (
              <OtoAccordion key={faq.q} title={faq.q}>
                {faq.a}
              </OtoAccordion>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-accent-blue-800/20 border border-accent-blue-700/20 rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
              Ready for a cleaner ride?
            </h2>
            <p className="text-lg text-foreground-muted mb-10 max-w-lg mx-auto">
              Enter your vehicle above or book directly. No commitment, no hidden fees.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center justify-center h-[52px] px-10 rounded-full text-base font-semibold bg-accent-blue-500 hover:bg-accent-blue-600 text-white transition-colors"
            >
              Book a Detail
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
