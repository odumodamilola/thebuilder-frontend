import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items, className, ...props }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm font-ui", className)} {...props}>
      <ol className="flex items-center gap-2 m-0 p-0 list-none">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="text-[var(--text-meta)] hover:text-[var(--text-heading)] transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={cn(isLast ? "text-[var(--text-heading)] font-semibold" : "text-[var(--text-meta)]")}>
                  {item.label}
                </span>
              )}
              
              {!isLast && (
                <span className="text-[var(--text-meta-on-inverse)]">/</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
