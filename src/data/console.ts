export interface DashboardStats {
  totalArticles: number;
  publishedThisWeek: number;
  pendingReview: number;
  nominations: number;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  status: "draft" | "published" | "review" | "scheduled";
  publishedAt?: string;
  updatedAt: string;
}

export interface ConsoleUser {
  name: string;
  role: string;
  avatar?: string;
}

export const consoleData = {
  stats: {
    totalArticles: 1254,
    publishedThisWeek: 32,
    pendingReview: 14,
    nominations: 8,
  } as DashboardStats,
  activity: [
    {
      id: "1",
      user: "Sarah Lee",
      action: "published",
      target: "The Rise of Fintech in Lagos",
      timestamp: "2023-10-24T10:30:00Z",
    },
    {
      id: "2",
      user: "David O.",
      action: "submitted for review",
      target: "Interview with Builder CEO",
      timestamp: "2023-10-24T09:15:00Z",
    },
    {
      id: "3",
      user: "Admin",
      action: "approved nomination",
      target: "Tech Startup of the Year",
      timestamp: "2023-10-23T16:45:00Z",
    },
  ] as Activity[],
  articles: [
    {
      id: "1",
      title: "The Rise of Fintech in Lagos",
      author: "Sarah Lee",
      category: "Startups",
      status: "published",
      publishedAt: "2023-10-24T10:30:00Z",
      updatedAt: "2023-10-24T10:30:00Z",
    },
    {
      id: "2",
      title: "Interview with Builder CEO",
      author: "David O.",
      category: "Builders",
      status: "review",
      updatedAt: "2023-10-24T09:15:00Z",
    },
    {
      id: "3",
      title: "Exploring the African Diaspora Tech Scene",
      author: "Aminata Diallo",
      category: "Diaspora",
      status: "draft",
      updatedAt: "2023-10-22T14:20:00Z",
    },
    {
      id: "4",
      title: "Top 10 Emerging Technologies in Africa",
      author: "James Kariuki",
      category: "Stories",
      status: "scheduled",
      publishedAt: "2023-10-30T08:00:00Z",
      updatedAt: "2023-10-23T11:00:00Z",
    },
  ] as Article[],
  user: {
    name: "Jane Doe",
    role: "Editor in Chief",
  } as ConsoleUser,
};
