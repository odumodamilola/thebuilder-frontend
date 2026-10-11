'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function NewsletterForm({ className }: { className?: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setTimeout(() => setStatus('success'), 1000)
  }

  if (status === 'success') {
    return <div className="text-sm text-green-500 font-medium">Thanks for subscribing!</div>
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Email address"
          required
          className="flex-1 bg-white border border-line rounded-md px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-royal focus:ring-offset-2 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-brand-red text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </div>
      {status === 'error' && <div className="text-sm text-brand-red">Something went wrong.</div>}
    </form>
  )
}
