'use client'
import { useId, useState } from 'react'
import { cn } from '@/lib/utils'
import { http } from '@/lib/http'

export default function NewsletterForm({ className }: { className?: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [email, setEmail] = useState('')
  const emailId = useId()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await http('/newsletter/subscriptions', { method: 'POST', body: { email } })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <div role="status" className="text-sm font-medium text-green-400">Thanks for subscribing! Check your inbox to confirm.</div>
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-2">
        <label htmlFor={emailId} className="sr-only">Email address</label>
        <input
          id={emailId}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email address"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-describedby={status === 'error' ? `${emailId}-error` : undefined}
          className="min-h-12 min-w-0 flex-1 rounded-control border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-royal"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="min-h-12 bg-brand-red text-white px-6 py-3 rounded-control text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
      {status === 'error' && <div id={`${emailId}-error`} role="alert" className="text-sm text-red-300">Subscription failed. Please try again.</div>}
      <p className="text-xs text-slate-300">Weekly, every Friday. Unsubscribe any time.</p>
    </form>
  )
}
