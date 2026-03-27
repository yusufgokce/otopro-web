'use client'

import { OtoAccordion } from '../components/ui/oto-accordion'

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
        a: 'No. Our detailers arrive fully equipped with everything needed . Water, power, tools, and premium products are all included. All you need to do is tell us where your car is parked.',
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
        a: 'Yes. You can reschedule up to 2 times per booking at no charge. Free cancellation is available within 48 hours of booking — your deposit will be fully refunded. After 48 hours, please contact support for cancellation assistance.',
      },
      {
        q: 'What happens if weather interferes with my appointment?',
        a: "If severe weather makes it unsafe to detail your vehicle, we'll contact you to reschedule at no charge. Light rain typically doesn't affect our service.",
      },
      {
        q: 'Can I book recurring detailing sessions?',
        a: 'Yes. Through the otopro app you can set up recurring bookings on a schedule that works for you , weekly, bi-weekly, or monthly.',
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
        a: 'A 30% deposit is collected when your booking is confirmed. The remaining balance is paid after the service is completed. All payments are handled securely through the otopro app.',
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
        q: "What if I'm not satisfied with the results?",
        a: "We stand behind our work. If you're not happy with any aspect of the service, contact us within 24 hours and we'll make it right , free of charge.",
      },
      {
        q: 'Are your detailers insured?',
        a: 'Yes. All otopro detailers carry comprehensive liability insurance. Your vehicle is protected throughout the entire service.',
      },
      {
        q: 'What happens if my car is damaged during detailing?',
        a: "In the unlikely event of any damage, our insurance policy covers it fully. Document the issue and contact us immediately . We'll handle the rest.",
      },
    ],
  },
]

export function FaqSections() {
  return (
    <>
      {SECTIONS.map((section) => (
        <div key={section.title} className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-accent-blue-400">{section.title}</h2>
          <div>
            {section.faqs.map((faq) => (
              <OtoAccordion key={faq.q} title={faq.q}>
                {faq.a}
              </OtoAccordion>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
