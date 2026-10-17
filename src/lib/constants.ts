export const SITE_NAME = "The Builder";
export const SITE_TAGLINE = "Innovate · Connect · Grow.";
export const SITE_DESCRIPTION =
  "Stories of African entrepreneurs, startups, professionals and diaspora builders.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://thebuilder.ng";
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const EDITIONS = ["Nigeria", "Australia"] as const;
export const SCROLL_THRESHOLD = 80; // px before header compacts
export const TOAST_DURATION = 4000; // ms
export const DEBOUNCE_DELAY = 300; // ms for search
export const WORDS_PER_MINUTE = 200; // for read time calculation

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Stories", href: "/stories" },
  { label: "Builders", href: "/builders" },
  { label: "Startups", href: "/startups" },
  { label: "Diaspora", href: "/diaspora" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Videos", href: "/videos" },
] as const;

export const STORY_CATEGORIES = [
  "Cover Story",
  "Founder Stories",
  "Diaspora",
  "Fintech",
  "Startups",
  "AgriTech",
  "HealthTech",
  "Analysis",
  "Opinion",
  "Interviews",
  "Business",
  "EdTech",
  "Energy",
  "Consumer",
  "Hardware",
] as const;

export const DIASPORA_REGIONS = [
  "Australia",
  "Africa",
  "UK",
  "US",
  "Canada",
] as const;
