"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Article } from "@/lib/types";
import PlaceholderImage from "../ui/PlaceholderImage";
import { useBookmark } from "@/hooks/useBookmark";
import { publicationDate } from "@/lib/dates";

export type CardVariant = "vertical" | "horizontal" | "lead" | "compact";

export interface StoryCardProps {
  article?: Article; // Use article prop for passing standard story object
  // Alternatively support individual props for flexibility
  kicker?: string;
  title?: string;
  summary?: string;
  author?: string;
  date?: string;
  readTime?: string;
  imageAlt?: string;
  imageUrl?: string;
  href?: string;
  variant?: CardVariant;
  layout?: CardVariant; // mapping layout to variant to avoid breaking existing code
  priority?: boolean;
  loading?: boolean;
  sponsored?: boolean;
  className?: string;
  editorial?: boolean;
}

const StoryCard = React.memo(function StoryCard({
  article,
  kicker,
  title,
  summary,
  author,
  date,
  readTime,
  imageAlt,
  imageUrl,
  href,
  variant,
  layout = "vertical",
  priority = false,
  loading = false,
  sponsored = false,
  className,
  editorial = false,
}: StoryCardProps) {
  const { saved, busy, toggle } = useBookmark(article?.id);
  // Coalesce props from article if provided
  const finalKicker = kicker || article?.kicker;
  const finalTitle = title || article?.title || "";
  const finalSummary = summary || article?.summary;
  const finalAuthor = author || article?.author;
  const finalDate = date || article?.date;
  const finalReadTime = readTime || article?.readTime;
  const finalImageAlt = imageAlt || article?.imageAlt || finalTitle;
  const finalImageUrl = imageUrl || article?.imageUrl || article?.image || null;
  const finalHref =
    href || (article?.slug ? `/stories/${article.slug}` : "/stories");
  const finalLayout = variant || layout;

  if (loading) {
    return (
      <div
        className={cn(
          "bg-[var(--surface-card)] border border-[var(--border)] rounded-lg overflow-hidden",
          finalLayout === "horizontal" ? "flex flex-row" : "flex flex-col",
          className,
        )}
      >
        <div
          className={cn(
            "bg-[var(--surface-skeleton)] animate-pulse",
            finalLayout === "horizontal"
              ? "w-48 h-auto"
              : "w-full aspect-[3/2]",
          )}
        ></div>
        <div className="p-4 flex flex-col gap-3 flex-1">
          <div className="w-16 h-3 bg-[var(--surface-skeleton)] rounded"></div>
          <div className="w-full h-6 bg-[var(--surface-skeleton)] rounded"></div>
          <div className="w-3/4 h-6 bg-[var(--surface-skeleton)] rounded"></div>
          <div className="w-full h-4 bg-[var(--surface-skeleton)] rounded mt-2"></div>
          <div className="w-5/6 h-4 bg-[var(--surface-skeleton)] rounded"></div>
        </div>
      </div>
    );
  }

  const isHorizontal =
    finalLayout === "horizontal" || finalLayout === "compact";

  return (
    <article
      className={cn(
        "group block bg-[var(--surface-card)] border border-[var(--border)] rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 transition-shadow duration-250 hover:shadow-hover",
        isHorizontal ? "flex flex-col sm:flex-row" : "flex flex-col",
        className,
        editorial && "home-story-card",
      )}
    >
      {/* Image container */}
      <Link
        href={finalHref || "/stories"}
        aria-label={`Read ${finalTitle}`}
        className={cn(
          "story-media relative overflow-hidden bg-[var(--surface-tint)] shrink-0",
          isHorizontal
            ? finalLayout === "compact"
              ? "w-full sm:w-28 sm:h-28"
              : "w-full sm:w-60 h-48 sm:h-auto"
            : "w-full aspect-[3/2]",
          finalLayout === "lead" && "aspect-[16/7]",
        )}
      >
        {finalImageUrl ? (
          <Image
            src={finalImageUrl}
            alt={finalImageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-250 ease-standard group-hover:scale-[1.03]"
            priority={priority}
          />
        ) : (
          <PlaceholderImage />
        )}
        {(article?.isSponsored || sponsored) && (
          <div className="absolute top-2 right-2 bg-[color:color-mix(in_srgb,var(--surface-card)_90%,transparent)] backdrop-blur text-xs font-semibold px-2 py-1 rounded text-[var(--text-heading)] shadow">
            Sponsored
          </div>
        )}
      </Link>

      {/* Content container */}
      <div
        className={cn(
          "story-copy flex flex-col flex-1",
          isHorizontal ? "p-4 sm:p-5 justify-center" : "p-5",
        )}
      >
        {finalKicker && (
          <span className="text-[var(--text-accent)] text-[12px] leading-[16px] font-semibold tracking-[0.08em] uppercase mb-2">
            {finalKicker}
          </span>
        )}

        <h3
          className={cn(
            "font-display font-bold text-[var(--text-heading)] mb-2 relative inline-block text-balance w-fit",
            finalLayout === "lead"
              ? "text-[clamp(26px,2.6vw,34px)] leading-tight"
              : "text-[19px] sm:text-[22px] leading-[30px]",
          )}
        >
          <Link href={finalHref || "/stories"}>{finalTitle}</Link>
          <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[var(--accent)] scale-x-0 origin-left transition-transform duration-250 ease-standard group-hover:scale-x-100"></span>
        </h3>

        {finalSummary && finalLayout !== "compact" && (
          <p className="text-[var(--text-meta)] text-[15px] sm:text-[17px] leading-relaxed mb-4 line-clamp-2">
            {finalSummary}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2 text-[13px] leading-[18px] text-[var(--text-meta)] font-ui flex-wrap pt-2">
          {finalAuthor && (
            <span className="font-bold text-[var(--text-heading)]">
              {finalAuthor}
            </span>
          )}
          {finalAuthor && (finalDate || finalReadTime) && <span>&middot;</span>}
          {finalDate && <span>{publicationDate(finalDate)}</span>}
          {finalDate && finalReadTime && <span>&middot;</span>}
          {finalReadTime && <span>{finalReadTime}</span>}

          <button
            type="button"
            aria-label={`${saved ? "Remove" : "Save"} ${finalTitle}`}
            aria-pressed={saved}
            className={cn(
              "ml-auto transition-colors",
              saved
                ? "text-[var(--text-accent)]"
                : "text-[var(--text-meta)] hover:text-[var(--text-heading)]",
            )}
            onClick={toggle}
            disabled={busy}
          >
            <svg
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 2C1 1.44772 1.44772 1 2 1H10C10.5523 1 11 1.44772 11 2V12.618C11 12.9463 10.5843 13.0898 10.3807 12.8364L6 7.38197L1.6193 12.8364C1.41566 13.0898 1 12.9463 1 12.618V2Z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
});

export default StoryCard;
