'use client'
import { Edition } from '@/lib/types'
import { cn } from '@/lib/utils'
import Kicker from '../ui/Kicker'
import PlaceholderImage from '../ui/PlaceholderImage' // assuming we have or will create this

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

  if (loading) return <div className="h-[500px] bg-navy-50 animate-pulse max-w-container mx-auto mt-8" />

  return (
    <section className="max-w-container mx-auto px-4 md:px-6 py-section-mobile md:py-section">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-x-8 gap-y-6">
        
        {/* Lead Story */}
        <div className="group cursor-pointer tb-settle flex flex-col md:block relative md:rounded-lg overflow-hidden md:min-h-[460px] bg-navy-900 -mx-4 md:mx-0">
          <div className="relative w-full aspect-[16/10] md:absolute md:inset-0 md:w-auto md:aspect-auto">
            {/* Design shows a blue background with a subtle overlay, not a photo */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.4) 0%, transparent 60%)' }} />
            <div className="absolute inset-0 md:bg-gradient-to-t md:from-navy-900 md:via-navy-900/80 md:to-transparent bg-navy-900/40" />
          </div>
          <div className="relative z-10 text-white tb-fadeup px-4 py-6 md:absolute md:bottom-0 md:left-0 md:w-full md:p-10 flex flex-col justify-end">
            <Kicker inverse className="mb-[14px]">{lead.kicker}</Kicker>
            <h1 className="font-display font-extrabold text-[30px] leading-[36px] md:text-[clamp(30px,3.6vw,52px)] md:leading-[1.06] tracking-[-0.01em] mb-[14px]">
              {lead.title}
            </h1>
            <p className="font-serif text-[17px] leading-[26px] text-white/90 mb-[14px] max-w-[600px] line-clamp-2">
              {lead.summary}
            </p>
            <div className="flex items-center gap-[6px] text-[13px] font-ui text-slate-300">
              <span className="font-medium text-white">{lead.author}</span>
              <span>·</span>
              <span>{lead.date}</span>
              <span>·</span>
              <span>{lead.readTime}</span>
            </div>
          </div>
        </div>

        {/* Secondary Stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 content-start">
          {secondary.map((story, i) => (
            <div key={i} className="grid grid-cols-[112px_1fr] md:grid-cols-[140px_1fr] lg:grid-cols-[168px_1fr] gap-[20px] items-start pt-[20px] group cursor-pointer tb-fadeup border-t border-line" style={{ animationDelay: `${(i+1)*100}ms` }}>
              <div className="w-full aspect-square md:aspect-[4/3] bg-navy-50 rounded-md overflow-hidden relative">
                 <div className="absolute inset-0 w-full h-full bg-slate-100 flex items-center justify-center">
                    <div className="absolute top-0 right-0 w-[60%] h-[120%] bg-slate-200 rounded-bl-full opacity-50 translate-x-[20%] -translate-y-[10%]" />
                    <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
                 </div>
              </div>
              <div className="flex flex-col justify-start min-w-0">
                <Kicker className="mb-[8px] text-[11px]">{story.kicker}</Kicker>
                <h2 className="font-display font-bold text-navy-900 text-[17px] md:text-[20px] leading-[1.3] tracking-tight mb-[8px]">
                  <span className="bg-[linear-gradient(var(--brand-red),var(--brand-red))] bg-no-repeat bg-[position:0_100%] bg-[length:0%_2px] group-hover:bg-[length:100%_2px] transition-[background-size] duration-250 pb-[2px]">
                    {story.title}
                  </span>
                </h2>
                <div className="text-[13px] leading-[18px] text-slate-500">{story.date}</div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  )
}

