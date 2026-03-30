'use server'

import { createClient } from '@/lib/supabase/server'
import { FALLBACK_PHOTOS } from '@/lib/data/fallback-data'
import type { GooglePhoto } from '@/lib/types/reviews'

export async function getPhotos(): Promise<GooglePhoto[]> {
  const buildSha = process.env.BUILD_COMMIT_SHA

  // No BUILD_COMMIT_SHA (local dev) → fallback, never call API
  if (!buildSha) {
    return FALLBACK_PHOTOS
  }

  try {
    const supabase = await createClient()

    const [{ data: photos }, { data: meta }] = await Promise.all([
      supabase
        .from('google_photos')
        .select('*')
        .order('fetched_at', { ascending: false }),
      supabase
        .from('google_photos_meta')
        .select('deploy_commit_sha')
        .eq('id', true)
        .single(),
    ])

    // Trigger refresh if this is a new deploy (different SHA)
    if (meta?.deploy_commit_sha !== buildSha) {
      triggerPhotosRefresh(buildSha)
    }

    if (!photos || photos.length === 0) {
      return FALLBACK_PHOTOS
    }

    return photos as GooglePhoto[]
  } catch {
    return FALLBACK_PHOTOS
  }
}

function triggerPhotosRefresh(buildSha: string) {
  const secret = process.env.REVIEWS_REFRESH_SECRET
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  if (!secret) return

  // Fire-and-forget
  fetch(`${baseUrl}/api/photos/refresh`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ buildSha }),
  }).catch(() => {
    // Silently fail
  })
}
