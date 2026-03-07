import { createClient } from '@/lib/supabase/server'
import { BookingWizard } from './booking-wizard'
import { Nav } from '../components/nav'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Detail | OtoPro',
  description: 'Book professional car detailing at your location in under a minute.',
}

export default async function BookPage() {
  const supabase = await createClient()

  const [{ data: services }, { data: bodyStylePricing }] = await Promise.all([
    supabase.from('service_types').select('*').eq('is_active', true).order('base_price'),
    supabase.from('body_style_pricing').select('*').order('surcharge'),
  ])

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white">
      <Nav />

      <BookingWizard
        services={services ?? []}
        bodyStylePricing={bodyStylePricing ?? []}
        isAuthenticated={!!user}
      />
    </main>
  )
}
