'use client'

import { useState, useTransition } from 'react'
import { cancelBooking } from '@/lib/actions/booking'
import { useRouter } from 'next/navigation'

interface Props {
  sessionId: string
}

export function CancelButton({ sessionId }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const router = useRouter()

  function handleCancel() {
    setError('')
    startTransition(async () => {
      const result = await cancelBooking(sessionId)
      if (result.success) {
        setShowConfirm(false)
        router.refresh()
      } else {
        setError(result.error || 'Failed to cancel booking')
      }
    })
  }

  if (showConfirm) {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex gap-2">
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isPending}
            className="text-xs text-foreground-muted hover:text-foreground px-3 py-1.5 rounded-full border border-dark-grey/20 transition-colors cursor-pointer"
          >
            Keep
          </button>
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="text-xs text-red-500 hover:text-white hover:bg-red-500 px-3 py-1.5 rounded-full border border-red-500/30 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isPending ? 'Cancelling...' : 'Yes, cancel'}
          </button>
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
    >
      Cancel
    </button>
  )
}
