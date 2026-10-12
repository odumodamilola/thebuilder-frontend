import Button from '../ui/Button'

export default function HomeNominate() {
  return (
    <section className="tb-dots relative overflow-hidden bg-royal px-4 py-20 text-white md:px-6 md:py-28">
      <div className="relative mx-auto max-w-container">
        {/* Decorative royal circles */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-royal rounded-full blur-[100px] opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-royal rounded-full blur-[100px] opacity-30 translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 max-w-[920px]">
          <h2 className="mb-6 font-display text-[40px] font-extrabold uppercase leading-[44px] tracking-[-.02em] md:text-[72px] md:leading-[76px]">
            KNOW A BUILDER WE SHOULD FEATURE<span className="text-brand-red">.</span>
          </h2>
          <p className="mb-8 max-w-2xl font-serif text-xl text-white/80">
            Founders, professionals and community leaders doing remarkable work, at home or abroad. Tell us who. Our editors read every nomination.
          </p>
          <Button variant="accent" size="lg">Nominate a Builder →</Button>
        </div>
      </div>
    </section>
  )
}
