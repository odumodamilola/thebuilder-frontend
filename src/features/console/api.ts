import { http } from '@/lib/http'

export type ConsoleStatus = 'draft' | 'review' | 'changes' | 'approved' | 'scheduled' | 'published' | 'archived'
export interface ConsoleStory { id:string; title:string; author:string; category:string; status:ConsoleStatus; updatedAt:string }
export interface ConsoleDashboard { users:number; newUsers:number; published:number; review:number; nominations:number; subscribers:number }
export interface ConsoleMutation<T> { data:T; message:string }

// Laravel-facing seam. Screens use deterministic fixtures until these endpoints are enabled.
export const consoleApi = {
  dashboard: () => http<ConsoleDashboard>('/console/dashboard'),
  stories: (query = '') => http<ConsoleStory[]>('/console/content', { query: { query } }),
  saveStory: (id:string, body:Partial<ConsoleStory>) => http<ConsoleMutation<ConsoleStory>>(`/console/content/${id}`, { method:'PATCH', body }),
  publishHomepage: (sections:unknown[]) => http<ConsoleMutation<unknown[]>>('/console/homepage', { method:'PUT', body: { sections } }),
  saveProfile: (kind:'builders'|'startups', id:string, body:Record<string, unknown>) => http<ConsoleMutation<unknown>>(`/console/${kind}/${id}`, { method:'PUT', body }),
  moveNomination: (id:string, status:string) => http<ConsoleMutation<unknown>>(`/console/nominations/${id}`, { method:'PATCH', body: { status } }),
}
