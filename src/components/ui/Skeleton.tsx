import type { CSSProperties } from "react";

interface SkeletonProps {
  className?: string;
  lines?: number;
  aspectRatio?: string;
  radius?: "none" | "sm" | "md" | "lg" | "full";
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  inverse?: boolean;
}

/** Source: UI/UX HTML export, components/core/Skeleton.jsx. */
export function Skeleton({
  className = "",
  lines,
  aspectRatio,
  radius = "md",
  width = "100%",
  height = 16,
  inverse = false,
}: SkeletonProps) {
  const style: CSSProperties = {
    display: "block",
    width,
    height: aspectRatio ? undefined : height,
    aspectRatio,
    borderRadius: { none: 0, sm: 4, md: 6, lg: 12, full: "50%" }[radius],
    background: inverse ? "rgba(255,255,255,0.08)" : "var(--surface-skeleton)",
  };
  if (lines)
    return (
      <span
        aria-hidden="true"
        className={`flex flex-col gap-2 ${className}`}
        style={{ width }}
      >
        {Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            className="tb-skeleton"
            style={{ ...style, width: i === lines - 1 ? "62%" : "100%" }}
          />
        ))}
      </span>
    );
  return (
    <span
      aria-hidden="true"
      className={`tb-skeleton ${className}`}
      style={style}
    />
  );
}
