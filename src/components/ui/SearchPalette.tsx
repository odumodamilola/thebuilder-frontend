'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';

interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchPalette({ isOpen, onClose }: SearchPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  
  const recent = ['fintech Lagos', 'Haftu Strintzos'];
  const popular = ['Diaspora', 'Fintech', 'Melbourne', 'Grants', 'AgriTech'];
  
  const hasQuery = query.length >= 2;
  const mockResults = useMemo(() => hasQuery ? [
    { id: 'res-1', type: 'Stories', title: 'From the Mountains of Tigray to an Australian Record', href: '/stories/haftu-strintzos-australian-record' },
    { id: 'res-2', type: 'Stories', title: 'Inside the quiet rise of Lagos’ merchant-credit startups', href: '/stories/lagos-merchant-credit-startups' },
    { id: 'res-3', type: 'Builders', title: 'Haftu Strintzos', href: '/builders/haftu-strintzos' },
    { id: 'res-4', type: 'Builders', title: 'Mohamed Semra', href: '/builders/mohamed-semra' },
    { id: 'res-5', type: 'Startups', title: 'Kora Health', href: '/startups/kora-health' },
    { id: 'res-6', type: 'Topics', title: 'Fintech', href: '/search?q=Fintech' },
  ].filter(r => r.title.toLowerCase().includes(query.toLowerCase())) : [], [hasQuery, query]);

  useEffect(() => {
    if (isOpen) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const focusTimer = window.setTimeout(() => {
        setQuery('');
        setActiveIndex(-1);
        inputRef.current?.focus();
      }, 50);
      return () => {
        window.clearTimeout(focusTimer);
        document.body.style.overflow = previousOverflow;
        returnFocusRef.current?.focus();
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Global hook would open this
      }
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Tab' && panelRef.current) {
        const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, mockResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, -1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && mockResults[activeIndex]) {
          void router.push(mockResults[activeIndex].href).then(onClose);
        } else if (query.trim()) {
          void router.push(`/search?q=${encodeURIComponent(query)}`).then(onClose);
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, query, activeIndex, mockResults, onClose, router]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[250] flex justify-center items-start pt-[12vh] bg-[#0B2046]/40 backdrop-blur-[6px] font-ui"
      onClick={onClose}
    >
      <div 
        ref={panelRef}
        role="dialog" 
        aria-modal="true" 
        aria-label="Search"
        className="mx-4 flex max-h-[76vh] w-[640px] max-w-[calc(100%-2rem)] flex-col overflow-hidden rounded-md bg-white shadow-overlay animate-in fade-in zoom-in-95 duration-200 sm:rounded-lg"
        onClick={e => e.stopPropagation()}
      >
        <div 
          className="flex items-center gap-3 px-4 h-16 border-b border-line shrink-0"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-navy-900">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={inputRef}
            role="combobox"
            aria-label="Search The Builder"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-expanded={hasQuery}
            aria-activedescendant={activeIndex >= 0 ? `result-${activeIndex}` : undefined}
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIndex(-1); }}
            placeholder="Search stories, builders, startups…"
            className="flex-1 min-w-0 border-0 outline-none text-[18px] text-ink bg-transparent"
          />
          <button 
            type="button" 
            onClick={onClose}
            aria-label="Close search"
            className="h-7 px-2 border border-line rounded-[6px] bg-white text-[12px] font-medium text-slate hover:bg-slate-50 transition-colors"
          >
            Esc
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[440px]">
          <div className="p-2">
            {!hasQuery ? (
              <div className="p-3 flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-slate mb-1.5">Recent</span>
                  {recent.map((r, i) => (
                    <button key={i} onClick={() => setQuery(r)} className="flex items-center gap-2.5 min-h-[44px] text-[15px] text-ink rounded-md hover:bg-navy-50 px-3 transition-colors text-left">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-slate">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                        <path d="M3 3v5h5"></path>
                        <path d="M12 7v5l4 2"></path>
                      </svg>
                      {r}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-2.5">
                  <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-slate">Popular</span>
                  <div className="flex gap-2 flex-wrap">
                    {popular.map((p, i) => (
                      <button key={i} onClick={() => setQuery(p)} className="px-3 py-1.5 rounded-full border border-line text-[14px] text-navy-900 hover:border-navy-900 transition-colors">
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : mockResults.length === 0 ? (
              <div className="p-8 text-center text-slate text-[15px]">
                No results for "{query}"
              </div>
            ) : (
              <div>
                <ul id="search-results" role="listbox" aria-label="Search results" className="list-none m-0 p-0">
                  {mockResults.map((res, i) => {
                    const isFirstOfGroup = i === 0 || mockResults[i - 1]?.type !== res.type;
                    return (
                      <React.Fragment key={res.id}>
                        {isFirstOfGroup && (
                          <li role="presentation" className="text-[11px] font-semibold tracking-[0.08em] uppercase text-slate px-3 pt-3 pb-1.5">
                            {res.type}
                          </li>
                        )}
                        <li 
                          id={`result-${i}`}
                          role="option"
                          aria-selected={activeIndex === i}
                          onMouseEnter={() => setActiveIndex(i)}
                          onClick={() => { void router.push(res.href).then(onClose); }}
                          className={cn(
                            "flex items-center gap-3 min-h-[44px] px-3 rounded-md cursor-pointer text-[15px] transition-colors",
                            activeIndex === i ? "bg-navy-50 text-navy-900 shadow-[inset_2px_0_0_#D8121B]" : "text-slate hover:bg-slate-50"
                          )}
                        >
                          <span className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                            {res.title}
                          </span>
                        </li>
                      </React.Fragment>
                    );
                  })}
                </ul>
                <Link href={`/search?q=${encodeURIComponent(query)}`} className="flex items-center justify-between min-h-[44px] mt-1 px-3 border-t border-line text-[14px] font-semibold text-navy-900 hover:bg-slate-50 transition-colors" onClick={onClose}>
                  See all results for "{query}" <span>→</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
