import React from 'react';

interface SkeletonProps {
  className?: string;
  lines?: number;
  aspectRatio?: string;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export function Skeleton({ className = '', lines = 1, aspectRatio, radius = 'md' }: SkeletonProps) {
  const radiusClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  }[radius];

  const baseClass = `bg-navy-50 animate-pulse ${radiusClass} ${className}`;

  if (aspectRatio) {
    return (
      <div className={`${baseClass}`} style={{ aspectRatio }} />
    );
  }

  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClass} h-4 w-full`}
            style={{ width: i === lines - 1 ? '70%' : '100%' }}
          />
        ))}
      </div>
    );
  }

  return <div className={`${baseClass} h-4 w-full`} />;
}
