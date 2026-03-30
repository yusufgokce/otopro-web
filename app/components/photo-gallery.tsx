'use client'

import type { GooglePhoto } from '@/lib/types/reviews'

export function PhotoGallery({ photos }: { photos: GooglePhoto[] }) {
  // Don't render if no real photos (filter out empty fallback URLs)
  const validPhotos = photos.filter((p) => p.photo_url !== '')
  if (validPhotos.length === 0) return null

  return (
    <section className="py-28 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted text-center mb-3">
          Gallery
        </p>
        <h2 className="text-[32px] md:text-[40px] font-bold tracking-[-0.5px] text-foreground text-center mb-4">
          Our work
        </h2>
        <p className="text-foreground-muted text-center mb-14 max-w-md mx-auto">
          See the results for yourself.
        </p>

        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-6 px-6">
          {validPhotos.map((photo) => (
            <div
              key={photo.google_photo_name}
              className="min-w-[280px] max-w-[360px] shrink-0 snap-start rounded-2xl overflow-hidden border border-dark-grey/15"
            >
              <img
                src={photo.photo_url}
                alt={photo.author_name ? `Photo by ${photo.author_name}` : 'Detailing work'}
                className="w-full h-[240px] object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
