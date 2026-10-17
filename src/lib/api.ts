import { http, HttpError, type ApiEnvelope, type RequestOptions } from "./http";
import type { Story, Builder, Startup, Opportunity, Video } from "./types";

export async function apiData<T>(
  path: string,
  options?: RequestOptions,
): Promise<T> {
  const response = await http<ApiEnvelope<T>>(path, options);
  if (!response || !Object.prototype.hasOwnProperty.call(response, "data"))
    throw new HttpError(502, "The API returned an unexpected response.");
  return response.data;
}

export interface ArticlePage {
  data: Story[];
  meta?: { total: number; page: number; perPage: number; lastPage: number };
}
export type SearchResults = {
  stories: Story[];
  builders: Builder[];
  startups: Startup[];
  opportunities: Opportunity[];
};
export interface PublicEvent {
  id: string;
  title: string;
  startsAt: string;
  location: string;
  type: string;
  url?: string;
  description?: string;
}
export interface HomeDocument {
  lead: Story | null;
  secondary: Story[];
  latest: Story[];
  trending: Story[];
  picks: Story[];
  mostRead: Story[];
  builders: Builder[];
  startups: Startup[];
  opportunities: Opportunity[];
  videos: Video[];
}

export const publicApi = {
  articles: (
    params: {
      category?: string;
      page?: number;
      q?: string;
      edition?: string;
    } = {},
    signal?: AbortSignal,
  ) => http<ArticlePage>("/articles", { query: params, signal }),
  article: (slug: string, signal?: AbortSignal) =>
    apiData<Story>(`/articles/${encodeURIComponent(slug)}`, { signal }),
  builders: (signal?: AbortSignal) =>
    apiData<Builder[]>("/builders", { signal }),
  builder: (slug: string, signal?: AbortSignal) =>
    apiData<Builder>(`/builders/${encodeURIComponent(slug)}`, { signal }),
  startups: (signal?: AbortSignal) =>
    apiData<Startup[]>("/startups", { signal }),
  startup: (slug: string, signal?: AbortSignal) =>
    apiData<Startup>(`/startups/${encodeURIComponent(slug)}`, { signal }),
  opportunities: (signal?: AbortSignal) =>
    apiData<Opportunity[]>("/opportunities", { signal }),
  opportunity: (slug: string, signal?: AbortSignal) =>
    apiData<Opportunity>(`/opportunities/${encodeURIComponent(slug)}`, {
      signal,
    }),
  search: (q: string, signal?: AbortSignal) =>
    apiData<SearchResults>("/search", { query: { q }, signal }),
  // These contracts are intentionally explicit: unavailable endpoints show error/retry,
  // never fixture content or a fabricated success in API mode.
  videos: (signal?: AbortSignal) => apiData<Video[]>("/videos", { signal }),
  video: (id: string, signal?: AbortSignal) =>
    apiData<Video>(`/videos/${encodeURIComponent(id)}`, { signal }),
  events: (signal?: AbortSignal) =>
    apiData<PublicEvent[]>("/events", { signal }),
  subscribe: (
    email: string,
    edition?: string,
    key?: string,
    turnstileToken?: string,
  ) =>
    http("/newsletter/subscriptions", {
      method: "POST",
      headers: { "Idempotency-Key": key || crypto.randomUUID() },
      body: { email, turnstileToken, ...(edition ? { edition } : {}) },
    }),
  confirmSubscription: (token: string) =>
    http("/newsletter/confirm", { method: "POST", body: { token } }),
  unsubscribe: (token: string) =>
    http("/newsletter/unsubscribe", { method: "POST", body: { token } }),
};

export async function getStories(params?: {
  category?: string;
  page?: number;
  q?: string;
}): Promise<Story[]> {
  return (await publicApi.articles(params)).data;
}
export async function getArticle(slug: string): Promise<Story | null> {
  try {
    return await publicApi.article(slug);
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) return null;
    throw error;
  }
}
export const getSearch = (query: string) => publicApi.search(query);

/** Only safe web destinations can be rendered from CMS/API content. */
export function webUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}
