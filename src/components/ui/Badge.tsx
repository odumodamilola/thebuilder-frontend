import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'award' | 'classification' | 'neutral' | string;
  icon?: string;
}

export function Badge({ tone = 'neutral', icon, className, children, ...props }: BadgeProps) {
  const toneClasses: Record<string, string> = {
    award: 'bg-red-50 text-brand-red border border-brand-red/20',
    classification: 'bg-navy-50 text-navy-900 border border-line',
    neutral: 'bg-slate-100 text-slate border border-line',
  };

  const selectedTone = toneClasses[tone] || toneClasses.neutral;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-[0.08em] uppercase font-ui",
        selectedTone,
        className
      )}
      {...props}
    >
      {icon && <Icon name={icon} className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}
