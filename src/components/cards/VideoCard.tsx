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
        className="relative aspect-video w-full overflow-hidden rounded-[12px] bg-navy-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal"
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
          <div className="h-full w-full bg-navy-900 transition-transform duration-400 ease-in-out group-hover:scale-[1.02]" />
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-overlay transition-transform duration-250 group-hover:scale-110">
            <Play className="ml-1 h-5 w-5 fill-navy-900 stroke-navy-900" aria-hidden="true" />
          </div>
        </div>

        {/* Duration Badge */}
        <div 
          aria-label={`Duration: ${video.duration}`} 
          className="absolute bottom-2 right-2 rounded-[4px] bg-navy-950/80 px-2 py-1 text-[13px] font-medium leading-[18px] text-white backdrop-blur-sm"
        >
          {video.duration}
        </div>
      </Link>

      <div className="flex flex-col gap-2">
        <h3 className="font-display text-[22px] font-bold leading-[30px] tracking-[-0.01em] text-white line-clamp-2">
          {video.title}
        </h3>
        <div className="flex items-center gap-2 font-ui text-[13px] leading-[18px] text-slate-300">
          <span>{video.date}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300-brand/50" />
          <span>{video.views} views</span>
        </div>
      </div>
    </article>
  );
});

export default VideoCard;
