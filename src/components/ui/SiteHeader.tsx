'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SearchPalette } from './SearchPalette';

export function SiteHeader() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-line">
        <div className="max-w-container mx-auto px-4 md:px-6 h-[72px] flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-navy-900 text-xl tracking-tight">THE BUILDER</Link>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6 font-medium text-[15px] text-slate">
              <Link href="/stories" className="text-navy-900">Stories</Link>
              <Link href="/startups" className="hover:text-navy-900 transition-colors">Startups</Link>
              <Link href="/builders" className="hover:text-navy-900 transition-colors">Builders</Link>
              <Link href="/diaspora" className="hover:text-navy-900 transition-colors">Diaspora</Link>
            </nav>
            <button onClick={() => setPaletteOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-navy-50 transition-colors" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-navy-900"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </div>
        </div>
      </header>
      <SearchPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
