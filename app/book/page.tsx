import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { BookingWizard } from './booking-wizard'
import { NavServer } from '../components/nav-server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Detail',
  description: 'Book professional mobile car detailing at your location in under 2 minutes. Choose your service, pick a date, and pay securely online.',
  robots: { index: false, follow: true },
}

export default async function BookPage() {
  const supabase = await createClient()

  const [{ data: services }, { data: bodyStylePricing }] = await Promise.all([
    supabase.from('service_types').select('*').eq('is_active', true).order('base_price'),
    supabase.from('body_style_pricing').select('*').order('surcharge'),
  ])

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-surface-primary text-foreground">
      <NavServer />

      <Suspense>
        <BookingWizard
          services={services ?? []}
          bodyStylePricing={bodyStylePricing ?? []}
          isAuthenticated={!!user}
        />
      </Suspense>
    </main>
  )
}
