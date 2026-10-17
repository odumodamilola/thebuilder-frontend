import React from "react";

interface PosterBandProps {
  children: React.ReactNode;
  className?: string;
  circles?: "left" | "right" | "both";
  padding?: string;
}

export function PosterBand({
  children,
  className = "",
  circles,
  padding,
}: PosterBandProps) {
  return (
    <div
      className={`relative bg-[var(--surface-inverse)] overflow-hidden py-12 px-6 flex items-center justify-center text-center ${className}`}
    >
      {/* Background dot grid */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, #ffffff 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* Decorative soft circles */}
      <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-[var(--decoration-royal)] opacity-15 blur-2xl z-0" />
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[var(--decoration-royal)] opacity-15 blur-2xl z-0" />

      <div className="relative z-10 text-[var(--text-on-inverse)] uppercase tracking-[0.08em] font-semibold text-sm sm:text-base">
        {children}
      </div>
    </div>
  );
}
