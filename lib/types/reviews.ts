export interface GoogleReview {
  id: string
  author_name: string
  profile_photo_url: string | null
  rating: number
  review_text: string
  relative_time: string
  published_at: string | null
  google_review_name: string
}

export interface GooglePhoto {
  id: string
  photo_url: string
  width_px: number | null
  height_px: number | null
  author_name: string | null
  google_photo_name: string
}
