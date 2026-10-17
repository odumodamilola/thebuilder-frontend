"use client";

import Link from "next/link";
import React from "react";
import { Startup } from "@/data/startups";

interface StartupCardProps {
  startup: Startup;
}

const StartupCard = React.memo(({ startup }: StartupCardProps) => {
  return (
    <Link
      href={`/startups/${startup.slug}`}
      className="group flex flex-col bg-[var(--surface-card)] border border-[var(--border)] rounded-xl p-6 transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(11,32,70,0.08)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
      aria-label={`View startup details for ${startup.name}`}
    >
      <div className="flex items-start justify-between mb-4">
        {/* Logo Placeholder */}
        <div
          className="w-16 h-16 rounded-xl bg-[var(--surface-tint)] flex items-center justify-center text-[var(--text-heading)] font-display font-bold text-xl border border-[var(--border)]"
          aria-hidden="true"
        >
          {startup.logo}
        </div>

        {/* Badges */}
        <div className="flex flex-col items-end gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold tracking-[0.08em] uppercase bg-[var(--surface-tint)] text-[var(--text-heading)]">
            {startup.stage}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--surface-console)] text-[var(--text-body)]">
            {startup.industry}
          </span>
        </div>
      </div>

      <div className="flex-grow">
        <h3 className="font-display font-bold text-[var(--text-heading)] text-[22px] leading-[30px] mb-2 group-hover:text-[var(--text-accent)] transition-colors">
          {startup.name}
        </h3>
        <p className="font-ui text-[var(--text-body)] text-[15px] leading-relaxed mb-4 line-clamp-2">
          {startup.tagline}
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between text-[var(--text-body)] text-[13px]">
        <div className="flex items-center gap-1.5">
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {startup.country}
        </div>
        <div className="flex items-center gap-3">
          <span title="Founded">{startup.foundedYear}</span>
          <span
            className="w-1 h-1 rounded-full bg-[var(--text-meta)]"
            aria-hidden="true"
          ></span>
          <span title="Team Size">{startup.teamSize}</span>
        </div>
      </div>
    </Link>
  );
});

StartupCard.displayName = "StartupCard";

export default StartupCard;
