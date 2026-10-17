export const socialPlatforms = [
  "linkedin",
  "x",
  "instagram",
  "youtube",
  "facebook",
] as const;
export type SocialPlatform = (typeof socialPlatforms)[number];
export interface SiteMenu {
  label: string;
  url: string;
}
export interface SiteSettings {
  siteName: string;
  description: string;
  contactEmail: string;
  footer: string;
  footerNigeria?: string;
  footerAustralia?: string;
  menus?: SiteMenu[];
  socialLinks: Partial<Record<SocialPlatform, string>>;
}
export const defaultSiteMenus: SiteMenu[] = [
  { label: "Home", url: "/" },
  { label: "Stories", url: "/stories" },
  { label: "The Builder", url: "/builders" },
  { label: "Videos", url: "/videos" },
  { label: "Opportunities", url: "/opportunities" },
];
export function safeNavigationUrl(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    !value ||
    /[\\\u0000-\u0020\u007f]/.test(value)
  )
    return false;
  if (value.startsWith("/")) return !value.startsWith("//");
  if (!/^https?:\/\//.test(value)) return false;
  try {
    const url = new URL(value);
    return (
      ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
export function normalizeSiteSettings(value: unknown): SiteSettings {
  const record =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  const text = (key: string, fallback = "") =>
    record[key] === null
      ? ""
      : typeof record[key] === "string"
        ? String(record[key])
        : fallback;
  const socialLinks: SiteSettings["socialLinks"] = {};
  const social =
    record.socialLinks && typeof record.socialLinks === "object"
      ? (record.socialLinks as Record<string, unknown>)
      : {};
  for (const key of socialPlatforms)
    if (safeNavigationUrl(social[key]) && /^https?:\/\//i.test(social[key]))
      socialLinks[key] = social[key];
  const menus = Array.isArray(record.menus)
    ? record.menus
        .filter((item): item is SiteMenu =>
          Boolean(
            item &&
            typeof item === "object" &&
            typeof item.label === "string" &&
            item.label.trim() &&
            safeNavigationUrl(item.url),
          ),
        )
        .map((item) => ({ label: item.label, url: item.url }))
    : undefined;
  return {
    siteName: text("siteName", "The Builder").trim() || "The Builder",
    description: text(
      "description",
      "Telling the stories of African entrepreneurs, startups, professionals and diaspora builders.",
    ),
    contactEmail: text("contactEmail"),
    footer: /Osun Tech Exchange/i.test(text("footer")) ? "" : text("footer"),
    footerNigeria:
      typeof record.footerNigeria === "string"
        ? record.footerNigeria
        : undefined,
    footerAustralia:
      typeof record.footerAustralia === "string"
        ? record.footerAustralia
        : undefined,
    menus,
    socialLinks,
  };
}
import { defaultFooter } from "./editorial-policy";
import type { Edition } from "./types";

export function footerForEdition(
  settings: SiteSettings,
  edition: Edition,
): string {
  return (
    (edition === "Australia"
      ? settings.footerAustralia
      : settings.footerNigeria) ??
    (settings.footer || defaultFooter(edition))
  );
}
