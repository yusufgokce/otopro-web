'use client'

import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  // On mount, read saved preference
  useEffect(() => {
    const saved = localStorage.getItem('otopro-theme')
    if (saved === 'light') {
      setIsDark(false)
      document.documentElement.classList.add('light')
    }
  }, [])

  function toggle() {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.remove('light')
      localStorage.setItem('otopro-theme', 'dark')
    } else {
      document.documentElement.classList.add('light')
      localStorage.setItem('otopro-theme', 'light')
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-widget-hover transition-colors cursor-pointer"
    >
      {isDark ? (
        // Sun icon — click to go light
        <svg className="w-[18px] h-[18px] text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="5" />
          <path strokeLinecap="round" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.07-7.07-1.41 1.41M7.34 16.66l-1.41 1.41m12.14 0-1.41-1.41M7.34 7.34 5.93 5.93" />
        </svg>
      ) : (
        // Moon icon — click to go dark
        <svg className="w-[18px] h-[18px] text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
        </svg>
      )}
    </button>
  )
}
