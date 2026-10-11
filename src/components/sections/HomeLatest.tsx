import SectionTitle from '../ui/SectionTitle'
import StoryCard from '../cards/StoryCard'

export default function HomeLatest({ loading, edition }: any) {
  const articles = [
    { kicker: 'Fintech', title: 'Inside the quiet rise of Lagos’ merchant-credit startups', summary: 'Three founders on lending to traders the banks never saw.', author: 'Tunde Bakare', date: '6 Oct', readTime: '7 min read' },
    { kicker: 'Interviews', title: 'Selba-Gondoza Luka on building a care network for new arrivals', summary: 'The South Sudanese-Australian nurse turned founder on scale without losing warmth.', author: 'Grace Ochieng', date: '6 Oct', readTime: '10 min read' },
    { kicker: 'AgriTech', title: 'Cold rooms, not apps: what Kano’s tomato farmers actually needed', summary: 'A hardware-first startup cut spoilage by a third in one season.', author: 'Musa Ibrahim', date: '5 Oct', readTime: '6 min read' },
    { kicker: 'Analysis', title: 'Q3 2026: where African venture money went', summary: 'Debt grew, seed rounds shrank, and climate quietly doubled.', author: 'Chioma Eze', date: '5 Oct', readTime: '5 min read' },
    { kicker: 'Diaspora', title: 'Bellamore Ndayikeze and the business of second chances', summary: 'A Burundian-born entrepreneur on hiring people others overlook.', author: 'Adaeze Nwosu', date: '4 Oct', readTime: '8 min read' },
    { kicker: 'Business', title: 'The Blue Nile Business Masterclass graduates its first cohort', summary: 'Forty African-Australian founders, twelve weeks, one shared goal.', author: 'Liam Okoro', date: '4 Oct', readTime: '4 min read', sponsorable: true },
    { kicker: 'HealthTech', title: 'Why Kora Health bet on insurers before patients', summary: 'Claims automation was not the glamorous choice.', author: 'Tunde Bakare', date: '3 Oct', readTime: '6 min read' },
    { kicker: 'Opinion', title: 'Africa does not need more hubs. It needs more customers.', summary: 'An investor’s case for demand-side thinking.', author: 'Ifeoma Uche', date: '3 Oct', readTime: '5 min read' }
  ]

  return (
    <section className="border-t border-line py-section-mobile md:py-section">
      <div className="max-w-container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-8">
          <SectionTitle>Latest Stories</SectionTitle>
          <a href="/stories" className="hidden md:block font-semibold text-brand-red hover:text-red-700 transition-colors">
            View all stories →
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-[20px] md:gap-y-[40px] md:gap-x-[24px]">
          {articles.map((article, i) => (
            <StoryCard key={i} article={article} />
          ))}
        </div>
        
        <div className="mt-8 md:hidden text-center">
          <a href="/stories" className="font-semibold text-brand-red hover:text-red-700">View all stories →</a>
        </div>
      </div>
    </section>
  )
}
