import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(request: Request) {
  // Auth check
  const authHeader = request.headers.get('authorization')
  const secret = process.env.REVIEWS_REFRESH_SECRET

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) {
    return NextResponse.json({ error: 'Missing Google Places config' }, { status: 500 })
  }

  try {
    // Fetch reviews from Google Places API (New)
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'reviews',
        },
      }
    )

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { error: 'Google API error', details: text },
        { status: 502 }
      )
    }

    const data = await res.json()
    const reviews = data.reviews ?? []

    if (reviews.length === 0) {
      return NextResponse.json({ message: 'No reviews returned', count: 0 })
    }

    const supabase = createServiceClient()

    // Map Google response → DB rows
    const rows = reviews.map((r: {
      name: string
      rating: number
      text?: { text: string }
      authorAttribution?: { displayName: string; photoUri: string }
      publishTime?: string
      relativePublishTimeDescription?: string
    }) => ({
      author_name: r.authorAttribution?.displayName ?? 'Anonymous',
      profile_photo_url: r.authorAttribution?.photoUri ?? null,
      rating: Math.round(r.rating),
      review_text: r.text?.text ?? '',
      relative_time: r.relativePublishTimeDescription ?? '',
      published_at: r.publishTime ?? null,
      google_review_name: r.name,
      fetched_at: new Date().toISOString(),
    }))

    // Upsert on google_review_name conflict
    const { error: upsertError } = await supabase
      .from('google_reviews')
      .upsert(rows, { onConflict: 'google_review_name' })

    if (upsertError) {
      return NextResponse.json(
        { error: 'Upsert failed', details: upsertError.message },
        { status: 500 }
      )
    }

    // Update last_fetched_at
    await supabase
      .from('google_reviews_meta')
      .update({ last_fetched_at: new Date().toISOString() })
      .eq('id', true)

    return NextResponse.json({ message: 'Reviews refreshed', count: rows.length })
  } catch (err) {
    return NextResponse.json(
      { error: 'Unexpected error', details: String(err) },
      { status: 500 }
    )
  }
}
