import { Nav } from '../components/nav'
import { Footer } from '../components/footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | OtoPro',
  description: 'Frequently asked questions about OtoPro mobile car detailing services.',
}

const SECTIONS = [
  {
    title: 'Service & Quality',
    faqs: [
      {
        q: 'What packages do you offer?',
        a: 'We offer three core packages: Exterior Detail ($99), Interior Detail ($149), and our most popular Complete Package ($219) which covers both interior and exterior. Each package includes premium products and professional service.',
      },
      {
        q: 'How quickly can I get my car detailed?',
        a: 'You can book as early as the next day. During the booking process, you can choose from available time slots: 8 AM, 10 AM, 12 PM, or 2 PM.',
      },
      {
        q: 'Do I need to provide water or electricity?',
        a: 'No. Our detailers arrive fully equipped with everything needed — water, power, tools, and premium products. All you need to do is tell us where your car is parked.',
      },
      {
        q: 'What products do your detailers use?',
        a: 'We use professional-grade, pH-balanced products that are safe for all paint types, including ceramic coatings, wraps, and PPF. All products are eco-friendly and biodegradable.',
      },
      {
        q: 'Is your service safe for luxury and exotic vehicles?',
        a: 'Absolutely. Our detailers are trained on all vehicle types and use paint-safe products suitable for any finish, from daily drivers to exotics.',
      },
      {
        q: 'Can I still get my car detailed if it has window tints or a wrap?',
        a: 'Yes. Our detailers are experienced with tinted windows, vinyl wraps, and paint protection film. We adjust our techniques and products accordingly.',
      },
    ],
  },
  {
    title: 'Scheduling & Availability',
    faqs: [
      {
        q: 'What areas do you serve?',
        a: 'We currently serve the Greater Toronto Area and surrounding regions. Enter your address during booking to confirm availability in your area.',
      },
      {
        q: 'Can I reschedule or cancel my booking?',
        a: 'Yes. You can reschedule up to 2 times per booking at no charge. Cancellations are free with 24-hour notice.',
      },
      {
        q: 'What happens if weather interferes with my appointment?',
        a: 'If severe weather makes it unsafe to detail your vehicle, we\'ll contact you to reschedule at no charge. Light rain typically doesn\'t affect our service.',
      },
      {
        q: 'Can I book recurring detailing sessions?',
        a: 'Yes. Through the OtoPro app you can set up recurring bookings on a schedule that works for you — weekly, bi-weekly, or monthly.',
      },
    ],
  },
  {
    title: 'Pricing & Payment',
    faqs: [
      {
        q: 'Are there any hidden fees?',
        a: 'No. The price you see is the price you pay. The only variable is a small body style surcharge for larger vehicles like SUVs (+$30) and vans (+$40).',
      },
      {
        q: 'Do prices change based on my vehicle?',
        a: 'Base pricing is the same for all vehicles. A surcharge may apply based on body style: sedans and coupes have no surcharge, while SUVs, trucks, and vans have a modest one.',
      },
      {
        q: 'How does payment work?',
        a: 'A 30% deposit is collected when your booking is confirmed. The remaining balance is paid after the service is completed. All payments are handled securely through the OtoPro app.',
      },
      {
        q: 'Do you offer discounts for multiple vehicles?',
        a: 'Contact us for fleet pricing. We offer special rates for businesses and multi-vehicle households.',
      },
    ],
  },
  {
    title: 'Guarantee & Safety',
    faqs: [
      {
        q: 'What if I\'m not satisfied with the results?',
        a: 'We stand behind our work. If you\'re not happy with any aspect of the service, contact us within 24 hours and we\'ll make it right — free of charge.',
      },
      {
        q: 'Are your detailers insured?',
        a: 'Yes. All OtoPro detailers carry comprehensive liability insurance. Your vehicle is protected throughout the entire service.',
      },
      {
        q: 'What happens if my car is damaged during detailing?',
        a: 'In the unlikely event of any damage, our insurance policy covers it fully. Document the issue and contact us immediately — we\'ll handle the rest.',
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white">
      <Nav />

      <section className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-white/50 text-center mb-14">
          Everything you need to know about OtoPro.
        </p>

        {SECTIONS.map((section) => (
          <div key={section.title} className="mb-12">
            <h2 className="text-xl font-bold mb-4 text-[#A48FFF]">{section.title}</h2>
            <div className="space-y-3">
              {section.faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden"
                >
                  <summary className="cursor-pointer p-5 text-sm font-medium flex items-center justify-between list-none">
                    {faq.q}
                    <span className="text-white/30 group-open:rotate-45 transition-transform text-lg ml-4 shrink-0">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-white/50 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-8">
          <p className="text-white/40 text-sm mb-4">Still have questions?</p>
          <Link
            href="/book"
            className="inline-block bg-[#6B4EFF] hover:bg-[#5A3EEE] text-white font-semibold px-8 py-3.5 rounded-2xl transition-colors"
          >
            Book a Detail
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
