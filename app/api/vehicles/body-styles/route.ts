import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/vehicles/body-styles?year=2025&make=Toyota&model=Supra
 *
 * Uses Gemini Flash to determine which body styles a specific vehicle comes in.
 * Returns a filtered array from our canonical body style list.
 *
 * Costs ~$0.00001 per call. Results are cached for 30 days.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const CANONICAL_BODY_STYLES = [
  'Sedan',
  'SUV',
  'Truck',
  'Coupe',
  'Hatchback',
  'Convertible',
  'Van/Minivan',
  'Wagon',
  'Crossover',
] as const

// In-memory cache: "year|make|model" → { styles, timestamp }
const cache = new Map<string, { styles: string[]; ts: number }>()
const CACHE_TTL = 1000 * 60 * 60 * 24 * 30 // 30 days — body styles don't change

export async function GET(req: NextRequest) {
  const year = req.nextUrl.searchParams.get('year')
  const make = req.nextUrl.searchParams.get('make')
  const model = req.nextUrl.searchParams.get('model')

  if (!year || !make || !model) {
    return NextResponse.json(
      { error: 'Missing required parameters: year, make, model' },
      { status: 400 }
    )
  }

  // Check cache
  const cacheKey = `${year}|${make.toLowerCase()}|${model.toLowerCase()}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.styles, {
      headers: { 'Cache-Control': 'public, max-age=2592000, s-maxage=2592000' },
    })
  }

  if (!GEMINI_API_KEY) {
    // No API key — return all body styles as fallback
    console.warn('[body-styles] No GEMINI_API_KEY set, returning all body styles')
    return NextResponse.json([...CANONICAL_BODY_STYLES])
  }

  try {
    const prompt = `What body style(s) does the ${year} ${make} ${model} come in?

Reply with ONLY a JSON array containing one or more of these exact strings:
${JSON.stringify(CANONICAL_BODY_STYLES)}

Rules:
- Only include body styles this specific vehicle is actually sold as.
- "Crossover" = compact SUV/CUV (e.g., RAV4, CR-V, Tucson). Use "SUV" for larger SUVs (e.g., Tahoe, Sequoia).
- If the vehicle comes in multiple body styles (e.g., Civic comes as Sedan and Hatchback), include all that apply.
- Return ONLY the JSON array, no other text.`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 256,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
        signal: AbortSignal.timeout(10000),
      }
    )

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Gemini ${res.status}: ${errText}`)
    }

    const data = await res.json()

    // Gemini 2.5 may return multiple parts (thinking + text). Concatenate all text parts.
    const parts = data?.candidates?.[0]?.content?.parts ?? []
    const rawText: string = parts
      .filter((p: { text?: string }) => p.text)
      .map((p: { text: string }) => p.text)
      .join('\n')
      .trim() || '[]'

    // Extract JSON array — use greedy match to get the full array
    const jsonMatch = rawText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error(`Could not parse Gemini response: ${rawText}`)
    }

    let parsed: string[]
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      throw new Error(`Invalid JSON from Gemini: ${jsonMatch[0]}`)
    }

    // Filter to only canonical values
    const styles = parsed.filter((s) =>
      CANONICAL_BODY_STYLES.includes(s as (typeof CANONICAL_BODY_STYLES)[number])
    )

    // Fallback: if AI returned nothing valid, return all styles
    if (styles.length === 0) {
      console.warn(`[body-styles] Gemini returned no valid styles for ${year} ${make} ${model}`)
      return NextResponse.json([...CANONICAL_BODY_STYLES])
    }

    // Cache it
    cache.set(cacheKey, { styles, ts: Date.now() })

    return NextResponse.json(styles, {
      headers: { 'Cache-Control': 'public, max-age=2592000, s-maxage=2592000' },
    })
  } catch (err) {
    console.error('[body-styles] Gemini call failed:', err)
    // Fallback: return all body styles
    return NextResponse.json([...CANONICAL_BODY_STYLES])
  }
}
