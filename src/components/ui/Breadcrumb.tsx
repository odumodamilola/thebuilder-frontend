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
                <Link href={item.href} className="text-slate hover:text-navy-900 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={cn(isLast ? "text-navy-900 font-semibold" : "text-slate")}>
                  {item.label}
                </span>
              )}
              
              {!isLast && (
                <span className="text-slate-300">/</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
