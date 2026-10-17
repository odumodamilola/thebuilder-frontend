import React from "react";
import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  className?: string;
  icon?: React.ReactNode;
  text?: string;
}

export default function PlaceholderImage({
  className,
  icon,
  text = "Photo",
}: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full bg-[var(--surface-tint)] flex items-end justify-start p-3 overflow-hidden",
        className,
      )}
    >
      {/* Curved shape top right */}
      <div className="absolute top-0 right-0 w-[60%] h-[120%] bg-[var(--surface-raised)] rounded-bl-[100%] opacity-50 translate-x-[20%] -translate-y-[10%]" />

      {/* Dot pattern */}
      <div className="tb-placeholder-dots absolute inset-0 opacity-40" />

      {/* Bottom left label */}
      <div className="relative z-10 flex items-center gap-1.5 text-[var(--text-meta)] text-[11px] font-semibold tracking-wide uppercase">
        {icon || (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )}
        {text}
      </div>
    </div>
  );
}
