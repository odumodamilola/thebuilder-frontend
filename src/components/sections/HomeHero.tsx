'use client'
import { Edition } from '@/lib/types'
import Kicker from '../ui/Kicker'
import Link from 'next/link'

interface HomeHeroProps {
  edition: Edition
  loading?: boolean
}

export default function HomeHero({ edition, loading }: HomeHeroProps) {
  const isNigeria = edition === 'Nigeria'

  const lead = isNigeria ? {
    kicker: 'COVER STORY',
    title: 'The Engineers Who Stayed: Why Some of Nigeria\'s Best Talent Chose Lagos Over London',
    summary: 'Five builders explain the calculus of staying when everyone else is leaving, and what they are building because they did.',
    author: 'Chioma Eze',
    date: '6 Oct 2026',
    readTime: '12 min read'
  } : {
    kicker: 'COVER STORY',
    title: 'From the Mountains of Tigray to an Australian Record: The Remarkable Journey of Haftu Strintzos',
    summary: 'He left Tigray at eleven with nothing but a road ahead of him. Two decades later, on a cold Melbourne morning, he ran faster than any Australian before him.',
    author: 'Adaeze Nwosu',
    date: '6 Oct 2026',
    readTime: '9 min read'
  }

  const secondary = isNigeria ? [
    { kicker: 'DIASPORA', title: 'From the Mountains of Tigray to an Australian Record: The Remarkable Journey of Haftu Strintzos', date: '5 Oct 2026 · 9 min read' },
    { kicker: 'FINTECH', title: 'Inside the Quiet Rise of Lagos\' Merchant-Credit Startups', date: '5 Oct 2026 · 7 min read' }
  ] : [
    { kicker: 'DIASPORA', title: "From Sudan to the Mayor's Office: Mohamed Semra and a New Generation of African-Australian Leadership", date: '5 Oct 2026 · 5 min read' },
    { kicker: 'FOUNDER STORIES', title: 'Selling More Than Food: How Moses Musioka is Building a Kenyan Brand in Melbourne', date: '4 Oct 2026 · 6 min read' }
  ]

  if (loading) return <div className="h-[500px] bg-[var(--surface-skeleton)] animate-pulse max-w-container mx-auto mt-8" />

  return (
    <section aria-label="Lead story" className="home-hero mx-auto max-w-container px-4 pb-10 md:pb-[72px] md:pt-8 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-x-8 gap-y-6">
        
        {/* Lead Story */}
        <Link href={isNigeria ? '/stories/the-engineers-who-stayed' : '/stories/haftu-strintzos-australian-record'} className="home-cover group relative flex min-w-0 flex-col md:overflow-hidden md:rounded-lg md:bg-[var(--surface-inverse)] md:text-[var(--text-on-inverse)]">
          <div className="home-cover-media relative -mx-4 aspect-[16/10] bg-[var(--surface-inverse)] md:mx-0">
            {/* Design shows a blue background with a subtle overlay, not a photo */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_5%,var(--decoration-royal),transparent_58%)]" />
            <div className="tb-dots absolute inset-0 opacity-30" />
            <div className="absolute inset-0 [background:var(--hero-gradient)]" />
            <span className="absolute left-4 top-4 text-[11px] text-[var(--text-on-inverse)]/60">Cover photo</span>
          </div>
          <div className="home-cover-copy relative z-10 pt-4 md:absolute md:bottom-0 md:left-0 md:w-full md:p-[clamp(20px,3.4vw,40px)] flex flex-col justify-end">
            <Kicker inverse className="mb-[14px]">{lead.kicker}</Kicker>
            <h1 className="mb-[14px] font-display text-[30px] font-extrabold leading-[36px] tracking-[-.02em] md:text-[clamp(30px,3.6vw,52px)] md:leading-[1.06]">
              {lead.title}.
            </h1>
            <p className="home-cover-summary text-[15px] leading-[23px] md:text-[17px] md:leading-[26px] md:text-[var(--text-on-inverse)]/90 mb-[14px] max-w-[600px] line-clamp-2">
              {lead.summary}
            </p>
            <div className="home-cover-meta flex flex-wrap items-center gap-[6px] text-[13px] leading-[18px] font-ui md:text-[var(--text-meta-on-inverse)]">
              <span className="font-medium text-[var(--text-on-inverse)]">{lead.author}</span>
              <span>·</span>
              <span>{lead.date}</span>
              <span>·</span>
              <span>{lead.readTime}</span>
            </div>
          </div>
        </Link>

        {/* Secondary Stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 content-start">
          {secondary.map((story, i) => (
            <Link href={isNigeria ? (i === 0 ? '/stories/haftu-strintzos-australian-record' : '/stories/lagos-merchant-credit-startups') : '/stories'} key={story.title} className="group grid grid-cols-[112px_minmax(0,1fr)] items-start gap-[20px] border-t border-[var(--border)] pt-[20px] md:grid-cols-[140px_minmax(0,1fr)] lg:grid-cols-[168px_minmax(0,1fr)]" style={{ animationDelay: `${(i+1)*100}ms` }}>
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[var(--surface-tint)] md:aspect-[4/3]">
                 <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-[var(--surface-tint)]">
                    <div className="absolute right-0 top-0 h-[120%] w-[60%] -translate-y-[10%] translate-x-[20%] rounded-bl-full bg-[var(--surface-raised)] opacity-50" />
                    <div className="tb-placeholder-dots absolute inset-0 opacity-30" />
                 </div>
              </div>
              <div className="flex flex-col justify-start min-w-0">
                <Kicker className="mb-[8px] text-[11px]">{story.kicker}</Kicker>
                <h2 className="mb-[8px] font-display text-[17px] font-bold leading-[1.3] tracking-tight text-[var(--text-heading)] md:text-[20px]">
                  <span className="bg-[linear-gradient(var(--accent),var(--accent))] bg-no-repeat bg-[position:0_100%] bg-[length:0%_2px] group-hover:bg-[length:100%_2px] transition-[background-size] duration-250 pb-[2px]">
                    {story.title}
                  </span>
                </h2>
                <div className="text-[13px] leading-[18px] text-[var(--text-meta)]">{story.date}</div>
              </div>
            </Link>
          ))}
        </div>
        
      </div>
    </section>
  )
}

