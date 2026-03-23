import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-primary flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <p className="text-6xl font-bold text-foreground opacity-10 select-none">404</p>
        <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
        <p className="text-foreground/60 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 bg-accent-blue-500 text-white text-sm font-medium rounded-full hover:bg-accent-blue-600 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
