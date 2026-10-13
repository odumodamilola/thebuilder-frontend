import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Video {
  id: string;
  title: string;
  duration: string;
  date: string;
  views: string;
  thumbnailUrl?: string;
}

interface VideoCardProps {
  video: Video;
  priority?: boolean;
  className?: string;
}

const VideoCard = React.memo(function VideoCard({ video, priority = false, className }: VideoCardProps) {
  return (
    <article className={cn("group flex flex-col gap-4", className)}>
      <Link 
        href={`/videos/${video.id}`} 
        aria-label={`Play: ${video.title} (${video.duration})`} 
        className="relative aspect-video w-full overflow-hidden rounded-[12px] bg-[var(--surface-inverse-deep)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
      >
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt=""
            fill
            priority={priority}
            className="object-cover transition-transform duration-400 ease-in-out group-hover:scale-102"
          />
        ) : (
          <div className="h-full w-full bg-[var(--surface-inverse)] transition-transform duration-400 ease-in-out group-hover:scale-[1.02]" />
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--surface-card)_90%,transparent)] shadow-overlay transition-transform duration-250 group-hover:scale-110">
            <Play className="ml-1 h-5 w-5 fill-[var(--text-heading)] stroke-[var(--text-heading)]" aria-hidden="true" />
          </div>
        </div>

        {/* Duration Badge */}
        <div 
          aria-label={`Duration: ${video.duration}`} 
          className="absolute bottom-2 right-2 rounded-[4px] bg-[color:color-mix(in_srgb,var(--surface-inverse-deep)_80%,transparent)] px-2 py-1 text-[13px] font-medium leading-[18px] text-[var(--text-on-inverse)] backdrop-blur-sm"
        >
          {video.duration}
        </div>
      </Link>

      <div className="flex flex-col gap-2">
        <h3 className="font-display text-[22px] font-bold leading-[30px] tracking-[-0.01em] text-[var(--text-on-inverse)] line-clamp-2">
          {video.title}
        </h3>
        <div className="flex items-center gap-2 font-ui text-[13px] leading-[18px] text-[var(--text-meta-on-inverse)]">
          <span>{video.date}</span>
          <span className="h-1 w-1 rounded-full bg-[color:color-mix(in_srgb,var(--text-meta)_50%,transparent)]" />
          <span>{video.views} views</span>
        </div>
      </div>
    </article>
  );
});

export default VideoCard;
