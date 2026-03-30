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

  let buildSha: string | undefined
  try {
    const body = await request.json()
    buildSha = body.buildSha
  } catch {
    // No body — that's fine, still refresh
  }

  try {
    // Fetch photo references from Google Places API (New)
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'photos',
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
    const photos: {
      name: string
      widthPx?: number
      heightPx?: number
      authorAttributions?: { displayName?: string }[]
    }[] = data.photos ?? []

    if (photos.length === 0) {
      return NextResponse.json({ message: 'No photos returned', count: 0 })
    }

    // Resolve each photo reference to an actual URL
    const rows = await Promise.all(
      photos.map(async (photo) => {
        const mediaRes = await fetch(
          `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=800&skipHttpRedirect=true&key=${apiKey}`
        )

        let photoUrl = ''
        if (mediaRes.ok) {
          const mediaData = await mediaRes.json()
          photoUrl = mediaData.photoUri ?? ''
        }

        return {
          photo_url: photoUrl,
          width_px: photo.widthPx ?? null,
          height_px: photo.heightPx ?? null,
          author_name: photo.authorAttributions?.[0]?.displayName ?? null,
          google_photo_name: photo.name,
          fetched_at: new Date().toISOString(),
        }
      })
    )

    // Filter out any photos where URL resolution failed
    const validRows = rows.filter((r) => r.photo_url !== '')

    const supabase = createServiceClient()

    if (validRows.length > 0) {
      const { error: upsertError } = await supabase
        .from('google_photos')
        .upsert(validRows, { onConflict: 'google_photo_name' })

      if (upsertError) {
        return NextResponse.json(
          { error: 'Upsert failed', details: upsertError.message },
          { status: 500 }
        )
      }
    }

    // Update deploy SHA so we don't re-fetch on container restart
    if (buildSha) {
      await supabase
        .from('google_photos_meta')
        .update({ deploy_commit_sha: buildSha })
        .eq('id', true)
    }

    return NextResponse.json({ message: 'Photos refreshed', count: validRows.length })
  } catch (err) {
    return NextResponse.json(
      { error: 'Unexpected error', details: String(err) },
      { status: 500 }
    )
  }
}
