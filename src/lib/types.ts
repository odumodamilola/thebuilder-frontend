// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    perPage: number;
    lastPage: number;
  };
}

// Pagination
export interface PaginationParams {
  page?: number;
  perPage?: number;
}

// Edition
export type Edition = "Nigeria" | "Australia";

// Navigation
export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

// Article
export interface Article {
  id?: string;
  slug?: string;
  title: string;
  kicker: string;
  summary: string;
  excerpt?: string;
  body?: string;
  author: string;
  authorSlug?: string;
  date: string; // ISO string
  readTime: string; // e.g. "9 min read"
  imageUrl?: string;
  image?: string;
  imageAlt?: string;
  category?: string;
  tags?: { id: string; name: string; slug: string }[];
  seo?: { title?: string; description?: string; canonical?: string };
  edition?: Edition | "both";
  isFeatured?: boolean;
  isSponsored?: boolean;
  sponsorName?: string;
  publishedAt?: string;
  viewCount?: number;
}

// Story (alias for Article with additional fields for UI)
export interface Story extends Article {
  views?: number;
  type?: string;
  industry?: string;
  country?: string;
}

// Builder
export interface Builder {
  id?: string;
  slug?: string;
  name: string;
  title?: string;
  classification:
    | "Startup Founder"
    | "Entrepreneur"
    | "Professional"
    | "Investor"
    | "Community Leader"
    | "Innovator"
    | "Academic"
    | "Creative"
    | "Diaspora Professional";
  role?: string;
  company?: string;
  industry?: string;
  location: string;
  city?: string;
  country: string;
  countryCode?: string;
  flag: string;
  headline: string;
  bio?: string;
  imageUrl?: string;
  image?: string;
  imageAlt?: string;
  edition?: Edition;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  articles?: Article[];
  startup?: Startup;
}

// Startup
export interface Startup {
  id?: string;
  slug?: string;
  name: string;
  oneLiner: string;
  description?: string;
  industry: string;
  stage: "Idea" | "Pre-seed" | "Seed" | "Series A+" | "Growth";
  hq: string;
  country: string;
  flag: string;
  foundedYear?: number;
  teamSize?: number;
  founders?: Builder[];
  articles?: Article[];
  logoUrl?: string;
  image?: string;
  website?: string;
}

// Opportunity
export type OpportunityType =
  | "job"
  | "grant"
  | "program"
  | "event"
  | "fellowship"
  | "accelerator"
  | "competition"
  | "Job"
  | "Grant"
  | "Program"
  | "Event"
  | "Fellowship"
  | "Accelerator"
  | "Competition";
export interface Opportunity {
  id: string;
  slug?: string;
  title: string;
  organisation: string;
  orgLogoUrl?: string;
  type: OpportunityType;
  location: string;
  deadline: string | null;
  daysLeft: number | null;
  isUrgent: boolean;
  industry?: string;
  description?: string;
  eligibility?: string;
  applyUrl: string;
  edition?: Edition | "both";
}

// Video
export interface Video {
  format?: "interview" | "podcast" | "documentary" | null;
  id: string;
  title: string;
  slug?: string;
  duration: string;
  date: string;
  thumbnailUrl?: string;
  embedUrl?: string;
  url?: string;
  category?: string;
  viewCount?: number;
}

// Nomination (public submission)
export interface NominationSubmission {
  builderName: string;
  role: string;
  company?: string;
  location: string;
  reason: string;
  contactEmail: string;
  edition: Edition;
}

// Console types
export type ArticleStatus = "draft" | "review" | "scheduled" | "published";
export type UserRole = "admin" | "editor" | "writer" | "contributor";
export type UserStatus = "active" | "inactive";
export type NominationStatus =
  "new" | "under_review" | "approved" | "featured" | "rejected";
export type AuditAction =
  | "published"
  | "unpublished"
  | "created"
  | "updated"
  | "deleted"
  | "login"
  | "settings_changed";
export type AdPosition =
  "header_banner" | "sidebar" | "in_article" | "newsletter";
export type SortDirection = "asc" | "desc";

export interface ConsoleArticle extends Article {
  status: ArticleStatus;
  updatedAt: string;
  scheduledAt?: string;
  wordCount?: number;
}

export interface ConsoleUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  lastActiveAt?: string;
  joinedAt: string;
}

export interface ConsoleStat {
  label: string;
  value: number;
  change?: number; // % change from previous period
  changeDirection?: "up" | "down" | "neutral";
}

export interface ActivityFeedItem {
  id: string;
  userId: string;
  userName: string;
  action: AuditAction;
  target: string;
  targetId?: string;
  timestamp: string;
  ipAddress?: string;
}

export interface NominationRecord {
  id: string;
  builderName: string;
  nominatorEmail: string;
  edition: Edition;
  submittedAt: string;
  status: NominationStatus;
  reason: string;
  reviewedBy?: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  width?: number;
  height?: number;
  size: number; // bytes
  uploadedAt: string;
  uploadedBy: string;
  usageCount?: number;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: AuditAction;
  target: string;
  targetId?: string;
  ipAddress: string;
  metadata?: Record<string, unknown>;
}

export interface AdUnit {
  id: string;
  name: string;
  position: AdPosition;
  status: "active" | "inactive";
  impressions: number;
  clicks: number;
  ctr: number; // clicks/impressions
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  linkUrl?: string;
  altText?: string;
  sponsorName?: string;
}
