import Link from 'next/link'
import { redirect } from 'next/navigation'
import { NavServer } from '../../components/nav-server'
import { Footer } from '../../components/footer'
import { createClient } from '@/lib/supabase/server'
import { TIME_SLOT_LABELS, type TimeSlot } from '@/lib/types/booking'
import { RescheduleModal } from './reschedule-modal'
import { CancelButton } from './cancel-button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Bookings',
  description: 'View and manage your detailing sessions.',
  robots: { index: false, follow: false },
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-500',
  confirmed: 'bg-accent-blue-500/15 text-accent-blue-500',
  completed: 'bg-green-500/15 text-green-500',
  cancelled: 'bg-red-500/15 text-red-500',
  refunded: 'bg-grey/15 text-grey',
  payment_failed: 'bg-red-500/15 text-red-500',
}

// Only these statuses allow reschedule/cancel actions
const ACTIONABLE_STATUSES = ['confirmed', 'pending']

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/book')
  }

  const { data: bookings } = await supabase
    .from('detailing_sessions')
    .select(`
      id,
      scheduled_date,
      scheduled_time,
      current_status,
      total_price,
      special_requests,
      created_at,
      reschedule_count,
      service_types ( name ),
      vehicles ( year, make, model, color, body_style )
    `)
    .eq('customer_id', user.id)
    .order('scheduled_date', { ascending: false })

  return (
    <>
    <main className="relative z-10 min-h-screen bg-surface-primary text-foreground rounded-b-[32px] shadow-[0_4px_40px_rgba(0,0,0,0.15)]">
      <NavServer />

      <section className="max-w-6xl mx-auto px-6 py-28">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">My Bookings</h1>
            <p className="text-foreground-muted">
              All your otopro detailing sessions.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-accent-blue-500 hover:text-accent-blue-400 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {bookings && bookings.length > 0 ? (
          <div className="space-y-5">
            {bookings.map((booking) => {
              const timeKey = booking.scheduled_time?.slice(0, 5) as TimeSlot | undefined
              const timeLabel = timeKey && TIME_SLOT_LABELS[timeKey]
                ? TIME_SLOT_LABELS[timeKey]
                : booking.scheduled_time
              const status = booking.current_status || 'pending'
              const canReschedule = ACTIONABLE_STATUSES.includes(status)
              // Can cancel within 48 hours of creation
              const hoursSinceCreation = (Date.now() - new Date(booking.created_at).getTime()) / (1000 * 60 * 60)
              const canCancel = ACTIONABLE_STATUSES.includes(status) && hoursSinceCreation <= 48
              const serviceTypes = booking.service_types as
                | { name: string }
                | { name: string }[]
                | null
              const serviceName = Array.isArray(serviceTypes)
                ? serviceTypes[0]?.name ?? 'Detailing Session'
                : serviceTypes?.name ?? 'Detailing Session'
              const vehicleRaw = booking.vehicles as
                | { year: number; make: string; model: string; color: string; body_style: string }
                | { year: number; make: string; model: string; color: string; body_style: string }[]
                | null
              const vehicle = Array.isArray(vehicleRaw) ? vehicleRaw[0] ?? null : vehicleRaw

              return (
                <div
                  key={booking.id}
                  className="bg-surface-widget border border-dark-grey rounded-3xl p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{serviceName}</h3>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                            STATUS_STYLES[status] || STATUS_STYLES.pending
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-foreground-muted">
                        <p>
                          <span className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted">
                            Date
                          </span>{' '}
                          {formatDate(booking.scheduled_date)}
                        </p>
                        <p>
                          <span className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted">
                            Time
                          </span>{' '}
                          {timeLabel}
                        </p>
                        {vehicle && (
                          <p>
                            <span className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted">
                              Vehicle
                            </span>{' '}
                            {vehicle.year} {vehicle.make} {vehicle.model}
                            {vehicle.color ? ` — ${vehicle.color}` : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <p className="text-2xl font-bold text-accent-blue-500">
                        ${(booking.total_price ?? 0).toFixed(2)}
                      </p>
                      {canReschedule && (
                        <div className="flex gap-2">
                          <RescheduleModal
                            sessionId={booking.id}
                            currentDate={booking.scheduled_date}
                            currentTime={timeKey || '08:00'}
                            createdAt={booking.created_at}
                            rescheduleCount={booking.reschedule_count ?? 0}
                          />
                          {canCancel && (
                            <CancelButton sessionId={booking.id} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-surface-widget border border-dark-grey rounded-3xl p-12 text-center">
            <p className="text-foreground-muted mb-4">
              No bookings yet. Schedule your first detail today.
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
