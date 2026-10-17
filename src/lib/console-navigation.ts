export interface ConsoleNavigationItem {
  label: string;
  href: string;
  icon: string;
  permission: string;
  count?: number;
}
export const consoleNavigation: ConsoleNavigationItem[] = [
  {
    label: "Dashboard",
    href: "/console",
    icon: "layout-dashboard",
    permission: "content.read",
  },
  {
    label: "Content",
    href: "/console/content",
    icon: "file-text",
    permission: "content.read",
  },
  {
    label: "Builders",
    href: "/console/builders",
    icon: "users",
    permission: "profiles.manage",
  },
  {
    label: "Startups",
    href: "/console/startups",
    icon: "rocket",
    permission: "profiles.manage",
  },
  {
    label: "Opportunities",
    href: "/console/opportunities",
    icon: "briefcase",
    permission: "profiles.manage",
  },
  {
    label: "Homepage",
    href: "/console/homepage",
    icon: "layout-template",
    permission: "homepage.manage",
  },
  {
    label: "Nominations",
    href: "/console/nominations",
    icon: "inbox",
    permission: "nominations.manage",
  },
  {
    label: "Submissions",
    href: "/console/submissions",
    icon: "send",
    permission: "submissions.manage",
  },
  {
    label: "Videos",
    href: "/console/videos",
    icon: "play",
    permission: "youtube.manage",
  },
  {
    label: "Media",
    href: "/console/media",
    icon: "image",
    permission: "media.manage",
  },
  {
    label: "Taxonomy",
    href: "/console/taxonomy",
    icon: "tags",
    permission: "taxonomy.manage",
  },
  {
    label: "Ads & Campaigns",
    href: "/console/ads",
    icon: "megaphone",
    permission: "ads.manage",
  },
  {
    label: "Users & Roles",
    href: "/console/users",
    icon: "shield",
    permission: "users.manage",
  },
  {
    label: "Settings",
    href: "/console/settings",
    icon: "settings",
    permission: "settings.manage",
  },
  {
    label: "Audit Log",
    href: "/console/audit",
    icon: "scroll-text",
    permission: "audit.read",
  },
  {
    label: "Analytics",
    href: "/console/analytics",
    icon: "line-chart",
    permission: "analytics.read",
  },
];
export const allowedConsoleNavigation = (permissions: readonly string[] = []) =>
  consoleNavigation.filter((item) => permissions.includes(item.permission));
