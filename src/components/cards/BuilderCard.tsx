'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import PlaceholderImage from '../ui/PlaceholderImage';

interface BuilderCardProps {
  builder: any;
}

const BuilderCard = React.memo(({ builder }: BuilderCardProps) => {
  return (
    <Link 
      href={`/builders/${builder.slug || '#'}`}
      className="group relative flex flex-col bg-white focus:outline-none focus:ring-2 focus:ring-royal transition-all duration-250 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-navy-50 rounded-lg mb-4">
        {builder.imageUrl ? (
           <Image 
             src={builder.imageUrl}
             alt={builder.name}
             fill
             className="object-cover transition-transform duration-400 group-hover:scale-105"
             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
           />
        ) : (
           <PlaceholderImage text="Portrait" icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>} />
        )}
      </div>

      <div className="flex flex-col flex-grow">
        <div className="mb-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold tracking-wide bg-slate-100 text-slate-600">
            {builder.classification || builder.category || 'Builder'}
          </span>
        </div>
        
        <h3 className="font-display font-bold text-navy-900 text-[18px] leading-tight mb-1 group-hover:text-brand-red transition-colors">
          {builder.name}
        </h3>
        
        <div className="font-ui text-slate-500 text-[13px] flex items-center gap-1 mb-2">
          <span className="opacity-80 grayscale">{builder.flag || '📍'}</span> {builder.location}
        </div>

        <p className="font-ui text-slate-600 text-[14px] leading-snug">
          {builder.headline || builder.bio || `${builder.role} at ${builder.company}`}
        </p>
      </div>
    </Link>
  );
});

BuilderCard.displayName = 'BuilderCard';

export default BuilderCard;
