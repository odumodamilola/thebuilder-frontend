'use client';

import React from 'react';

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled or API failed
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard'); // simple toast fallback
    }
  };

  return (
    <div className="sticky top-[120px] flex flex-col gap-3">
      <button onClick={handleShare} className="w-10 h-10 rounded-full border border-line flex items-center justify-center text-slate hover:text-navy-900 hover:border-navy-900 transition-colors" aria-label="Share story">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
      </button>
      <button className="w-10 h-10 rounded-full border border-line flex items-center justify-center text-slate hover:text-navy-900 hover:border-navy-900 transition-colors" aria-label="Share on Twitter">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
      </button>
      <button className="w-10 h-10 rounded-full border border-line flex items-center justify-center text-slate hover:text-navy-900 hover:border-navy-900 transition-colors" aria-label="Copy link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
      </button>
    </div>
  );
}
