import SectionTitle from '../ui/SectionTitle'
import OpportunityRow from '../cards/OpportunityRow'

export default function HomeOpportunities({ loading, edition }: any) {
  const opps = [
    { org: 'Osun Tech Exchange', title: 'OTX 3.0 Startup Pitch Competition', type: 'Competition', location: 'Osogbo, NG', daysLeft: 2 },
    { org: 'Tony Elumelu Foundation', title: 'TEF Entrepreneurship Programme 2027', type: 'Grant', location: 'Pan-Africa', daysLeft: 4 },
    { org: 'Catalysr', title: 'Migrant Entrepreneurship Program — Melbourne', type: 'Accelerator', location: 'Melbourne, AU', daysLeft: 12 },
    { org: 'Mozilla Foundation', title: 'Africa Innovation Mradi Fellowship', type: 'Fellowship', location: 'Remote', daysLeft: 21 },
  ]

  return (
    <section className="max-w-container mx-auto px-4 md:px-6 py-section-mobile md:py-section">
      <div className="flex justify-between items-end mb-8">
        <SectionTitle>Opportunities</SectionTitle>
        <a href="/opportunities" className="hidden md:block font-semibold text-brand-red hover:text-red-700 transition-colors">
          View all opportunities →
        </a>
      </div>
      
      <div className="flex flex-col">
        {opps.map((opp, i) => (
          <OpportunityRow key={i} {...opp} href={`/opportunities/${i}`} />
        ))}
      </div>
      
      <div className="mt-8 md:hidden text-center">
        <a href="/opportunities" className="font-semibold text-brand-red hover:text-red-700">View all opportunities →</a>
      </div>
    </section>
  )
}
