import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function Wordmark({
  inverse,
  className,
}: {
  inverse?: boolean;
  className?: string;
}) {
  const { siteName } = useSiteSettings();
  return (
    <span
      className={cn(
        "font-display font-extrabold text-[24px] tracking-tighter leading-none",
        inverse
          ? "text-[var(--text-on-inverse)]"
          : "text-[var(--text-heading)]",
        className,
      )}
    >
      {siteName.replace(/\.$/, "").toUpperCase()}
      <span
        className={
          inverse
            ? "text-[var(--text-on-inverse)]"
            : "text-[var(--text-accent)]"
        }
      >
        .
      </span>
    </span>
  );
}
