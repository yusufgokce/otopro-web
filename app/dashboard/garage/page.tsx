import Link from 'next/link'
import { redirect } from 'next/navigation'
import { NavServer } from '../../components/nav-server'
import { Footer } from '../../components/footer'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Garage | otopro',
  description: 'View and manage your saved vehicles.',
}

export default async function GaragePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/book')
  }

  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('id, year, make, model, color, body_style')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <>
    <main className="relative z-10 min-h-screen bg-surface-primary text-foreground rounded-b-[32px] shadow-[0_4px_40px_rgba(0,0,0,0.15)]">
      <NavServer />

      <section className="max-w-6xl mx-auto px-6 py-28">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">My Garage</h1>
            <p className="text-foreground-muted">
              Vehicles saved to your otopro account.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-accent-blue-500 hover:text-accent-blue-400 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {vehicles && vehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-surface-widget border border-dark-grey rounded-3xl p-6"
              >
                <p className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted mb-3">
                  {vehicle.body_style || 'Vehicle'}
                </p>
                <p className="text-xl font-bold mb-1">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </p>
                {vehicle.color && (
                  <p className="text-foreground-muted text-sm">
                    {vehicle.color}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface-widget border border-dark-grey rounded-3xl p-12 text-center">
            <p className="text-foreground-muted mb-4">
              No vehicles saved yet. Book a detail to add your first vehicle.
            </p>
            <Link
              href="/book"
              className="inline-block bg-accent-blue-500 hover:bg-accent-blue-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              Book a Detail
            </Link>
          </div>
        )}
      </section>

    </main>
    <Footer />
    </>
  )
}
