import Link from 'next/link'
import { redirect } from 'next/navigation'
import { NavServer } from '../components/nav-server'
import { Footer } from '../components/footer'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your otopro dashboard — bookings, vehicles, and more.',
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/book')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const firstName = (
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'there'
  ).split(' ')[0]

  // Fetch stats in parallel
  const [bookingsResult, upcomingResult, vehiclesResult] = await Promise.all([
    supabase
      .from('detailing_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('customer_id', user.id),
    supabase
      .from('detailing_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('customer_id', user.id)
      .gte('scheduled_date', new Date().toISOString().split('T')[0])
      .in('current_status', ['pending', 'confirmed']),
    supabase
      .from('vehicles')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ])

  const totalBookings = bookingsResult.count ?? 0
  const upcomingBookings = upcomingResult.count ?? 0
  const vehicleCount = vehiclesResult.count ?? 0

  const stats = [
    { label: 'Total Bookings', value: totalBookings },
    { label: 'Upcoming', value: upcomingBookings },
    { label: 'Vehicles', value: vehicleCount },
  ]

  return (
    <>
    <main className="relative z-10 min-h-screen bg-surface-primary text-foreground rounded-b-[32px] shadow-[0_4px_40px_rgba(0,0,0,0.15)]">
      <NavServer />

      <section className="max-w-6xl mx-auto px-6 py-28">
        <h1 className="text-4xl sm:text-5xl font-bold mb-2">
          Welcome back, {firstName}
        </h1>
        <p className="text-foreground-muted mb-12">
          Here&apos;s a quick look at your otopro account.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-widget border border-dark-grey rounded-3xl p-6"
            >
              <p className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted mb-2">
                {stat.label}
              </p>
              <p className="text-4xl font-bold text-accent-blue-500">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link
            href="/dashboard/garage"
            className="bg-surface-widget border border-dark-grey rounded-3xl p-6 hover:border-accent-blue-500/40 transition-colors group"
          >
            <p className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted mb-2">
              My Garage
            </p>
            <p className="text-lg font-semibold group-hover:text-accent-blue-500 transition-colors">
              View &amp; manage your vehicles
            </p>
            <p className="text-foreground-muted text-sm mt-1">
              {vehicleCount} vehicle{vehicleCount !== 1 ? 's' : ''} saved
            </p>
          </Link>

          <Link
            href="/dashboard/bookings"
            className="bg-surface-widget border border-dark-grey rounded-3xl p-6 hover:border-accent-blue-500/40 transition-colors group"
          >
            <p className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted mb-2">
              My Bookings
            </p>
            <p className="text-lg font-semibold group-hover:text-accent-blue-500 transition-colors">
              View your detailing sessions
            </p>
            <p className="text-foreground-muted text-sm mt-1">
              {upcomingBookings} upcoming booking{upcomingBookings !== 1 ? 's' : ''}
            </p>
          </Link>
        </div>
      </section>

    </main>
    <Footer />
    </>
  )
}
