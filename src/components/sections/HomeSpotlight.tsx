import SectionTitle from '../ui/SectionTitle'

export default function HomeSpotlight({ loading }: { loading?: boolean }) {
  const startups = [
    { id: 'KH', name: 'Kora Health', desc: 'Claims automation for West African Insurers.', tags: ['HealthTech', 'Seed'], loc: 'Lagos', cc: 'NG' },
    { id: 'SC', name: 'Shamba Cold', desc: 'Solar cold rooms leased to smallholder farmers.', tags: ['AgriTech', 'Pre-seed'], loc: 'Kano', cc: 'NG' },
    { id: 'PB', name: 'Pesa Bridge', desc: 'Low-fee remittances from Australia to East Africa.', tags: ['Fintech', 'Seed'], loc: 'Melbourne', cc: 'AU' },
    { id: 'LL', name: 'Lekki Learn', desc: 'Offline-first maths tutoring for secondary schools.', tags: ['EdTech', 'Series A+'], loc: 'Lagos', cc: 'NG' },
    { id: 'VG', name: 'Volta Grid', desc: 'Pay-as-you-go solar for market clusters.', tags: ['Energy', 'Seed'], loc: 'Accra', cc: 'GH' }
  ]

  return (
    <section className="py-section-mobile md:py-section overflow-hidden bg-navy-900 text-white relative">
      {/* Decorative royal circles */}
      <div className="absolute right-0 top-1/2 w-[600px] h-[600px] bg-royal rounded-full blur-[100px] opacity-40 translate-x-1/3 -translate-y-1/2 pointer-events-none" />
      
      <div className="max-w-container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
          <div>
            <h2 className="font-display font-bold text-[32px] md:text-[40px] text-white relative inline-block mb-3">
              Startup Spotlight
              <span className="absolute left-0 -bottom-4 w-12 h-[3px] bg-brand-red"></span>
            </h2>
            <p className="text-slate-400 font-ui">Early-stage companies our editors are watching this quarter.</p>
          </div>
          <div className="hidden md:flex gap-2 mb-2">
            <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 snap-x hide-scrollbar">
          {startups.map((s, i) => (
            <div key={i} className="min-w-[280px] w-[280px] shrink-0 bg-navy-950 rounded-lg p-6 snap-start flex flex-col hover:-translate-y-1 transition-transform cursor-pointer border border-white/10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-navy-900 rounded-xl flex items-center justify-center font-display font-bold text-xl text-white">
                  {s.id}
                </div>
                <div className="text-[11px] font-ui font-semibold text-slate-400 flex items-center gap-1">
                  <span>{s.cc}</span>
                  <span>{s.loc}</span>
                </div>
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-2">{s.name}</h3>
              <p className="text-slate-300 text-sm mb-6 flex-1">{s.desc}</p>
              <div className="flex gap-2">
                {s.tags.map(t => (
                  <span key={t} className="px-2 py-1 bg-white/5 text-slate-300 rounded text-[11px] font-semibold tracking-wide">
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
