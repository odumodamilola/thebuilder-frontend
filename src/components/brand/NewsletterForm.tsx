'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

type SubscribeState = 'idle' | 'loading' | 'success' | 'error';

interface NewsletterFormProps {
  state?: SubscribeState;
  inverse?: boolean;
  compact?: boolean;
}

export function NewsletterForm({ state = 'idle', inverse = false, compact = false }: NewsletterFormProps) {
  const [formState, setFormState] = useState<SubscribeState>(state);
  const [email, setEmail] = useState('');
  const [edition, setEdition] = useState<'Nigeria' | 'Australia'>('Nigeria');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setFormState('loading');
    try {
      // TODO: POST /api/newsletter/subscribe
      await new Promise(r => setTimeout(r, 1000)); // stub
      setFormState('success');
    } catch {
      setFormState('error');
    }
  }

  if (formState === 'success') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-line bg-white">
        <div className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div className="flex flex-col">
          <p role="status" className="font-display font-bold text-[15px] text-navy-900 m-0">Check your inbox to confirm your subscription.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-md ${compact ? 'flex flex-col gap-3' : ''}`}>
      <div className="flex w-full relative">
        <input
          type="email"
          required
          placeholder="Your email address"
          className={`w-full h-14 pl-4 pr-[120px] rounded-lg border ${
            inverse ? 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white focus:ring-white' 
            : 'bg-white border-line text-ink focus:border-royal focus:ring-royal'
          } text-[15px] focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={formState === 'loading'}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-6 rounded-[6px] font-medium text-[15px] bg-brand-red text-white hover:bg-red-700 transition-colors flex items-center justify-center min-w-[100px]"
        >
          {formState === 'loading' ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Subscribe'
          )}
        </button>
      </div>
      {formState === 'error' && (
        <p role="alert" className="text-sm text-brand-red mt-2 block">Something went wrong on our side. Try again.</p>
      )}
    </form>
  );
}
