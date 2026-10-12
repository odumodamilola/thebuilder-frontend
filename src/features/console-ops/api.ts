import { http } from '@/lib/http';

export type ConsoleMutation<T> = { data: T; savedAt: string };

export const consoleOpsApi = {
  list: <T>(resource: string) => http<T>(`/console/${resource}`),
  save: <T>(resource: string, payload: unknown) => http<ConsoleMutation<T>>(`/console/${resource}`, {
    method: 'PUT', body: payload as Record<string, unknown>,
  }),
};
