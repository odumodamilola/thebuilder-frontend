import React from "react";

interface MediaProps {
  ratio?: number;
  radius?: number;
  label?: string;
  alt?: string;
  src?: string;
  className?: string;
}

export function Media({
  ratio = 1,
  radius = 0,
  label,
  alt,
  src,
  className = "",
}: MediaProps) {
  return (
    <div
      className={`relative overflow-hidden bg-[var(--surface-skeleton)] flex items-center justify-center ${className}`}
      style={{ aspectRatio: ratio, borderRadius: radius }}
      aria-label={label}
    >
      {src ? (
        <img src={src} alt={alt || ""} className="w-full h-full object-cover" />
      ) : (
        <span className="text-[var(--text-meta)] font-ui text-sm">
          {alt || "Media"}
        </span>
      )}
    </div>
  );
}
