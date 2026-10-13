'use client';

import React from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';

export function ReadingProgressBar() {
  const progress = useScrollProgress();

  return (
    <div 
      className="fixed top-[72px] left-0 z-40 h-[2px] bg-[var(--accent)] transition-all duration-100 origin-left"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
