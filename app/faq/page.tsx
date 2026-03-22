import { Nav } from '../components/nav'
import { Footer } from '../components/footer'
import { FaqSections } from './faq-sections'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | OtoPro',
  description: 'Frequently asked questions about OtoPro mobile car detailing services.',
}

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-surface-primary text-foreground">
      <Nav />

      <section className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <p className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted text-center mb-3">
          Support
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-center tracking-tight mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-foreground-muted text-center mb-14">
          Everything you need to know about OtoPro.
        </p>

        <FaqSections />

        <div className="text-center mt-14">
          <p className="text-foreground-muted text-sm mb-4">Still have questions?</p>
          <Link
            href="/book"
            className="inline-block bg-accent-blue-500 hover:bg-accent-blue-600 text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
          >
            Book a Detail
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
