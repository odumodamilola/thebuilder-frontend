import Link from "next/link";

export default function HomeNominate() {
  return (
    <section className="tb-dots relative overflow-hidden bg-[var(--surface-inverse)] px-4 py-20 text-[var(--text-on-inverse)] md:px-6 md:py-28">
      <div className="relative mx-auto max-w-container">
        {/* Decorative royal circles */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[var(--decoration-royal)] rounded-full blur-[100px] opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[var(--decoration-royal)] rounded-full blur-[100px] opacity-30 translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 max-w-[920px]">
          <h2 className="mb-6 font-display text-[40px] font-extrabold uppercase leading-[44px] tracking-[-.02em] md:text-[72px] md:leading-[76px]">
            KNOW A BUILDER WE SHOULD FEATURE.
          </h2>
          <p className="mb-8 max-w-2xl font-serif text-xl text-[color:color-mix(in_srgb,var(--text-on-inverse)_80%,transparent)]">
            Founders, professionals and community leaders doing remarkable work,
            at home or abroad. Tell us who. Our editors read every nomination.
          </p>
          <Link
            href="/nominate"
            className="inline-flex min-h-12 items-center rounded-control bg-[var(--accent)] px-6 font-semibold text-[var(--text-on-inverse)] hover:bg-[var(--accent-hover)]"
          >
            Nominate a Builder →
          </Link>
        </div>
      </div>
    </section>
  );
}
