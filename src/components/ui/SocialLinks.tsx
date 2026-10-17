import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
const platforms = [
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "x", label: "X", Icon: Twitter },
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "youtube", label: "YouTube", Icon: Youtube },
  { key: "facebook", label: "Facebook", Icon: Facebook },
] as const;
export function SocialLinks({ compact = false }: { compact?: boolean }) {
  const { socialLinks } = useSiteSettings();
  const visiblePlatforms = compact
    ? platforms.filter((platform) => platform.key !== "facebook")
    : platforms;
  const configured = visiblePlatforms.filter(
    (platform) => socialLinks[platform.key],
  );
  return (
    <div
      className={`flex items-center ${compact ? "gap-3" : "gap-2"}`}
      aria-label={
        configured.length
          ? "Social profiles"
          : "Social profiles are coming soon"
      }
    >
      {(configured.length ? configured : visiblePlatforms).map(
        ({ key, label, Icon }) => {
          const className = compact
            ? "flex items-center justify-center text-[var(--text-meta-on-inverse)]"
            : "flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-inverse)]";
          return socialLinks[key] ? (
            <a
              key={key}
              href={socialLinks[key]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={className}
            >
              <Icon
                aria-hidden="true"
                className={compact ? "h-3 w-3" : "h-3.5 w-3.5"}
              />
            </a>
          ) : (
            <span key={key} aria-hidden="true" className={className}>
              <Icon className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
            </span>
          );
        },
      )}
    </div>
  );
}
