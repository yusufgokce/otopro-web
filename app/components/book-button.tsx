'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface Props {
  className?: string
  children: React.ReactNode
}

/**
 * Universal Book button. On the homepage, scrolls to top and opens
 * the booking popup. On other pages, navigates to /?book=true.
 */
export function BookButton({ className, children }: Props) {
  const pathname = usePathname()

  if (pathname === '/') {
    return (
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('open-booking'))}
        className={className}
      >
        {children}
      </button>
    )
  }

  return (
    <Link href="/?book=true" className={className}>
      {children}
    </Link>
  )
}
