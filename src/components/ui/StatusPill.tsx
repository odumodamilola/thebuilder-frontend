import React from 'react';
import { cn } from '@/lib/utils';

interface StatusPillProps {
  status: 'draft' | 'published' | 'review' | 'scheduled' | 'changes' | string;
  size?: 'sm' | 'default';
  className?: string;
}

export function StatusPill({ status, size = 'default', className }: StatusPillProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium capitalize";
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 rounded text-[11px]' : 'px-2.5 py-0.5 rounded-full text-xs';
  
  const statusStyles: Record<string, string> = {
    draft: "bg-[var(--surface-skeleton)] text-[var(--text-body)]",
    published: "bg-[var(--surface-inverse)] text-[var(--text-on-inverse)]",
    review: "bg-[var(--decoration-royal)] text-[var(--text-on-inverse)]",
    scheduled: "bg-[var(--surface-blush)] text-[var(--text-heading)]",
    changes: "bg-[color:color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--text-accent)]"
  };

  const displayStatus = status === 'changes' ? 'Changes req' : status;

  return (
    <span className={cn(baseClasses, sizeClasses, statusStyles[status] || "bg-[var(--surface-skeleton)] text-[var(--text-body)]", className)}>
      {displayStatus}
    </span>
  );
}
