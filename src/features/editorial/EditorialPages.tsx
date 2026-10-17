"use client";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { publicationDate } from "@/lib/dates";
import { usePublicData } from "@/context/PublicDataContext";
import { useSession } from "@/context/SessionContext";
import { useEdition } from "@/context/EditionContext";
import { storyCategories } from "@/lib/editorial-policy";
import { CookieChoices } from "@/components/ui/CookieConsent";
import { useRouter } from "next/router";
import { http } from "@/lib/http";
import { PublicPagination } from "@/components/ui/Pagination";
import { useBookmark } from "@/hooks/useBookmark";
import { trackArticle } from "@/lib/analytics";
import { useToast } from "@/context/ToastContext";
import Head from "next/head";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Clock,
  MessageCircle,
  RotateCcw,
  Share2,
  WifiOff,
} from "lucide-react";
import { stories as fixtureStories } from "@/data/stories";
const stories = fixtureStories;

export type PageState =
  | "default"
  | "loading"
  | "empty"
  | "error"
  | "subcategory"
  | "empty-tab"
  | "sponsored"
  | "comments-soon"
  | "404";

const imageFor = (index: number) =>
  stories[index % stories.length]?.image || "/images/haftu_strintzos.jpg";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-bold uppercase tracking-[.14em] text-[var(--text-accent)]">
      {children}
    </p>
  );
}

function Loader() {
  return (
    <div className="mx-auto grid max-w-container animate-pulse grid-cols-1 gap-7 px-4 py-16 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[3/2] rounded-lg bg-[var(--surface-tint)]" />
          <div className="mt-5 h-3 w-24 bg-[var(--surface-skeleton)]" />
          <div className="mt-3 h-7 bg-[var(--surface-skeleton)]" />
          <div className="mt-2 h-7 w-4/5 bg-[var(--surface-skeleton)]" />
        </div>
      ))}
    </div>
  );
}

function StoryTile({
  story,
  index = 0,
  featured = false,
}: {
  story: (typeof stories)[number];
  index?: number;
  featured?: boolean;
}) {
  return (
    <article
      className={`group ${featured ? "md:grid md:grid-cols-2 md:items-stretch md:gap-10" : ""}`}
    >
      <Link
        href={`/stories/${story.slug}`}
        className="block overflow-hidden rounded-lg bg-[var(--surface-tint)]"
      >
        {story.imageUrl || story.image ? (
          <img
            src={story.imageUrl || story.image}
            alt={story.imageAlt || story.title}
            className={`w-full object-cover transition duration-500 group-hover:scale-[1.03] ${featured ? "aspect-[16/10] h-full" : "aspect-[3/2]"}`}
          />
        ) : (
          <div className="aspect-[3/2]">
            <PlaceholderImage />
          </div>
        )}
      </Link>
      <div className={featured ? "flex flex-col justify-center py-6" : "pt-5"}>
        <Eyebrow>{story.kicker}</Eyebrow>
        <h2
          className={`${featured ? "text-3xl md:text-[42px] md:leading-[1.08]" : "text-[22px] leading-[1.25]"} font-display font-extrabold tracking-tight text-[var(--text-heading)]`}
        >
          <Link
            href={`/stories/${story.slug}`}
            className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] bg-[length:0_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_2px]"
          >
            {story.title}
          </Link>
        </h2>
        <p className="mt-3 line-clamp-2 text-[16px] leading-7 text-[var(--text-meta)]">
          {story.summary}
        </p>
        <p className="mt-5 text-[13px] text-[var(--text-meta)]">
          <strong className="text-[var(--text-heading)]">{story.author}</strong>{" "}
          · {publicationDate(story.date)} · {story.readTime}
        </p>
      </div>
    </article>
  );
}

