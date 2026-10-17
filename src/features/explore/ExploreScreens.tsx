"use client";

import { useSiteSettings } from "@/context/SiteSettingsContext";
import { diasporaRegions } from "@/lib/diaspora";
import { focusRegionPages } from "@/lib/diaspora";
import {
  editionCredit,
  focusRegions,
  videoFormats,
} from "@/lib/editorial-policy";
import { useEdition } from "@/context/EditionContext";
import { publisherForEdition } from "@/lib/legal-content";
import { PublicPagination } from "@/components/ui/Pagination";
import { publicApi } from "@/lib/api";
import { errorMessage } from "@/lib/http";
import { NewsletterForm } from "@/components/brand/NewsletterForm";
import { LoadingDots } from "@/components/ui/LoadingDots";

import { webUrl } from "@/lib/api";
import { usePublicData } from "@/context/PublicDataContext";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, ReactNode, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarPlus,
  Check,
  ChevronRight,
  Clock,
  ExternalLink,
  MapPin,
  Play,
  Search,
  Share2,
} from "lucide-react";
import {
  builders as fixtureBuilders,
  opportunities as fixtureOpportunities,
  startups as fixtureStartups,
  videos,
} from "./data";
const builders = fixtureBuilders,
  opportunities = fixtureOpportunities,
  startups = fixtureStartups;

const shell = "mx-auto w-full max-w-[1280px] px-4 md:px-6";
const display =
  "font-display font-extrabold tracking-[-.02em] text-[var(--text-heading)]";
const button =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2";

