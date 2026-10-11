import { Story, Builder, Startup, Opportunity } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.data !== undefined ? data.data : data;
}

export async function getStories(params?: { category?: string; page?: number; q?: string }): Promise<Story[]> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.q) searchParams.set('q', params.q);
  
  const qs = searchParams.toString();
  return fetchApi<Story[]>(`/articles${qs ? `?${qs}` : ''}`);
}

export async function getArticle(slug: string): Promise<Story | null> {
  try {
    return await fetchApi<Story>(`/articles/${slug}`);
  } catch (error) {
    return null;
  }
}

export async function getSearch(query: string, type?: string): Promise<{
  stories: Story[];
  builders: Builder[];
  startups: Startup[];
  opportunities: Opportunity[];
}> {
  const searchParams = new URLSearchParams({ q: query });
  if (type) searchParams.set('type', type);
  return fetchApi(`/search?${searchParams.toString()}`);
}
