import SectionTitle from '../ui/SectionTitle'
import StoryCard from '../cards/StoryCard'
import Link from 'next/link'

export default function HomePicks({ loading, edition }: any) {
  const pick = { kicker: "EDITOR'S PICK", title: 'How Osogbo became a quiet home for hardware founders', summary: 'Cheap space, a university pipeline and the Osun Tech Exchange are pulling builders out of Lagos.', author: 'Musa Ibrahim', date: '2 Oct', readTime: '11 min read', alt: '' } as any
  const rest = [
    { kicker: 'PROFILES', title: 'Bellamore Ndayikeze: hiring the overlooked', date: '1 Oct', readTime: '8 min read' },
    { kicker: 'ANALYSIS', title: 'What the Australia edition means for the diaspora story', date: '30 Sep', readTime: '5 min read' },
    { kicker: 'INTERVIEWS', title: 'Ten questions for the Blue Nile Masterclass mentors', date: '29 Sep', readTime: '6 min read' },
  ] as any[]

  return (
    <section className="bg-[var(--surface-page)] py-section-mobile md:py-section px-4 md:px-6">
      <div className="max-w-container mx-auto">
        <div className="mb-8">
          <SectionTitle>Editor's picks</SectionTitle>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-10">
          <StoryCard article={pick} editorial loading={loading} />
          <div className="flex flex-col gap-0">
            {rest.map((r, i) => (
              <div key={i} className="py-4 border-b border-[var(--border)] last:border-0 first:pt-0">
                 <p className="mb-2 text-kicker font-semibold uppercase text-text-meta">{r.kicker}</p>
                 <h3 className="mb-3 font-display text-[20px] font-bold leading-[27px] text-text-heading"><Link href="/stories" className="hover:underline decoration-[var(--text-accent)] underline-offset-4">{r.title}</Link></h3>
                 <p className="text-meta text-text-meta">{r.date} <span aria-hidden="true">·</span> {r.readTime}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
