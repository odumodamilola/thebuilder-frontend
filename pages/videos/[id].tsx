import { usePublicData } from "@/context/PublicDataContext";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft, Play } from "lucide-react";

const videoTitles: Record<string, string> = {
  "vid-1": "The Future of African Fintech",
};

export default function VideoDetailPage() {
  const video = usePublicData()?.videos[0];
  const [playing, setPlaying] = useState(false);
  const router = useRouter();
  const id = String(router.query.id ?? "vid-1");
  const title = video?.title || videoTitles[id] || "Builder conversation";

  return (
    <>
      <Head>
        <title>{title} · The Builder</title>
      </Head>
      <main className="bg-[var(--surface-inverse-deep)] text-[var(--text-on-inverse)]">
        <div className="mx-auto max-w-container px-4 py-10 md:px-6 md:py-16">
          <Link
            href="/videos"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--text-meta-on-inverse)] hover:text-[var(--text-on-inverse)]"
          >
            <ArrowLeft size={16} />
            All videos
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-center">
            <div className="relative aspect-video">
              {playing && video?.embedUrl ? (
                <iframe
                  src={video.embedUrl}
                  title={title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 size-full rounded-xl"
                />
              ) : (
                <button
                  onClick={() => setPlaying(true)}
                  type="button"
                  aria-label={`Play ${title}`}
                  className="group relative aspect-video overflow-hidden rounded-xl bg-[var(--surface-inverse)] ring-1 ring-[color:color-mix(in_srgb,var(--text-on-inverse)_15%,transparent)]"
                >
                  {video?.thumbnailUrl && (
                    <img
                      src={video.thumbnailUrl}
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                    />
                  )}
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid size-20 place-items-center rounded-full bg-[var(--accent)] transition-transform group-hover:scale-105">
                      <Play aria-hidden fill="currentColor" />
                    </span>
                  </span>
                </button>
              )}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--text-accent)]">
                Builder video
              </p>
              <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight md:text-5xl">
                {title}
              </h1>
              <p className="mt-5 leading-7 text-[var(--text-meta-on-inverse)]">
                {video?.title}
              </p>
              <p className="mt-5 text-sm text-[var(--text-meta)]">
                {video?.duration} ·{" "}
                {video?.date
                  ? new Date(video.date).toLocaleDateString("en-GB")
                  : ""}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

import { publicPageProps } from "@/lib/public-ssr";
export const getServerSideProps = publicPageProps("/videos/[id]");
