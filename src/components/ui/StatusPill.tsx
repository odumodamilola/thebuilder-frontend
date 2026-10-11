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
    draft: "bg-slate-200 text-slate-700",
    published: "bg-navy-900 text-white",
    review: "bg-royal text-white",
    scheduled: "bg-blush text-navy-900",
    changes: "bg-brand-red/10 text-brand-red"
  };

  const displayStatus = status === 'changes' ? 'Changes req' : status;

  return (
    <span className={cn(baseClasses, sizeClasses, statusStyles[status] || "bg-slate-200 text-slate-700", className)}>
      {displayStatus}
    </span>
  );
}
