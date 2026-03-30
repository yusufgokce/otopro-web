'use server'

import { createClient } from '@/lib/supabase/server'
import { FALLBACK_REVIEWS } from '@/lib/data/fallback-data'
import type { GoogleReview } from '@/lib/types/reviews'

const STALE_THRESHOLD_DAYS = 14

export async function getReviews(): Promise<GoogleReview[]> {
  if (process.env.NODE_ENV === 'development') {
    return FALLBACK_REVIEWS
  }

  try {
    const supabase = await createClient()

    const [{ data: reviews }, { data: meta }] = await Promise.all([
      supabase
        .from('google_reviews')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(10),
      supabase
        .from('google_reviews_meta')
        .select('last_fetched_at')
        .eq('id', true)
        .single(),
    ])

    // Trigger background refresh if stale
    if (meta?.last_fetched_at) {
      const lastFetched = new Date(meta.last_fetched_at)
      const daysSince = (Date.now() - lastFetched.getTime()) / (1000 * 60 * 60 * 24)

      if (daysSince > STALE_THRESHOLD_DAYS) {
        triggerReviewsRefresh()
      }
    }

    if (!reviews || reviews.length === 0) {
      return FALLBACK_REVIEWS
    }

    return reviews as GoogleReview[]
  } catch {
    return FALLBACK_REVIEWS
  }
}

function triggerReviewsRefresh() {
  const secret = process.env.REVIEWS_REFRESH_SECRET
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  if (!secret) return

  // Fire-and-forget — don't await
  fetch(`${baseUrl}/api/reviews/refresh`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}` },
  }).catch(() => {
    // Silently fail — next visitor will retry
  })
}
