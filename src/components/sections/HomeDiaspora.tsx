import SectionTitle from '../ui/SectionTitle'
import BuilderCard from '../cards/BuilderCard'

export default function HomeDiaspora({ loading, edition }: any) {
  const builders = [
    { name: 'Ngozi Adeyemi', classification: 'Investor', location: 'Based in London, UK', flag: '🇬🇧', headline: 'Backing diaspora founders at pre-seed', alt: '' },
    { name: 'Kwame Asante', classification: 'Innovator', location: 'Based in Manchester, UK', flag: '🇬🇧', headline: 'Battery recycling from e-waste', alt: '' },
    { name: 'Amina Bello', classification: 'Diaspora Professional', location: 'Based in Leeds, UK', flag: '🇬🇧', headline: 'NHS data lead, Abuja health advisor', alt: '' },
    { name: 'Femi Ogunleye', classification: 'Creative', location: 'Based in London, UK', flag: '🇬🇧', headline: 'An Afro-futurist design studio', alt: '' },
  ] as any[]

  return (
    <section className="py-section-mobile md:py-section">
      <div className="max-w-container mx-auto px-4 md:px-6">
        <SectionTitle className="mb-[16px] md:mb-[24px]">Builders Beyond Borders</SectionTitle>
        <div className="flex gap-4 border-b border-line overflow-x-auto pb-0 scrollbar-hide">
          {['UK', 'US', 'Canada', 'Australia', 'Europe', 'Middle East', 'Africa', 'Asia'].map((region, i) => (
            <button key={region} className={`whitespace-nowrap px-4 py-2 font-semibold text-sm transition-colors ${i === 0 ? 'text-brand-red border-b-2 border-brand-red -mb-[1px]' : 'text-slate hover:text-navy-900'}`}>
              {region}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-[16px] gap-y-[24px] md:gap-x-[24px] md:gap-y-[32px] mt-[32px]">
          {builders.map((b, i) => <BuilderCard key={i} builder={b} />)}
        </div>
      </div>
    </section>
  )
}
