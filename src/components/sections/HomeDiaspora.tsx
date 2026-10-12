import SectionTitle from '../ui/SectionTitle'
import BuilderCard from '../cards/BuilderCard'
import Link from 'next/link'
import { useState } from 'react'
import { homeBuilders } from '@/lib/home-builders'
import type { Edition } from '@/lib/types'

export default function HomeDiaspora({ loading, edition }: { loading?: boolean; edition: Edition }) {
  const [selection, setSelection] = useState<{ edition: Edition; region: string } | null>(null)
  const activeRegion = selection?.edition === edition ? selection.region : edition === 'Australia' ? 'Australia' : 'UK'
  const builders = homeBuilders[activeRegion] ?? []

  return (
    <section className="py-section-mobile md:py-section">
      <div className="max-w-container mx-auto px-4 md:px-6">
        <div className="mb-6 flex items-end justify-between gap-6"><SectionTitle>Builders Beyond Borders.</SectionTitle><a href="/diaspora" className="hidden text-sm font-semibold text-[var(--text-heading)] md:block">Explore the Diaspora hub →</a></div>
        <div className="flex gap-4 border-b border-[var(--border)] overflow-x-auto pb-0 scrollbar-hide">
          {Object.keys(homeBuilders).map(region => (
            <button type="button" aria-pressed={activeRegion === region} aria-controls="home-region-profiles" onClick={() => setSelection({ edition, region })} key={region} className={`min-h-11 whitespace-nowrap px-0 mr-5 py-2 font-medium text-sm transition-colors ${activeRegion === region ? 'text-[var(--text-heading)] border-b-2 border-[var(--accent)] -mb-[1px]' : 'text-[var(--text-meta)] hover:text-[var(--text-heading)]'}`}>
              {region}
            </button>
          ))}
        </div>
        <div id="home-region-profiles" aria-label={`Builders in ${activeRegion}`} aria-live="polite" aria-busy={loading} className="grid grid-cols-2 lg:grid-cols-4 gap-x-[16px] gap-y-[24px] md:gap-x-[24px] md:gap-y-[32px] mt-[32px]">
          {builders.map((b, i) => <BuilderCard key={i} builder={b} />)}
        </div>
        <Link href="/diaspora" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold md:hidden">Explore the Diaspora hub →</Link>
      </div>
    </section>
  )
}
