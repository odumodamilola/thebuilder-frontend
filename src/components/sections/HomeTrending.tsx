import SectionTitle from '../ui/SectionTitle'

export default function HomeTrending() {
  const trending = [
    'From the Mountains of Tigray to an Australian Record: The Remarkable Journey of Haftu Strintzos',
    "From Sudan to the Mayor's Office: Mohamed Semra and a New Generation of African-Australian Leadership",
    'Q3 2026: where African venture money went',
    'Selling More Than Food: How Moses Musioka is Building a Kenyan Brand in Melbourne',
    'Cold rooms, not apps: what Kano’s tomato farmers actually needed'
  ]

  return (
    <section className="bg-slate-50 py-section-mobile md:py-section px-4 md:px-6 border-y border-line">
      <div className="max-w-container mx-auto">
        <div className="mb-8">
          <SectionTitle>Trending</SectionTitle>
        </div>
        <ol className="flex flex-col md:flex-row gap-6 md:gap-8">
          {trending.map((title, i) => (
            <li key={i} className="flex-1 flex gap-4 group cursor-pointer tb-fadeup" style={{ animationDelay: `${(i+1)*100}ms` }}>
              <span 
                className="font-display font-extrabold text-[48px] leading-[0.8] text-transparent"
                style={{ WebkitTextStroke: '1px #94a3b8' }}
              >
                {i + 1}
              </span>
              <h4 className="font-display font-bold text-navy-900 group-hover:text-brand-red transition-colors text-[15px] leading-snug">
                {title}
              </h4>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
