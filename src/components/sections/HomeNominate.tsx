import Button from '../ui/Button'

export default function HomeNominate() {
  return (
    <section className="py-section-mobile md:py-section px-4 md:px-6">
      <div className="max-w-container mx-auto relative rounded-2xl bg-navy-900 bg-dot-grid text-white p-12 md:p-16 text-center overflow-hidden">
        {/* Decorative royal circles */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-royal rounded-full blur-[100px] opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-royal rounded-full blur-[100px] opacity-30 translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <h2 className="font-display font-extrabold text-3xl md:text-5xl uppercase tracking-tight mb-6">
            KNOW A BUILDER WE SHOULD FEATURE<span className="text-brand-red">.</span>
          </h2>
          <p className="font-serif text-xl text-slate-300 mb-8 max-w-2xl">
            Whether they are building the next big fintech in Lagos, running a local community project in Melbourne, or making art in London, we want to hear their story.
          </p>
          <Button variant="accent" size="lg">Nominate a Builder →</Button>
        </div>
      </div>
    </section>
  )
}
