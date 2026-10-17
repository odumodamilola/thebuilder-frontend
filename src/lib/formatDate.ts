/**
 * Format a date string or Date object to en-GB format
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Format a date string for Africa/Lagos timezone with WAT label (console use)
 */
export function formatLagosTime(date: Date | string): string {
  return (
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Lagos",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date)) + " WAT"
  );
}

/**
 * Relative time (e.g. "2 hours ago") — fallback to formatDate for older dates
 */
export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return rtf.format(-Math.floor(diff / 60_000), "minute");
  if (diff < 86_400_000)
    return rtf.format(-Math.floor(diff / 3_600_000), "hour");
  if (diff < 604_800_000)
    return rtf.format(-Math.floor(diff / 86_400_000), "day");
  return formatDate(date);
}
