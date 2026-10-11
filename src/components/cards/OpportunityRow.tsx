'use client';

import React from 'react';
import Link from 'next/link';

interface DeadlineChipProps {
  daysLeft: number;
}

function DeadlineChip({ daysLeft }: DeadlineChipProps) {
  const isUrgent = daysLeft <= 7 && daysLeft >= 0;
  const isClosed = daysLeft < 0;
  
  if (isClosed) {
    return (
      <span role="status" aria-label="Closed" className="inline-flex items-center h-6 px-3 rounded-full text-[13px] font-medium bg-line text-slate">
        Closed
      </span>
    );
  }
  
  return (
    <span
      role="status"
      aria-label={`Deadline: ${daysLeft} days remaining`}
      className={`inline-flex items-center h-6 px-3 rounded-full text-[13px] font-medium ${
        isUrgent
          ? 'bg-red-50 text-brand-red'
          : 'bg-navy-50 text-navy-900'
      }`}
    >
      {daysLeft} days left
    </span>
  );
}

interface OpportunityRowProps {
  org: string;
  title: string;
  type: string;
  location: string;
  daysLeft: number;
  href: string;
}

const OpportunityRow = React.memo(function OpportunityRow({
  org,
  title,
  type,
  location,
  daysLeft,
  href,
}: OpportunityRowProps) {
  return (
    <li className="flex flex-col sm:flex-row sm:items-center py-5 border-b border-line gap-4 hover:bg-navy-50/50 transition-colors group list-none">
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate">{org}</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-navy-50 text-navy-900">
            {type}
          </span>
        </div>
        <Link href={href || '#'} className="group-hover:text-royal transition-colors">
          <h3 className="font-display font-bold text-xl leading-tight text-navy-900">
            {title}
          </h3>
        </Link>
        <div className="flex items-center gap-3 text-[14px] text-slate">
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            {location}
          </span>
        </div>
      </div>
      <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0">
        <DeadlineChip daysLeft={daysLeft} />
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Apply for ${title} on organiser's site, opens in new tab`}
          className="inline-flex items-center justify-center h-9 px-4 rounded-lg text-sm font-medium border border-line bg-white text-navy-900 hover:bg-navy-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-royal focus-visible:ring-offset-2 whitespace-nowrap"
        >
          Apply on organiser's site ↗
        </a>
      </div>
    </li>
  );
});

export default OpportunityRow;