function Meta({ title }: { title: string }) {
  const { siteName, description } = useSiteSettings();
  return (
    <Head>
      <title>{`${title} · ${siteName}`}</title>
      <meta name="description" content={description} />
    </Head>
  );
}
function Crumbs({ items }: { items: string[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--text-meta)]"
    >
      <Link href="/">Home</Link>
      {items.map((x, i) => (
        <span key={x} className="flex items-center gap-2">
          <ChevronRight size={13} />
          {i === items.length - 1 ? (
            <span aria-current="page">{x}</span>
          ) : (
            <Link href={`/${x.toLowerCase().replaceAll(" ", "-")}`}>{x}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}
function PageHero({
  title,
  children,
  crumbs = [title],
  inverse = false,
}: {
  title: string;
  children?: ReactNode;
  crumbs?: string[];
  inverse?: boolean;
}) {
  return (
    <header
      className={
        inverse
          ? "bg-[var(--surface-inverse)] text-[var(--text-on-inverse)]"
          : "border-b border-[var(--border)] bg-[var(--surface-card)]"
      }
    >
      <div className={`${shell} py-8 md:py-14`}>
        <Crumbs items={crumbs} />
        <h1
          className={`${display} mt-5 text-[40px] leading-[1.04] md:text-7xl ${inverse ? "!text-[var(--text-on-inverse)]" : ""}`}
        >
          {title}
        </h1>
        {children && (
          <div
            className={`mt-4 max-w-2xl text-base leading-7 md:text-xl ${inverse ? "text-[var(--text-meta-on-inverse)]" : "text-[var(--text-meta)]"}`}
          >
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
function Media({
  label = "Portrait",
  ratio = "aspect-[4/5]",
}: {
  label?: string;
  ratio?: string;
}) {
  return (
    <div
      className={`${ratio} relative grid w-full place-items-center overflow-hidden bg-gradient-to-br from-[var(--surface-tint)] via-[var(--media-mid)] to-[var(--surface-blush)] text-xs font-semibold uppercase tracking-[.12em] text-[var(--text-meta)]`}
    >
      <span className="absolute inset-5 rounded-full border border-[color:color-mix(in_srgb,var(--text-on-inverse)_70%,transparent)]" />
      <span>{label}</span>
    </div>
  );
}
function Chip({
  onClick,
  active,
  children,
}: {
  onClick?: () => void;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-9 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition ${active ? "border-[var(--border-emphasis)] bg-[var(--surface-inverse)] text-[var(--text-on-inverse)]" : "border-[var(--border)] bg-[var(--surface-card)] text-[var(--text-heading)] hover:border-[var(--border-emphasis)]"}`}
    >
      {children}
    </button>
  );
}
function SectionTitle({
  children,
  link,
}: {
  children: ReactNode;
  link?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between border-b border-[var(--border)] pb-4">
      <h2 className={`${display} text-2xl md:text-[32px]`}>{children}</h2>
      {link && (
        <Link
          href={link}
          className="text-sm font-semibold text-[var(--text-heading)]"
        >
          See all <span className="text-[var(--text-accent)]">→</span>
        </Link>
      )}
    </div>
  );
}
function BuilderTile({
  b,
  badge,
}: {
  b: (typeof builders)[number];
  badge?: string;
}) {
  return (
    <Link
      href={`/builders/${b.slug}`}
      className="group block min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
    >
      <div className="relative overflow-hidden rounded-xl">
        <Media />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--accent)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--text-on-inverse)]">
            {badge}
          </span>
        )}
      </div>
      <span className="mt-4 inline-flex rounded-full bg-[var(--surface-tint)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-heading)]">
        {b.classification}
      </span>
      <h3
        className={`${display} mt-2 text-lg group-hover:text-[var(--text-accent)]`}
      >
        {b.name}
      </h3>
      <p className="mt-1 text-xs text-[var(--text-meta)]">
        {b.flag} {b.location}
      </p>
      <p className="mt-2 text-sm leading-5 text-[var(--text-body)]">
        {b.headline}
      </p>
    </Link>
  );
}
function StartupTile({ s }: { s: (typeof startups)[number] }) {
  return (
    <Link
      href={`/startups/${s.slug}`}
      className="group flex min-h-[230px] flex-col rounded-xl border border-[var(--border)] bg-[var(--surface-card)] p-6 transition hover:-translate-y-1 hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
    >
      <div className="flex items-start justify-between">
        <span className="grid size-14 place-items-center rounded-xl bg-[var(--surface-inverse)] font-display text-xl font-extrabold text-[var(--text-on-inverse)]">
          {s.name
            .split(" ")
            .map((x) => x[0])
            .join("")}
        </span>
        <div className="text-right">
          <span className="rounded-full bg-[var(--surface-tint)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
            {s.stage}
          </span>
          <p className="mt-2 text-xs text-[var(--text-meta)]">{s.industry}</p>
        </div>
      </div>
      <h3
        className={`${display} mt-5 text-xl group-hover:text-[var(--text-accent)]`}
      >
        {s.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6">{s.oneLiner}</p>
      <p className="mt-4 border-t border-[var(--border)] pt-3 text-xs text-[var(--text-meta)]">
        {s.flag} {s.hq} · Founded {s.founded}
      </p>
    </Link>
  );
}
function Empty({
  title,
  children,
  action,
}: {
  title: string;
  children: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="grid size-24 place-items-center rounded-full border-2 border-dashed border-[var(--border-strong)]">
        <i className="size-2.5 rounded-full bg-[var(--accent)]" />
      </span>
      <h2 className={`${display} mt-4 text-xl`}>{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-meta)]">
        {children}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] rounded-xl bg-[var(--surface-tint)]" />
          <div className="mt-4 h-4 w-2/3 rounded bg-[var(--surface-tint)]" />
          <div className="mt-2 h-3 rounded bg-[var(--surface-tint)]" />
        </div>
      ))}
    </div>
  );
}

export function BuildersScreen() {
  const live = usePublicData();
  const builders = live?.builders ?? fixtureBuilders;
  const r = useRouter(),
    state =
      process.env.NEXT_PUBLIC_DESIGN_PREVIEW === "true"
        ? String(r.query.state || "default")
        : "default";
  const [q, setQ] = useState(String(r.query.q || "")),
    [cls, setCls] = useState(String(r.query.classification || ""));
  const shown = builders.filter(
    (b) =>
      (!q ||
        (b.name + " " + b.headline).toLowerCase().includes(q.toLowerCase())) &&
      (!cls || b.classification === cls),
  );
  const empty = state === "empty" || !shown.length;
  return (
    <>
      <Meta title="The Builders" />
      <PageHero title="The Builders">
        <p>
          Founders, professionals and community leaders shaping Africa’s next
          decade.
        </p>
      </PageHero>
      <main>
        {!live && (
          <section className={`${shell} pb-12`}>
            <article className="grid overflow-hidden rounded-xl border border-[var(--border)] md:grid-cols-12">
              <div className="relative md:col-span-5">
                <Media label="Portrait" ratio="aspect-[4/4] h-full" />
                <span className="absolute left-4 top-4 rounded-full bg-[#b77b12] px-3 py-1 text-[11px] font-bold text-[var(--text-on-inverse)]">
                  {state === "year"
                    ? "Builder of the Year"
                    : "Builder of the Month"}
                </span>
              </div>
              <div className="flex flex-col items-start justify-center p-6 md:col-span-7 md:p-12">
                <span className="rounded-full bg-[var(--surface-tint)] px-3 py-1 text-xs font-bold">
                  Startup Founder
                </span>
                <h2 className={`${display} mt-4 text-3xl md:text-5xl`}>
                  Selba-Gondoza Luka
                </h2>
                <p className="mt-3 text-sm text-[var(--text-meta)]">
                  🇦🇺 Melbourne, Australia · Founder, Haven Care
                </p>
                <blockquote className="mt-5 border-l-4 border-[var(--accent)] pl-5 font-serif text-xl italic leading-8 text-[var(--text-heading)]">
                  “New arrivals don’t need a hundred services. They need one
                  person who answers the phone.”
                </blockquote>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    className={`${button} bg-[var(--surface-inverse)] text-[var(--text-on-inverse)]`}
                    href="/stories"
                  >
                    Read their story <ArrowRight size={16} />
                  </Link>
                  <Link
                    className={`${button} border border-[var(--border)]`}
                    href="/builders/selba-gondoza-luka"
                  >
                    View profile
                  </Link>
                </div>
              </div>
            </article>
          </section>
        )}
        <section className={`${shell} pb-24`}>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs font-semibold">
              Search Builders
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    void r.push({
                      pathname: r.pathname,
                      query: { ...r.query, page: 1, q },
                    });
                }}
                placeholder="Name, organisation or city"
                className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] px-3 text-sm"
              />
            </label>
            <label className="text-xs font-semibold">
              Classification
              <select
                value={cls}
                onChange={(e) => {
                  setCls(e.target.value);
                  void r.push({
                    pathname: r.pathname,
                    query: {
                      ...r.query,
                      page: 1,
                      classification: e.target.value,
                    },
                  });
                }}
                className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] px-3 text-sm"
              >
                <option value="">All classifications</option>
                {[...new Set(builders.map((b) => b.classification))].map(
                  (x) => (
                    <option key={x}>{x}</option>
                  ),
                )}
              </select>
            </label>
            <label className="text-xs font-semibold">
              Industry
              <select
                value={String(r.query.industry || "")}
                onChange={(e) =>
                  void r.push({
                    pathname: r.pathname,
                    query: { ...r.query, page: 1, industry: e.target.value },
                  })
                }
                className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] px-3 text-sm"
              >
                <option value="">All industries</option>
                {[...new Set(builders.map((b) => b.industry))]
                  .filter(Boolean)
                  .map((x) => (
                    <option key={x}>{x}</option>
                  ))}
              </select>
            </label>
            <label className="text-xs font-semibold">
              Country
              <select
                value={String(r.query.country || "")}
                onChange={(e) =>
                  void r.push({
                    pathname: r.pathname,
                    query: { ...r.query, page: 1, country: e.target.value },
                  })
                }
                className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] px-3 text-sm"
              >
                <option value="">All countries</option>
                {[...new Set(builders.map((b) => b.country))]
                  .filter(Boolean)
                  .map((x) => (
                    <option key={x}>{x}</option>
                  ))}
              </select>
            </label>
          </div>
          <p
            className="my-6 border-b border-[var(--border)] pb-3 text-xs text-[var(--text-meta)]"
            aria-live="polite"
          >
            {state === "loading"
              ? "Loading Builders…"
              : `${shown.length} Builders`}
          </p>
          {state === "loading" ? (
            <SkeletonGrid />
          ) : empty ? (
            <Empty
              title="No Builders match these filters"
              action={
                <Link
                  href="/nominate"
                  className={`${button} bg-[var(--accent)] text-[var(--text-on-inverse)]`}
                >
                  Nominate a Builder
                </Link>
              }
            >
              Try a different classification or country. If someone is missing,
              tell us about them.
            </Empty>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {shown.map((b, i) => (
                <BuilderTile
                  key={b.slug}
                  b={b}
                  badge={
                    state === "year" && i === 0
                      ? "Builder of the Year"
                      : undefined
                  }
                />
              ))}
            </div>
          )}
          <PublicPagination />
        </section>
        <NominateBand />
      </main>
    </>
  );
}

function NominateBand() {
  return (
    <section className="bg-[var(--surface-inverse)] py-16 text-[var(--text-on-inverse)] md:py-24">
      <div className={shell}>
        <h2 className="max-w-3xl font-display text-4xl font-extrabold uppercase leading-tight md:text-5xl">
          Know someone who belongs here?
        </h2>
        <Link
          href="/nominate"
          className={`${button} mt-6 bg-[var(--accent)] text-[var(--text-on-inverse)]`}
        >
          Nominate a Builder <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

export function BuilderProfileScreen() {
  const r = useRouter();
  const live = usePublicData();
  const b = live?.builders.find((x) => x.slug === r.query.slug);
  if (!b)
    return (
      <Empty title="Builder unavailable">
        This profile could not be found.
      </Empty>
    );
  return (
    <>
      <Meta title={b.name} />
      <main>
        <header className="border-b border-[var(--border)]">
          <div className={shell + " py-8 md:py-14"}>
            <Crumbs items={["Builders", b.name]} />
            <div className="mt-6 grid gap-8 md:grid-cols-[300px_1fr]">
              <div>
                {b.imageUrl ? (
                  <img
                    src={b.imageUrl}
                    alt={b.name}
                    className="aspect-[4/5] w-full rounded-xl object-cover"
                  />
                ) : (
                  <Media />
                )}
                <div className="mt-4 flex gap-2">
                  <Link
                    className={button + " border border-[var(--border)]"}
                    href="/nominate"
                  >
                    Nominate
                  </Link>
                </div>
              </div>
              <div>
                <span className="rounded-full bg-[var(--surface-tint)] px-3 py-1 text-xs font-bold">
                  {b.classification}
                </span>
                <h1 className={display + " mt-4 text-4xl md:text-6xl"}>
                  {b.name}
                </h1>
                <p className="mt-3 text-[var(--text-meta)]">
                  {b.flag} {b.location}
                </p>
                <p className="mt-6 max-w-2xl font-serif text-xl leading-8">
                  {b.headline}
                </p>
                <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)]">
                  {[
                    ["Industry", b.industry],
                    ["Based in", b.country],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-[var(--surface-card)] p-4">
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-meta)]">
                        {k}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </header>
        <div
          className={
            shell +
            " grid gap-12 py-12 md:grid-cols-[minmax(0,1fr)_340px] md:py-20"
          }
        >
          <div className="space-y-16">
            <section>
              <SectionTitle>About</SectionTitle>
              <p className="max-w-[680px] whitespace-pre-line font-serif text-lg leading-8">
                {b.bio}
              </p>
            </section>
            {b.articles?.length && (
              <section>
                <SectionTitle>Stories featuring {b.name}</SectionTitle>
                {b.articles.map((a) => (
                  <Link
                    key={a.id}
                    href={"/stories/" + a.slug}
                    className="block border-t border-[var(--border)] py-5"
                  >
                    <h3 className={display + " text-xl"}>{a.title}</h3>
                    <p className="mt-2 text-sm text-[var(--text-meta)]">
                      {a.summary}
                    </p>
                  </Link>
                ))}
              </section>
            )}
          </div>
          <aside>
            {webUrl(b.socialLinks?.website) && (
              <a
                href={webUrl(b.socialLinks?.website)}
                target="_blank"
                rel="noopener noreferrer"
                className={button + " border border-[var(--border)]"}
              >
                Website <ExternalLink size={16} />
              </a>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}

export function StartupsScreen() {
  const live = usePublicData();
  const startups = live?.startups ?? fixtureStartups;
  const r = useRouter(),
    advanced =
      process.env.NEXT_PUBLIC_DESIGN_PREVIEW === "true" &&
      r.query.state === "advanced";
  const [q, setQ] = useState(String(r.query.q || ""));
  const shown = startups.filter((s) =>
    s.name.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <Meta title="Startups" />
      <PageHero title="Startups">
        <p>
          A living directory of African-led companies solving meaningful
          problems at home and across the diaspora.
        </p>
      </PageHero>
      <main className={`${shell} py-10 pb-24`}>
        <div className="grid gap-3 border-b border-[var(--border)] pb-6 md:grid-cols-3">
          <label className="text-xs font-semibold">
            Search startups
            <input
              className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] px-3"
              placeholder="Name or keyword"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter")
                  void r.push({
                    pathname: r.pathname,
                    query: { ...r.query, q, page: 1 },
                  });
              }}
            />
          </label>
          <label className="text-xs font-semibold">
            Industry
            <select
              value={String(r.query.industry || "")}
              onChange={(event) =>
                void r.push({
                  pathname: r.pathname,
                  query: {
                    ...r.query,
                    page: 1,
                    ["industry"]: event.target.value,
                  },
                })
              }
              className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] px-3"
            >
              <option value="">All industries</option>
              {[...new Set(startups.map((startup) => startup.industry))]
                .filter(Boolean)
                .map((industry) => (
                  <option key={industry}>{industry}</option>
                ))}
            </select>
          </label>
          <label className="text-xs font-semibold">
            Stage
            <select
              value={String(r.query.stage || "")}
              onChange={(event) =>
                void r.push({
                  pathname: r.pathname,
                  query: { ...r.query, page: 1, ["stage"]: event.target.value },
                })
              }
              className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] px-3"
            >
              <option value="">All stages</option>
              {["Idea", "Pre-seed", "Seed", "Series A+", "Growth"].map(
                (stage) => (
                  <option key={stage}>{stage}</option>
                ),
              )}
            </select>
          </label>
        </div>
        {advanced && (
          <div className="my-5 rounded-xl bg-[var(--surface-tint)] p-5 text-sm">
            Advanced discovery mode · filter by headquarters, team size and
            founding year.
          </div>
        )}
        <p className="my-5 text-xs text-[var(--text-meta)]">
          {shown.length} startups
        </p>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((s) => (
            <StartupTile key={s.slug} s={s} />
          ))}
        </div>
        <PublicPagination />
      </main>
    </>
  );
}

export function StartupProfileScreen() {
  const r = useRouter();
  const live = usePublicData();
  const x = live?.startups.find((x) => x.slug === r.query.slug);
  if (!x)
    return (
      <Empty title="Startup unavailable">
        This profile could not be found.
      </Empty>
    );
  const website = webUrl(x.website);
  return (
    <>
      <Meta title={x.name} />
      <main>
        <header className="border-b border-[var(--border)]">
          <div className={shell + " py-8 md:py-12"}>
            <Crumbs items={["Startups", x.name]} />
            <div className="mt-6 flex flex-wrap items-start gap-5 md:gap-7">
              <span className="grid size-[72px] place-items-center rounded-xl bg-[var(--surface-inverse)] font-display text-2xl font-extrabold text-[var(--text-on-inverse)] md:size-24">
                {x.name
                  .split(" ")
                  .map((s) => s[0])
                  .join("")}
              </span>
              <div className="min-w-[240px] flex-1">
                <h1 className={display + " text-4xl md:text-5xl"}>{x.name}</h1>
                <p className="mt-3 max-w-2xl text-lg leading-7">{x.oneLiner}</p>
                {website && (
                  <a
                    className={
                      button +
                      " mt-5 bg-[var(--surface-inverse)] text-[var(--text-on-inverse)]"
                    }
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Website <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>
        <div
          className={
            shell +
            " grid gap-12 py-12 md:grid-cols-[minmax(0,1fr)_340px] md:py-20"
          }
        >
          <div className="space-y-16">
            <section>
              <SectionTitle>About</SectionTitle>
              <p className="max-w-[680px] whitespace-pre-line font-serif text-lg leading-8">
                {x.description}
              </p>
            </section>
            {!!x.founders?.length && (
              <section>
                <SectionTitle>Founders</SectionTitle>
                <div className="grid grid-cols-2 gap-5">
                  {x.founders.map((b) => (
                    <Link
                      href={"/builders/" + b.slug}
                      key={b.id}
                      className="rounded-xl border border-[var(--border)] p-5"
                    >
                      <h3 className={display}>{b.name}</h3>
                      <p className="mt-2 text-sm text-[var(--text-meta)]">
                        {b.headline}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
            {!!x.articles?.length && (
              <section>
                <SectionTitle>Related stories</SectionTitle>
                {x.articles.map((a) => (
                  <Link
                    key={a.id}
                    href={"/stories/" + a.slug}
                    className="block border-t border-[var(--border)] py-5"
                  >
                    <h3 className={display + " text-xl"}>{a.title}</h3>
                  </Link>
                ))}
              </section>
            )}
          </div>
          <aside className="h-fit rounded-xl border border-[var(--border)] p-6">
            <dl className="space-y-5">
              {[
                ["Industry", x.industry],
                ["Stage", x.stage],
                ["Headquarters", x.hq],
                ["Founded", x.foundedYear || "Not listed"],
                ["Team", x.teamSize || "Not listed"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs font-semibold text-[var(--text-meta)]">
                    {k}
                  </dt>
                  <dd className="mt-1 font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </main>
    </>
  );
}

export function DiasporaScreen() {
  const live = usePublicData();
  const builders = live?.builders ?? fixtureBuilders;
  const startups = live?.startups ?? fixtureStartups;
  const opportunities = live?.opportunities ?? fixtureOpportunities;
  return (
    <>
      <Meta title="Diaspora" />
      <main>
        <section className="overflow-hidden bg-[var(--surface-inverse)] py-12 text-[var(--text-on-inverse)] md:py-20">
          <div className={`${shell} grid items-center gap-10 lg:grid-cols-2`}>
            <div>
              <h1 className="font-display text-[38px] font-extrabold leading-[1.02] md:text-7xl">
                Builders beyond borders
              </h1>
              <p className="mt-5 max-w-xl text-lg text-[var(--text-meta-on-inverse)]">
                Nigerians and Africans building across the world.
              </p>
            </div>
            <div className="relative aspect-[16/10] rounded-xl border border-[color:color-mix(in_srgb,var(--text-on-inverse)_20%,transparent)] bg-[radial-gradient(#3B5BAE_1px,transparent_1.5px)] [background-size:14px_14px]">
              {[
                ["Australia", "78%", "72%"],
                ["United Kingdom", "47%", "32%"],
                ["US", "20%", "40%"],
                ["Canada", "20%", "20%"],
                ["Africa", "50%", "65%"],
              ].map((x) => (
                <Link
                  key={x[0]}
                  href={
                    "/diaspora/" + (focusRegionPages[x[0]!] || "united-kingdom")
                  }
                  style={{ left: x[1], top: x[2] }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                >
                  <i className="block size-4 animate-pulse rounded-full border-4 border-[var(--text-on-inverse)] bg-[var(--accent)]" />
                  <span className="absolute left-5 top-0 whitespace-nowrap text-xs font-bold">
                    {x[0]}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className={`${shell} py-14 md:py-20`}>
          <SectionTitle>Explore by region</SectionTitle>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {focusRegions.map((x) => (
              <Link
                href={"/diaspora/" + focusRegionPages[x]}
                key={x}
                className="rounded-xl border border-[var(--border)] p-5 transition hover:border-[var(--border-emphasis)]"
              >
                <strong className={`${display} text-xl`}>{x}</strong>
                <p className="mt-3 text-xs text-[var(--text-meta)]">
                  Explore Builders →
                </p>
              </Link>
            ))}
          </div>
        </section>
        <section className={`${shell} pb-20`}>
          <SectionTitle link="/builders">Diaspora builders</SectionTitle>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {builders.slice(0, 4).map((b) => (
              <BuilderTile key={b.slug} b={b} />
            ))}
          </div>
        </section>
        <NominateBand />
      </main>
    </>
  );
}

export function DiasporaRegionScreen() {
  const router = useRouter();
  const region =
    diasporaRegions[String(router.query.region)]?.label || "Australia";
  const live = usePublicData();
  const builders = live?.builders ?? fixtureBuilders;
  const opportunities = live?.opportunities ?? fixtureOpportunities;
  const [city, setCity] = useState("All cities");
  const filtered =
    city === "All cities"
      ? builders
      : builders.filter((builder) => builder.location.includes(city));
  return (
    <>
      <Meta title={region + " · Diaspora"} />
      <PageHero
        title={city === "All cities" ? region : city}
        crumbs={["Diaspora", region]}
      >
        <p>
          {filtered.length} Builders and {live?.stories.length || 0} stories
          from builders in {region}.
        </p>
      </PageHero>
      <main className={`${shell} py-10 pb-24`}>
        <div className="flex gap-2 overflow-x-auto pb-4">
          {[
            "All cities",
            ...Array.from(
              new Set(
                builders.map((builder) => builder.location.split(",")[0]!),
              ),
            ).filter(Boolean),
          ].map((x) => (
            <Chip key={x} active={city === x} onClick={() => setCity(x)}>
              {x}
            </Chip>
          ))}
        </div>
        <section className="mt-8">
          <SectionTitle>{`Builders in ${city === "All cities" ? region : city}`}</SectionTitle>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {filtered.map((b, i) => (
              <BuilderTile key={b.slug} b={b} />
            ))}
          </div>
        </section>
        <div className="mt-16 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <section>
            <SectionTitle>Latest stories</SectionTitle>
            <StoryRows />
          </section>
          <section>
            <SectionTitle>Opportunities</SectionTitle>
            {opportunities.map((o) => (
              <OpportunityMini key={o.slug} o={o} />
            ))}
          </section>
        </div>
      </main>
    </>
  );
}

function OpportunityMini({ o }: { o: (typeof opportunities)[number] }) {
  return (
    <Link
      href={`/opportunities/${o.slug}`}
      className="block border-t border-[var(--border)] py-5"
    >
      <span className="text-xs font-bold text-[var(--text-accent)]">
        {o.type}
      </span>
      <h3 className={`${display} mt-1 text-lg`}>{o.title}</h3>
      <p className="mt-2 text-xs text-[var(--text-meta)]">
        <MapPin size={13} className="inline" /> {o.location} ·{" "}
        {o.daysLeft === null
          ? "Rolling applications"
          : o.daysLeft + " days left"}
      </p>
    </Link>
  );
}

export function VideosScreen() {
  const r = useRouter();
  const live = usePublicData();
  const list = live?.videos || [];
  const [playing, setPlaying] = useState(false);
  const first = list[0];
  const formatLabel = videoFormats.find(
    (format) => format.value === r.query.format,
  )?.label;
  return (
    <>
      <Meta title="Videos" />
      <PageHero title={formatLabel || "Videos"}>
        <p>
          Conversations, field notes and explainers from people building
          Africa’s next decade.
        </p>
      </PageHero>
      <main>
        <nav
          aria-label="Video formats"
          className={shell + " flex flex-wrap gap-3 py-6"}
        >
          {[{ label: "All videos", value: "" }, ...videoFormats].map(
            ({ label, value }) => (
              <Link
                key={value}
                href={value ? "/videos?format=" + value : "/videos"}
                aria-current={
                  String(r.query.format || "") === value ? "page" : undefined
                }
                className={button + " border border-[var(--border)]"}
              >
                {label}
              </Link>
            ),
          )}
        </nav>
        {first ? (
          <>
            <section className={shell + " py-10 md:py-16"}>
              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-[var(--surface-inverse-deep)]">
                  {playing && first.embedUrl ? (
                    <iframe
                      title={first.title}
                      src={first.embedUrl}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 size-full"
                    />
                  ) : (
                    <button
                      aria-label={"Play " + first.title + " on YouTube"}
                      onClick={() => setPlaying(true)}
                      className="group relative size-full text-[var(--text-on-inverse)]"
                    >
                      {first.thumbnailUrl && (
                        <img
                          src={first.thumbnailUrl}
                          alt=""
                          className="absolute inset-0 size-full object-cover"
                        />
                      )}
                      <span className="absolute inset-0 grid place-items-center">
                        <i className="grid size-20 place-items-center rounded-full bg-[var(--accent)]">
                          <Play fill="white" />
                        </i>
                      </span>
                    </button>
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-accent)]">
                    Builder video
                  </span>
                  <h2 className={display + " mt-3 text-3xl"}>{first.title}</h2>
                  <p className="mt-4 text-sm text-[var(--text-meta)]">
                    {first.duration}
                  </p>
                  <a
                    href={webUrl(first.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={button + " mt-6 border border-[var(--border)]"}
                  >
                    Watch on YouTube <ExternalLink size={16} />
                  </a>
                  <p className="mt-4 text-xs leading-5 text-[var(--text-meta)]">
                    Playing loads YouTube’s embedded player and associated
                    services.{" "}
                    <Link href="/cookies" className="underline">
                      Cookie information
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </section>
            <section className={shell + " grid gap-6 py-10 md:grid-cols-3"}>
              {list.slice(1).map((v) => (
                <Link key={v.id} href={"/videos/" + v.id} className="block">
                  <div className="aspect-video overflow-hidden rounded-xl bg-[var(--surface-tint)]">
                    {v.thumbnailUrl && (
                      <img
                        src={v.thumbnailUrl}
                        alt=""
                        className="size-full object-cover"
                      />
                    )}
                  </div>
                  <h3 className={display + " mt-4 text-xl"}>{v.title}</h3>
                  <p className="mt-2 text-xs text-[var(--text-meta)]">
                    {v.duration}
                  </p>
                </Link>
              ))}
            </section>
          </>
        ) : (
          <Empty title="No videos here yet">
            New interviews and stories will appear here after publication.
          </Empty>
        )}
        <PublicPagination />
      </main>
    </>
  );
}

export function OpportunitiesScreen() {
  const router = useRouter();
  const live = usePublicData();
  const opportunities = live?.opportunities ?? fixtureOpportunities;
  const typeValue = String(router.query.type || "all");
  const type = typeValue.charAt(0).toUpperCase() + typeValue.slice(1);
  const loc = String(
    router.query.region ||
      (router.query.remote === "1" ? "Remote" : "Anywhere"),
  );
  const shown = live
    ? opportunities
    : opportunities.filter(
        (o) =>
          (type === "All" || o.type === type) &&
          (loc === "Anywhere" ||
            o.region === loc ||
            (o.remote && loc === "Remote")),
      );
  return (
    <>
      <Meta title="Opportunities" />
      <PageHero title="Opportunities">
        <p>
          Grants, fellowships, accelerators and jobs for African builders,
          checked by our editors and sorted by closing date.
        </p>
      </PageHero>
      <main className={`${shell} py-8 pb-24`}>
        <div className="flex gap-2 overflow-x-auto pb-5">
          {["All", "Job", "Grant", "Fellowship", "Accelerator"].map((x) => (
            <Chip
              key={x}
              active={type === x}
              onClick={() => {
                void router.push({
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    page: 1,
                    type: x === "All" ? undefined : x.toLowerCase(),
                  },
                });
              }}
            >
              {x}
            </Chip>
          ))}
        </div>
        <div className="grid gap-3 border-b border-[var(--border)] pb-5 md:grid-cols-3">
          <label className="text-xs font-semibold">
            Location
            <select
              value={loc}
              onChange={(event) => {
                void router.push({
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    page: 1,
                    remote: event.target.value === "Remote" ? 1 : undefined,
                    region: ["Anywhere", "Remote"].includes(event.target.value)
                      ? undefined
                      : event.target.value,
                  },
                });
              }}
              className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] px-3"
            >
              <option>Anywhere</option>
              <option>Remote</option>
              <option>Nigeria</option>
              <option>Australia</option>
              <option>Africa</option>
            </select>
          </label>
          <label className="text-xs font-semibold">
            Deadline
            <select
              value={String(router.query.deadlineDays || "")}
              onChange={(event) =>
                void router.push({
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    page: 1,
                    deadlineDays: event.target.value || undefined,
                  },
                })
              }
              className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] px-3"
            >
              <option value="">Open now</option>
              <option value="7">Closing within 7 days</option>
              <option value="30">Closing within 30 days</option>
            </select>
          </label>
          <label className="text-xs font-semibold">
            Sort
            <select className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] px-3">
              <option>Closing soonest</option>
            </select>
          </label>
        </div>
        <p className="py-5 text-xs text-[var(--text-meta)]">
          {shown.length} open
        </p>
        {shown.length ? (
          shown.map((o) => (
            <div
              key={o.slug}
              className="grid gap-4 border-t border-[var(--border)] py-6 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <div className="flex gap-2 text-xs font-semibold text-[var(--text-meta)]">
                  <span>{o.org}</span>
                  <span className="rounded bg-[var(--surface-tint)] px-2">
                    {o.type}
                  </span>
                </div>
                <Link href={`/opportunities/${o.slug}`}>
                  <h2 className={`${display} mt-2 text-xl`}>{o.title}</h2>
                </Link>
                <p className="mt-2 text-sm text-[var(--text-meta)]">
                  <MapPin size={14} className="inline" /> {o.location}
                </p>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${o.daysLeft !== null && o.daysLeft <= 7 ? "bg-[var(--surface-accent-soft)] text-[var(--text-accent)]" : "bg-[var(--surface-tint)]"}`}
                >
                  {o.daysLeft === null
                    ? "Rolling applications"
                    : o.daysLeft + " days left"}
                </span>
                <Link
                  className={`${button} border border-[var(--border)]`}
                  href={`/opportunities/${o.slug}`}
                >
                  View details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <Empty
            title="No open opportunities match"
            action={
              <button
                className={`${button} border border-[var(--border)]`}
                onClick={() => {
                  void router.push(router.pathname);
                }}
              >
                Clear filters
              </button>
            }
          >
            Try a different type, location or deadline.
          </Empty>
        )}
        <PublicPagination />
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[var(--surface-tint)] p-6">
          <div>
            <h2 className={`${display} text-lg`}>
              Running a programme for African builders?
            </h2>
            <p className="text-sm">
              Listings are free for non-profits and public programmes.
            </p>
          </div>
          <Link
            href="/account?state=submit"
            className={`${button} bg-[var(--surface-inverse)] text-[var(--text-on-inverse)]`}
          >
            Submit an opportunity
          </Link>
        </div>
      </main>
    </>
  );
}

export function OpportunityDetailScreen() {
  const data = usePublicData();
  const o = data?.opportunities[0];
  if (!o)
    return (
      <Empty title="Opportunity unavailable">
        This opportunity is no longer available.
      </Empty>
    );
  const url = webUrl(o.applyUrl);
  return (
    <>
      <Meta title={o.title} />
      <main>
        <div className={shell + " py-8 md:py-14"}>
          <Crumbs items={["Opportunities", o.type]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
            <article>
              <span className="rounded-full bg-[var(--surface-tint)] px-3 py-1 text-xs font-bold">
                {o.type}
              </span>
              <h1
                className={
                  display + " mt-4 max-w-4xl text-4xl leading-tight md:text-5xl"
                }
              >
                {o.title}
              </h1>
              <p className="mt-4 text-[var(--text-meta)]">
                Organised by {o.organisation} · {o.location}
              </p>
              <div className="mt-10 space-y-10 whitespace-pre-line font-serif text-lg leading-8">
                <p>{o.description}</p>
                {o.eligibility && (
                  <section>
                    <h2 className={display + " mb-4 text-2xl"}>
                      Who should apply
                    </h2>
                    <p>{o.eligibility}</p>
                  </section>
                )}
                <aside className="rounded-xl bg-[var(--surface-tint)] p-6 font-ui text-sm leading-6">
                  <strong>Editor’s note.</strong> Always confirm dates and
                  eligibility on the organiser’s site before applying.
                </aside>
              </div>
            </article>
            <aside className="h-fit rounded-xl border border-[var(--border)] p-6 lg:sticky lg:top-24">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-meta)]">
                {o.deadline ? "Closes " + o.deadline : "Open application"}
              </p>
              <p className={display + " mt-2 text-2xl"}>
                {o.deadline ? o.daysLeft + " days left" : "No deadline listed"}
              </p>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    button +
                    " mt-6 w-full bg-[var(--accent)] text-[var(--text-on-inverse)]"
                  }
                >
                  Apply on organiser’s site <ExternalLink size={16} />
                </a>
              )}
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

export function SearchScreen() {
  const live = usePublicData();
  const builders = live?.builders ?? fixtureBuilders;
  const startups = live?.startups ?? fixtureStartups;
  const opportunities = live?.opportunities ?? fixtureOpportunities;
  const r = useRouter(),
    state = String(r.query.state || "default");
  const initial =
    state === "none"
      ? "blockchian farming"
      : state === "short"
        ? "AI"
        : String(r.query.q || "");
  const [draft, setDraft] = useState(initial),
    [query, setQuery] = useState(initial),
    [tab, setTab] = useState("All");
  const hits = useMemo(() => {
    const q = query.toLowerCase();
    return {
      Builders: builders.filter((x) =>
        (x.name + " " + x.headline)
          .toLowerCase()
          .includes(q.split(" ")[0] ?? ""),
      ),
      Startups: startups.filter((x) =>
        (x.name + " " + x.oneLiner)
          .toLowerCase()
          .includes(q.split(" ")[0] ?? ""),
      ),
      Opportunities: opportunities.filter((x) =>
        (x.title + " " + x.org).toLowerCase().includes(q.split(" ")[0] ?? ""),
      ),
    };
  }, [query, builders, startups, opportunities]);
  const total =
    Object.values(hits).reduce((n, x) => n + x.length, 0) +
    (live?.stories.length || 0);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setQuery(draft);
    void r.push({ pathname: "/search", query: { q: draft } });
  };
  return (
    <>
      <Meta title="Search" />
      <main className={`${shell} py-8 pb-24`}>
        <header className="max-w-[720px]">
          <form
            onSubmit={submit}
            role="search"
            className="flex rounded-xl border-2 border-[var(--border-emphasis)] p-1"
          >
            <Search className="ml-3 mt-3" size={19} />
            <input
              aria-label="Search The Builder"
              className="h-11 flex-1 px-3 outline-none"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button
              className={`${button} bg-[var(--surface-inverse)] text-[var(--text-on-inverse)]`}
            >
              Search
            </button>
          </form>
          <h1 className={`${display} mt-5 text-2xl`}>
            {state === "loading"
              ? `Searching for “${query}”…`
              : `Results for “${query}” — ${total} results`}
          </h1>
          {state === "short" && (
            <p className="mt-3 rounded-lg bg-[var(--surface-tint)] p-4 text-sm">
              Short searches match many things. Add another word to narrow it.
            </p>
          )}
        </header>
        <div className="mt-8 flex gap-2 overflow-x-auto">
          {["All", "Stories", "Builders", "Startups", "Opportunities"].map(
            (x) => (
              <Chip key={x} active={tab === x} onClick={() => setTab(x)}>
                {x}
              </Chip>
            ),
          )}
        </div>
        {state === "loading" ? (
          <div className="mt-10">
            <SkeletonGrid count={4} />
          </div>
        ) : total === 0 ? (
          <Empty
            title="Nothing matched that search"
            action={
              <Link
                href="/nominate"
                className={`${button} bg-[var(--surface-inverse)] text-[var(--text-on-inverse)]`}
              >
                Nominate someone
              </Link>
            }
          >
            Check the spelling, use fewer words, or try Diaspora, Fintech,
            Melbourne, Grants or AgriTech.
          </Empty>
        ) : (
          <div className="mt-10 space-y-12">
            {(tab === "All" || tab === "Stories") && !!live?.stories.length && (
              <section>
                <SectionTitle>Stories</SectionTitle>
                <StoryRows />
              </section>
            )}
            {(tab === "All" || tab === "Builders") &&
              hits.Builders.length > 0 && (
                <section>
                  <SectionTitle>Builders</SectionTitle>
                  <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
                    {hits.Builders.map((b) => (
                      <BuilderTile key={b.slug} b={b} />
                    ))}
                  </div>
                </section>
              )}
            {(tab === "All" || tab === "Startups") &&
              hits.Startups.length > 0 && (
                <section>
                  <SectionTitle>Startups</SectionTitle>
                  <div className="grid gap-5 md:grid-cols-2">
                    {hits.Startups.map((s) => (
                      <StartupTile key={s.slug} s={s} />
                    ))}
                  </div>
                </section>
              )}
            {(tab === "All" || tab === "Opportunities") &&
              hits.Opportunities.length > 0 && (
                <section>
                  <SectionTitle>Opportunities</SectionTitle>
                  {hits.Opportunities.map((o) => (
                    <OpportunityMini key={o.slug} o={o} />
                  ))}
                </section>
              )}
          </div>
        )}
      </main>
    </>
  );
}

export function NewsletterScreen() {
  const r = useRouter();
  const token = typeof r.query.token === "string" ? r.query.token : "";
  const action = r.query.action === "unsubscribe" ? "unsubscribe" : "confirm";
  const [done, setDone] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit() {
    setBusy(true);
    setError("");
    try {
      if (action === "unsubscribe") await publicApi.unsubscribe(token);
      else await publicApi.confirmSubscription(token);
      setDone(true);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Meta title="The Builder Newsletter" />
      <main className="grid min-h-[65vh] place-items-center bg-[var(--surface-tint)] px-4 py-16">
        <section className="w-full max-w-2xl rounded-xl bg-[var(--surface-card)] p-8 text-center shadow-card md:p-14">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--surface-inverse)] text-[var(--text-on-inverse)]">
            <Check />
          </span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[.12em] text-[var(--text-accent)]">
            The Builder Newsletter
          </p>
          <h1 className={display + " mt-3 text-4xl"}>
            {done
              ? action === "unsubscribe"
                ? "You’re unsubscribed"
                : "You’re in"
              : token
                ? action === "unsubscribe"
                  ? "Unsubscribe from the newsletter"
                  : "Confirm your subscription"
                : "The Builder Newsletter"}
          </h1>
          <p className="mx-auto mt-4 max-w-lg leading-7 text-[var(--text-meta)]">
            {done
              ? action === "unsubscribe"
                ? "Your newsletter subscription has been stopped."
                : "Your subscription is confirmed. Check your inbox for the welcome email."
              : token
                ? "Continue to update your subscription."
                : "Stories, people and opportunities shaping Africa and its diaspora."}
          </p>
          {error && (
            <p role="alert" className="mt-4 text-sm text-[var(--text-error)]">
              {error}
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {!done &&
              (token ? (
                <button
                  disabled={busy}
                  onClick={submit}
                  className={
                    button + " bg-[var(--accent)] text-[var(--text-on-inverse)]"
                  }
                >
                  {busy ? (
                    <LoadingDots />
                  ) : action === "unsubscribe" ? (
                    "Confirm unsubscribe"
                  ) : (
                    "Confirm subscription"
                  )}
                </button>
              ) : (
                <NewsletterForm />
              ))}
            <Link
              href="/"
              className={button + " border border-[var(--border)]"}
            >
              Back to The Builder
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

export function AboutScreen() {
  const { edition } = useEdition();
  const publisher = publisherForEdition(edition);
  return (
    <>
      <Meta title="About" />
      <main>
        <section className="bg-[var(--surface-inverse)] py-16 text-[var(--text-on-inverse)] md:py-24">
          <div className={shell}>
            <h1 className="max-w-5xl font-display text-5xl font-extrabold leading-[1.04] md:text-7xl">
              We tell the stories of people building the next decade
            </h1>
          </div>
        </section>
        <section
          className={`${shell} grid gap-12 py-16 md:grid-cols-12 md:py-24`}
        >
          <div className="md:col-span-4">
            <p className="text-xs font-bold uppercase tracking-[.12em] text-[var(--text-accent)]">
              Our mission
            </p>
          </div>
          <div className="space-y-6 font-serif text-xl leading-9 md:col-span-7">
            The Builder documents African entrepreneurs, startups, professionals
            and diaspora builders with the care of long-form journalism. We
            publish from Lagos and Melbourne, and measure ourselves by whether
            people can do more because of it.
          </div>
        </section>
        <section className="bg-[var(--surface-tint)] py-16">
          <div className={`${shell} grid items-center gap-10 md:grid-cols-2`}>
            <div className="grid aspect-video place-items-center rounded-xl bg-[var(--surface-card)] font-display text-3xl font-extrabold text-[var(--text-heading)]">
              {editionCredit(edition)}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-accent)]">
                Powered by {editionCredit(edition)}
              </p>
              <h2 className={`${display} mt-3 text-3xl`}>
                Digitizing the next decade
              </h2>
              <p className="mt-5 leading-7">
                The Builder is an editorially independent publication supported
                by {editionCredit(edition)}.
              </p>
            </div>
          </div>
        </section>
        <section
          id="team"
          className={`${shell} grid scroll-mt-24 gap-6 py-16 md:grid-cols-3`}
        >
          <div id="advertise" className="scroll-mt-24">
            <h2 className={`${display} text-2xl`}>
              Partner or advertise with us
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-meta)]">
              Reach founders, operators and investors across Nigeria, Australia
              and the diaspora.
            </p>
          </div>
          <div id="contact" className="scroll-mt-24">
            <h2 className={`${display} text-2xl`}>
              Story tips and corrections
            </h2>
            {publisher.contactEmail ? (
              <a
                className="mt-3 block text-[var(--text-accent)]"
                href={"mailto:" + publisher.contactEmail}
              >
                {publisher.contactEmail}
              </a>
            ) : (
              <p className="mt-3 text-sm text-[var(--text-meta)]">
                Editorial contact information will be published here.
              </p>
            )}
          </div>
          <div>
            <h2 className={`${display} text-2xl`}>Our offices</h2>
            <p className="mt-3 text-sm leading-6">
              {publisher.office || "Office details will be published here."}
            </p>
          </div>
        </section>
        <section
          id="standards"
          className={`${shell} scroll-mt-24 border-t border-[var(--border)] py-14`}
        >
          <h2 className={`${display} text-3xl`}>Editorial standards</h2>
          <p className="mt-3 text-[var(--text-meta)]">
            Contact the editorial team for questions about corrections,
            attribution or publication.
          </p>
          <Link
            id="sponsored"
            href="/sponsored-content-policy"
            className="mt-4 inline-block text-[var(--text-accent)] underline"
          >
            Sponsored Content Policy
          </Link>
        </section>
        <section
          id="careers"
          className="scroll-mt-24 border-t border-[var(--border)] bg-[var(--surface-card)] py-14"
        >
          <div className={shell}>
            <h2 className={`${display} text-3xl`}>Build with us</h2>
            <p className="mt-3 max-w-2xl text-[var(--text-meta)]">
              Open editorial and product roles will be published here.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

const events = [
  [
    "14",
    "Nov",
    "Summit",
    "Osun Tech Exchange 3.0: Digitizing the Next Decade",
    "Osogbo, NG",
  ],
  [
    "21",
    "Oct",
    "Masterclass",
    "Blue Nile Business Masterclass: Pricing and cash flow",
    "Melbourne, AU",
  ],
  [
    "29",
    "Oct",
    "Online",
    "The Builder Live: Raising from diaspora angels",
    "Online",
  ],
  [
    "06",
    "Nov",
    "Meet-up",
    "Lagos founders’ breakfast: hiring your first ten",
    "Yaba, Lagos",
  ],
  [
    "03",
    "Dec",
    "Meet-up",
    "African-Australian builders’ end-of-year gathering",
    "Footscray, Melbourne",
  ],
] as const;
export function EventsScreen() {
  return (
    <>
      <Meta title="Events" />
      <PageHero title="Events">
        <p>Summits, masterclasses and meet-ups where builders gather.</p>
      </PageHero>
      <main className={shell + " py-10 pb-24"}>
        <Empty title="Events are coming soon">
          Editorial event discovery is planned for a later release.
        </Empty>
      </main>
    </>
  );
}

function StoryRows() {
  const live = usePublicData();
  return (
    <div>
      {live?.stories.map((story) => (
        <Link
          key={story.id || story.slug}
          href={"/stories/" + story.slug}
          className="grid grid-cols-[96px_1fr] gap-4 border-t border-[var(--border)] py-5 md:grid-cols-[180px_1fr]"
        >
          <Media label="Story" ratio="aspect-[4/3]" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-accent)]">
              {story.kicker}
            </span>
            <h3 className={display + " mt-2 text-lg"}>{story.title}</h3>
            <p className="mt-2 text-xs text-[var(--text-meta)]">
              {story.readTime}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
