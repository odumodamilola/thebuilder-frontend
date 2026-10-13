import NewsletterForm from '../ui/NewsletterForm'

export default function HomeNewsletter() {
  return (
    <section id="newsletter" className="tb-dots scroll-mt-20 bg-[var(--surface-inverse)] px-4 py-14 text-[var(--text-on-inverse)] md:px-6 md:py-[88px]">
      <div className="mx-auto grid grid-cols-1 max-w-container items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16">
        <div>
          <p className="mb-3 text-[12px] font-bold uppercase tracking-[.08em]"><span className="mr-2 inline-block h-2 w-2 bg-[var(--accent)]" />The Friday Builder</p>
          <h2 className="max-w-[620px] font-display text-[32px] font-extrabold leading-[40px] tracking-[-.01em] md:text-[48px] md:leading-[56px]">The week’s best builder stories, every Friday</h2>
        </div>
        <NewsletterForm />
      </div>
    </section>
  )
}