export function StoriesPage({ state = "default" }: { state?: PageState }) {
  const { edition } = useEdition();
  const filters = ["All stories", ...storyCategories(edition)];
  const live = usePublicData();
  const stories = live?.stories ?? fixtureStories;
  const router = useRouter();
  const [active, setActive] = useState(
    filters.find(
      (x) => x.toLowerCase().replaceAll(" ", "-") === router.query.category,
    ) || "All stories",
  );
  const [visible, setVisible] = useState(6);
  const shown = useMemo(
    () =>
      live || active === "All stories"
        ? stories
        : stories.filter(
            (s) => s.kicker.toLowerCase() === active.toLowerCase(),
          ),
    [active, stories, live],
  );
  if (state === "loading") return <Loader />;
  return (
    <main>
      <section className="border-b border-[var(--border)] bg-[var(--surface-inverse-deep)] py-14 text-[var(--text-on-inverse)] md:py-20">
        <div className="mx-auto max-w-container px-4 md:px-6">
          <Eyebrow>Ideas · people · progress</Eyebrow>
          <h1 className="font-display text-[40px] font-extrabold leading-none tracking-[-.03em] md:text-7xl">
            Stories
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-meta-on-inverse)]">
            Reporting on the people, businesses and ideas building Africa and
            its global diaspora.
          </p>
        </div>
      </section>
      <nav
        aria-label="Story filters"
        className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface-card)_95%,transparent)] backdrop-blur"
      >
        <div className="mx-auto flex max-w-container gap-2 overflow-x-auto px-4 py-4 md:px-6">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActive(filter);
                if (live)
                  void router.push({
                    pathname: "/stories",
                    query:
                      filter === "All stories"
                        ? {}
                        : {
                            category: filter.toLowerCase().replaceAll(" ", "-"),
                          },
                  });
              }}
              className={`min-h-11 whitespace-nowrap rounded-full border px-5 text-sm font-semibold ${active === filter ? "border-[var(--border-emphasis)] bg-[var(--surface-inverse)] text-[var(--text-on-inverse)]" : "border-[var(--border)] text-[var(--text-heading)] hover:border-[var(--border-emphasis)]"}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </nav>
      {state === "error" ? (
        <StatePanel
          title="We couldn’t load the stories"
          copy="Check your connection and try again."
          action="Try again"
        />
      ) : state === "empty" || shown.length === 0 ? (
        <StatePanel
          title="No stories here yet"
          copy="Fresh reporting is on the way. Explore all stories in the meantime."
          action="View all stories"
        />
      ) : (
        <section className="mx-auto max-w-container px-4 py-14 md:px-6 md:py-20">
          <StoryTile story={shown[0]!} featured />
          <div className="my-14 h-px bg-[var(--border)]" />
          <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {shown.slice(1, visible).map((story, i) => (
              <StoryTile key={story.slug} story={story} index={i + 1} />
            ))}
          </div>
          {visible < shown.length && (
            <div className="mt-14 text-center">
              <button
                onClick={() => setVisible((v) => v + 6)}
                className="min-h-12 rounded-lg bg-[var(--surface-inverse)] px-7 font-bold text-[var(--text-on-inverse)] hover:bg-[var(--primary-hover)]"
              >
                Load more stories
              </button>
            </div>
          )}
        </section>
      )}
      {live?.meta && live.meta.last_page > 1 && (
        <nav
          aria-label="Pagination"
          className="mx-auto flex max-w-container justify-center gap-4 px-4 pb-12"
        >
          {live.meta.current_page > 1 && (
            <Link
              href={{
                pathname: router.pathname,
                query: { ...router.query, page: live.meta.current_page - 1 },
              }}
            >
              Previous
            </Link>
          )}
          <span>
            Page {live.meta.current_page} of {live.meta.last_page}
          </span>
          {live.meta.current_page < live.meta.last_page && (
            <Link
              href={{
                pathname: router.pathname,
                query: { ...router.query, page: live.meta.current_page + 1 },
              }}
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}

export function CategoryPage({ state = "default" }: { state?: PageState }) {
  const live = usePublicData();
  const stories = live?.stories ?? fixtureStories;
  const router = useRouter();
  const category = live?.category?.name || "Fintech";
  const tags = Array.from(
    new Map(
      stories
        .flatMap((story) => story.tags || [])
        .map((tag) => [tag.slug, tag]),
    ).values(),
  );
  return (
    <main>
      <section className="bg-[var(--surface-tint)] py-14 md:py-20">
        <div className="mx-auto max-w-container px-4 md:px-6">
          <p className="text-sm font-semibold text-[var(--text-meta)]">
            <Link href="/stories">Stories</Link> / Industries
          </p>
          <Eyebrow>Industry</Eyebrow>
          <h1 className="font-display text-[40px] font-extrabold leading-none text-[var(--text-heading)] md:text-7xl">
            {category}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-meta)]">
            {live?.category?.description ||
              "The products, policies and founders shaping this industry."}
          </p>
        </div>
      </section>
      <div className="border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-container gap-7 overflow-x-auto px-4 md:px-6">
          {[{ name: "Latest", slug: "" }, ...tags].map((tag) => (
            <Link
              key={tag.slug}
              href={{
                pathname: router.pathname,
                query: {
                  slug: router.query.slug,
                  ...(tag.slug ? { tag: tag.slug } : {}),
                },
              }}
              className={
                "inline-flex min-h-14 items-center whitespace-nowrap border-b-2 text-sm font-bold " +
                (String(router.query.tag || "") === tag.slug
                  ? "border-[var(--accent)] text-[var(--text-heading)]"
                  : "border-transparent text-[var(--text-meta)]")
              }
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
      {stories.length === 0 ? (
        <StatePanel
          title="No stories here yet"
          copy="Our newsroom is following this beat. Check back soon."
          action="Browse stories"
        />
      ) : (
        <section className="mx-auto max-w-container px-4 py-14 md:px-6 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <StoryTile story={stories[0]!} featured />
            <aside className="border-t-4 border-[var(--border-emphasis)] pt-5">
              <h2 className="font-display text-xl font-extrabold text-[var(--text-heading)]">
                Most read in {category}
              </h2>
              {(live?.popular || stories.slice(1, 4)).map((story, i) => (
                <Link
                  href={"/stories/" + story.slug}
                  key={story.slug}
                  className="grid grid-cols-[32px_1fr] gap-3 border-b border-[var(--border)] py-5"
                >
                  <span className="font-display text-2xl font-extrabold text-[var(--text-accent)]">
                    {i + 1}
                  </span>
                  <span className="font-display font-bold leading-5 text-[var(--text-heading)]">
                    {story.title}
                  </span>
                </Link>
              ))}
            </aside>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {stories.slice(1).map((story, i) => (
              <StoryTile story={story} index={i} key={story.slug} />
            ))}
          </div>
          <PublicPagination />
        </section>
      )}
    </main>
  );
}

export function ArticlePage({ state = "default" }: { state?: PageState }) {
  const live = usePublicData();
  const { user } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const article = live?.article;
  const story =
    article ||
    (!live
      ? fixtureStories.find((s) => s.slug === router.query.slug)
      : undefined);
  const { saved, busy, toggle: save } = useBookmark(story?.id);
  useEffect(() => {
    if (!story?.id) return;
    void trackArticle(story.id, "view");
    if (user?.emailVerified)
      void http("/me/recent/" + story.id, { method: "PUT" }).catch(() => {});
  }, [story?.id, user?.id, user?.emailVerified]);
  if (state === "loading") return <Loader />;
  if (!story || state === "404") return <SystemPage kind="404" />;
  const share = async () => {
    try {
      if (navigator.share)
        await navigator.share({
          title: story.title,
          url: window.location.href,
        });
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast("Link copied");
      }
      if (story.id) void trackArticle(story.id, "share");
    } catch (e) {
      if (!(e instanceof Error && e.name === "AbortError"))
        toast("Could not share this story.");
    }
  };
  return (
    <main>
      <Head>
        <title>{story.seo?.title || story.title} · The Builder</title>
        <meta
          name="description"
          content={story.seo?.description || story.summary}
        />
        <link
          rel="canonical"
          href={
            story.seo?.canonical ||
            (process.env.NEXT_PUBLIC_APP_URL || "https://thebuilderng.com") +
              "/stories/" +
              story.slug
          }
        />
        <meta property="og:title" content={story.title} />
        <meta property="og:description" content={story.summary} />
        {story.imageUrl && (
          <meta property="og:image" content={story.imageUrl} />
        )}
      </Head>
      <article>
        <header className="mx-auto max-w-[900px] px-4 pb-10 pt-14 text-center md:px-6 md:pb-14 md:pt-20">
          {story.isSponsored && (
            <span className="mb-5 inline-flex rounded-full bg-[var(--surface-accent-soft)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--text-error)]">
              Sponsored
            </span>
          )}
          <Eyebrow>{story.kicker}</Eyebrow>
          <h1 className="font-display text-[36px] font-extrabold leading-[1.08] tracking-[-.03em] text-[var(--text-heading)] md:text-[64px]">
            {story.title}
          </h1>
          <p className="mx-auto mt-6 max-w-[760px] font-serif text-xl leading-8 text-[var(--text-meta)] md:text-2xl">
            {story.summary}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-sm text-[var(--text-meta)]">
            <strong className="text-[var(--text-heading)]">
              {story.author}
            </strong>
            <span>·</span>
            <time dateTime={story.date}>
              {story.date
                ? new Date(story.date).toLocaleDateString("en-GB", {
                    timeZone: "Africa/Lagos",
                  })
                : ""}
            </time>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={15} />
              {story.readTime}
            </span>
          </div>
        </header>
        {(story.imageUrl || story.image) && (
          <figure className="mx-auto max-w-[1040px] px-4 md:px-6">
            <img
              src={story.imageUrl || story.image}
              alt={story.imageAlt || story.title}
              className="aspect-[16/9] w-full rounded-lg object-cover"
            />
          </figure>
        )}
        <div className="mx-auto grid max-w-[880px] gap-8 px-4 py-12 md:grid-cols-[52px_1fr] md:px-6 md:py-16">
          <aside className="flex gap-2 md:flex-col">
            <button
              onClick={share}
              aria-label="Share article"
              className="grid size-11 place-items-center rounded-full border border-[var(--border)] text-[var(--text-heading)]"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={save}
              disabled={busy}
              aria-label="Save article"
              aria-pressed={saved}
              className={
                saved
                  ? "grid size-11 place-items-center rounded-full border border-[var(--accent)] bg-[var(--accent)] text-[var(--text-on-inverse)]"
                  : "grid size-11 place-items-center rounded-full border border-[var(--border)] text-[var(--text-heading)]"
              }
            >
              <Bookmark size={18} />
            </button>
          </aside>
          <div
            className="article-copy font-serif text-[19px] leading-8 text-[var(--text-body)]"
            dangerouslySetInnerHTML={{ __html: story.body || "" }}
          />
        </div>
      </article>
      {(live?.stories.length || 0) > 0 && (
        <section className="border-t border-[var(--border)] bg-[var(--surface-tint)] py-14">
          <div className="mx-auto max-w-container px-4 md:px-6">
            <h2 className="font-display text-3xl font-extrabold text-[var(--text-heading)]">
              More stories
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {live!.stories.map((s, i) => (
                <StoryTile story={s} index={i} key={s.slug} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function StatePanel({
  title,
  copy,
  action,
}: {
  title: string;
  copy: string;
  action: string;
}) {
  return (
    <section className="mx-auto flex min-h-[430px] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 h-1 w-12 bg-[var(--accent)]" />
      <h2 className="font-display text-3xl font-extrabold text-[var(--text-heading)]">
        {title}
      </h2>
      <p className="mt-3 text-[var(--text-meta)]">{copy}</p>
      <Link
        href="/stories"
        className="mt-7 inline-flex min-h-12 items-center rounded-lg bg-[var(--surface-inverse)] px-6 font-bold text-[var(--text-on-inverse)]"
      >
        {action}
      </Link>
    </section>
  );
}

export type SystemKind =
  "404" | "500" | "maintenance" | "offline" | "cookie" | "tooltip";
const systemCopy: Record<
  SystemKind,
  { code: string; title: string; copy: string }
> = {
  "404": {
    code: "404",
    title: "This page wandered off",
    copy: "The story or page you’re looking for may have moved, or never existed.",
  },
  "500": {
    code: "500",
    title: "Something went wrong",
    copy: "Our team has been notified. Give us a moment, then try again.",
  },
  maintenance: {
    code: "MAINTENANCE",
    title: "We’re making The Builder better",
    copy: "We’ll be back shortly with a faster, sharper experience.",
  },
  offline: {
    code: "OFFLINE",
    title: "You’re offline",
    copy: "Reconnect to the internet to continue exploring The Builder.",
  },
  cookie: {
    code: "YOUR CHOICE",
    title: "Cookies, on your terms",
    copy: "We use essential cookies to run the site and optional analytics to improve it.",
  },
  tooltip: {
    code: "DESIGN DETAIL",
    title: "Helpful context, right where it belongs",
    copy: "Hover or focus the underlined term below to reveal accessible supporting information.",
  },
};
export function SystemPage({ kind }: { kind: SystemKind }) {
  const c = systemCopy[kind];
  return (
    <main className="relative grid min-h-[72vh] place-items-center overflow-hidden bg-[var(--surface-inverse-deep)] px-4 py-20 text-[var(--text-on-inverse)]">
      <div
        aria-hidden
        className="absolute -right-24 -top-24 size-[420px] rounded-full border border-[color:color-mix(in_srgb,var(--text-on-inverse)_10%,transparent)]"
      />
      <div className="relative max-w-2xl text-center">
        <p className="text-xs font-bold tracking-[.18em] text-[var(--text-accent)]">
          {c.code}
        </p>
        {kind === "offline" && (
          <WifiOff className="mx-auto mt-7 size-12 text-[var(--text-meta-on-inverse)]" />
        )}
        <h1 className="mt-5 font-display text-[38px] font-extrabold leading-tight md:text-6xl">
          {c.title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[var(--text-meta-on-inverse)]">
          {c.copy}
        </p>
        {kind === "cookie" ? (
          <div className="mt-8">
            <CookieChoices />
            <Link href="/cookies" className="mt-5 inline-block underline">
              Read the cookie notice
            </Link>
          </div>
        ) : kind === "tooltip" ? (
          <p className="mt-9">
            A{" "}
            <button className="group relative border-b border-dashed border-[var(--text-on-inverse)] font-semibold">
              builder
              <span
                role="tooltip"
                className="invisible absolute bottom-8 left-1/2 w-56 -translate-x-1/2 rounded-lg bg-[var(--surface-card)] p-3 text-sm font-normal text-[var(--text-heading)] shadow-overlay group-hover:visible group-focus:visible"
              >
                A person turning an idea into lasting, useful change.
              </span>
            </button>{" "}
            changes what is possible.
          </p>
        ) : (
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-6 font-bold text-[var(--text-on-inverse)]"
            >
              <ArrowLeft size={17} />
              Back home
            </Link>
            <button
              onClick={() => location.reload()}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[color:color-mix(in_srgb,var(--text-on-inverse)_30%,transparent)] px-6 font-bold"
            >
              <RotateCcw size={17} />
              Try again
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
