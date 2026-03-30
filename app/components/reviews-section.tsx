'use client'

import type { GoogleReview } from '@/lib/types/reviews'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-gold-500' : 'text-dark-grey/30'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="w-10 h-10 rounded-full bg-accent-blue-500/15 text-accent-blue-500 flex items-center justify-center text-sm font-semibold shrink-0">
      {initials}
    </div>
  )
}

function ReviewCard({ review }: { review: GoogleReview }) {
  return (
    <div className="min-w-[300px] max-w-[340px] bg-surface-widget border border-dark-grey/15 rounded-3xl p-7 snap-start shrink-0 flex flex-col gap-4">
      {/* Author */}
      <div className="flex items-center gap-3">
        {review.profile_photo_url ? (
          <img
            src={review.profile_photo_url}
            alt={review.author_name}
            className="w-10 h-10 rounded-full object-cover shrink-0"
            referrerPolicy="no-referrer"
          />
        ) : (
          <InitialsAvatar name={review.author_name} />
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {review.author_name}
          </p>
          <p className="text-xs text-foreground-muted">{review.relative_time}</p>
        </div>
      </div>

      {/* Rating */}
      <StarRating rating={review.rating} />

      {/* Text */}
      <p className="text-sm text-foreground-muted leading-relaxed line-clamp-4">
        {review.review_text}
      </p>
    </div>
  )
}

export function ReviewsSection({ reviews }: { reviews: GoogleReview[] }) {
  if (reviews.length === 0) return null

  return (
    <section className="py-28 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-xs font-semibold tracking-[1.5px] uppercase text-foreground-muted text-center mb-3">
          Reviews
        </p>
        <h2 className="text-[32px] md:text-[40px] font-bold tracking-[-0.5px] text-foreground text-center mb-4">
          What our customers say
        </h2>
        <p className="text-foreground-muted text-center mb-14 max-w-md mx-auto">
          Real reviews from real customers on{' '}
          <a
            href="https://maps.app.goo.gl/axe6J7DpXYptynhR8"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-blue-400 hover:text-accent-blue-300 transition-colors"
          >
            Google
          </a>
          .
        </p>

        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-6 px-6">
          {reviews.map((review) => (
            <ReviewCard key={review.google_review_name} review={review} />
          ))}
        </div>
      </div>
    </section>
  )
}
