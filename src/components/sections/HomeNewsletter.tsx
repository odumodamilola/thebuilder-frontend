import NewsletterForm from '../ui/NewsletterForm'

export default function HomeNewsletter() {
  return (
    <section id="newsletter" className="bg-navy-50 py-section-mobile md:py-section px-4 md:px-6 scroll-mt-20">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-navy-900 mb-4">
          Subscribe to The Builder
        </h2>
        <p className="text-slate mb-8 font-serif text-lg">
          Get the best stories of African builders sent directly to your inbox every week.
        </p>
        
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-line mb-4 text-left">
          <NewsletterForm />
        </div>
        
        <p className="text-xs text-slate">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  )
}
