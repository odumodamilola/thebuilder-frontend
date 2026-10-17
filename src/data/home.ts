import { Article, Builder, Startup, Opportunity, Video } from "../lib/types";

export const leadStory: Article = {
  id: "lead-1",
  slug: "haftu-strintzos",
  title: "Haftu Strintzos: From Ethiopian Orphanage to Melbourne Entrepreneur",
  summary:
    "The remarkable journey of a resilient builder who overcame unimaginable odds to build a thriving tech startup in Australia.",
  category: "COVER STORY",
  imageUrl: "/images/haftu_strintzos.jpg",
  author: "The Builder",
  date: "2026-10-01",
  readTime: "8 min read",
  kicker: "COVER STORY",
};

export const latestStories: Article[] = [
  {
    id: "story-2",
    slug: "mohamed-semra",
    title: "From Sudan to the Mayor's Office",
    summary:
      "How Mohamed Semra is reshaping local politics and advocating for the diaspora.",
    category: "DIASPORA",
    imageUrl: "/images/haftu_strintzos.jpg",
    author: "Staff",
    date: "2026-10-02",
    readTime: "5 min read",
    kicker: "DIASPORA",
  },
  {
    id: "story-3",
    slug: "moses-musioka",
    title: "Selling More Than Food",
    summary: "Moses Musioka shares his insights on building a culinary empire.",
    category: "FOUNDER STORIES",
    imageUrl: "/images/haftu_strintzos.jpg",
    author: "Staff",
    date: "2026-10-03",
    readTime: "6 min read",
    kicker: "FOUNDER",
  },
];

export const trendingStories: Article[] = [...latestStories];

export const spotlightBuilder: Builder = {
  id: "builder-1",
  slug: "selba-gondoza-luka",
  name: "Selba-Gondoza Luka",
  role: "Founder & CEO",
  company: "AfriTech Solutions",
  imageUrl: "/images/haftu_strintzos.jpg",
  bio: "A visionary leader connecting African tech talent with global opportunities.",
  classification: "Startup Founder",
  location: "Melbourne, Australia",
  city: "Melbourne",
  country: "Australia",
  countryCode: "AU",
  flag: "🇦🇺",
  headline: "Connecting African tech talent with global opportunities.",
};

export const diasporaStories: Article[] = [
  {
    id: "story-4",
    slug: "bellamore-ndayikeze",
    title: "Building Bridges Across Continents",
    summary:
      "Bellamore Ndayikeze discusses the impact of cross-border collaboration.",
    category: "DIASPORA",
    imageUrl: "/images/haftu_strintzos.jpg",
    author: "Staff",
    date: "2026-10-04",
    readTime: "7 min read",
    kicker: "DIASPORA",
  },
];

export const videos: Video[] = [
  {
    id: "vid-1",
    title: "The Future of African Fintech",
    thumbnailUrl: "/images/haftu_strintzos.jpg",
    duration: "12:30",
    category: "Fintech",
    date: "2026-10-05",
    embedUrl: "https://youtube.com/embed/123",
  },
];

export const opportunities: Opportunity[] = [
  {
    id: "opp-1",
    title: "Blue Nile Business Masterclass",
    type: "program",
    organisation: "Blue Nile",
    deadline: "2026-11-01",
    location: "Online",
    applyUrl: "#",
    daysLeft: 10,
    isUrgent: false,
  },
  {
    id: "opp-2",
    title: "Catalysr Migrant Entrepreneurship Program",
    type: "accelerator",
    organisation: "Catalysr",
    deadline: "2026-12-01",
    location: "Melbourne",
    applyUrl: "#",
    daysLeft: 40,
    isUrgent: false,
  },
];

export const homeData = {
  leadStory,
  latestStories,
  trendingStories,
  spotlightBuilder,
  diasporaStories,
  videos,
  opportunities,
};
