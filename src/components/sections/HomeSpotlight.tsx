import { useRef } from 'react'
import Link from 'next/link'

export default function HomeSpotlight({ loading }: { loading?: boolean }) {
  const rail = useRef<HTMLDivElement>(null)
  const scroll = (direction: number) => rail.current?.scrollBy({ left: direction * 304, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  const startups = [
    { id: 'KH', name: 'Kora Health', desc: 'Claims automation for West African Insurers.', tags: ['HealthTech', 'Seed'], loc: 'Lagos', cc: 'NG' },
    { id: 'SC', name: 'Shamba Cold', desc: 'Solar cold rooms leased to smallholder farmers.', tags: ['AgriTech', 'Pre-seed'], loc: 'Kano', cc: 'NG' },
    { id: 'PB', name: 'Pesa Bridge', desc: 'Low-fee remittances from Australia to East Africa.', tags: ['Fintech', 'Seed'], loc: 'Melbourne', cc: 'AU' },
    { id: 'LL', name: 'Lekki Learn', desc: 'Offline-first maths tutoring for secondary schools.', tags: ['EdTech', 'Series A+'], loc: 'Lagos', cc: 'NG' },
    { id: 'VG', name: 'Volta Grid', desc: 'Pay-as-you-go solar for market clusters.', tags: ['Energy', 'Seed'], loc: 'Accra', cc: 'GH' }
  ]

  return (
    <section className="py-section-mobile md:py-section overflow-hidden bg-[var(--surface-inverse)] text-[var(--text-on-inverse)] relative">
      {/* Decorative royal circles */}
      <div className="absolute right-0 top-1/2 w-[600px] h-[600px] bg-[var(--decoration-royal)] rounded-full blur-[100px] opacity-40 translate-x-1/3 -translate-y-1/2 pointer-events-none" />
      
      <div className="max-w-container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex justify-between items-end mb-8 border-b border-[var(--border-inverse)] pb-4">
          <div>
            <h2 className="font-display font-bold text-[24px] leading-[30px] md:text-[32px] md:leading-[40px] text-[var(--text-on-inverse)] relative inline-block mb-3">
              Startup Spotlight
              <span className="absolute left-0 -bottom-4 w-12 h-[3px] bg-[var(--accent)]"></span>
            </h2>
            <p className="text-[var(--text-meta-on-inverse)] font-ui">Early-stage companies our editors are watching this quarter.</p>
          </div>
          <div className="hidden md:flex gap-2 mb-2">
            <button type="button" aria-label="Previous startups" onClick={() => scroll(-1)} className="w-11 h-11 rounded-full border border-[var(--border-inverse)] flex items-center justify-center text-[var(--text-on-inverse)] hover:bg-[var(--surface-card)]/10 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button type="button" aria-label="Next startups" onClick={() => scroll(1)} className="w-11 h-11 rounded-full border border-[var(--border-inverse)] flex items-center justify-center text-[var(--text-on-inverse)] hover:bg-[var(--surface-card)]/10 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        <div ref={rail} aria-busy={loading} className="flex gap-6 overflow-x-auto pb-8 snap-x hide-scrollbar">
          {startups.map((s, i) => (
            <div key={i} className="min-w-[280px] w-[280px] shrink-0 bg-[var(--surface-inverse-deep)] rounded-lg p-6 snap-start flex flex-col hover:-translate-y-1 transition-transform cursor-pointer border border-[var(--border-inverse)]">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-[var(--surface-inverse)] rounded-xl flex items-center justify-center font-display font-bold text-xl text-[var(--text-on-inverse)]">
                  {s.id}
                </div>
                <div className="text-[11px] font-ui font-semibold text-[var(--text-meta-on-inverse)] flex items-center gap-1">
                  <span>{s.cc}</span>
                  <span>{s.loc}</span>
                </div>
              </div>
              <h3 className="font-display font-bold text-[var(--text-on-inverse)] text-xl mb-2"><Link href="/startups" className="hover:underline underline-offset-4">{s.name}</Link></h3>
              <p className="text-[var(--text-meta-on-inverse)] text-sm mb-6 flex-1">{s.desc}</p>
              <div className="flex gap-2">
                {s.tags.map(t => (
                  <span key={t} className="px-2 py-1 bg-[var(--surface-card)]/5 text-[var(--text-meta-on-inverse)] rounded text-[11px] font-semibold tracking-wide">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
