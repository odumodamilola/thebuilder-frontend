import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useRouter } from "next/router";
import { useApiResource } from "@/hooks/useApiResource";
import { http, HttpError, type ApiEnvelope } from "@/lib/http";
import { PageLoader, ResourceError } from "@/components/ui/ResourceState";
export type ConsoleRecord = Record<string, unknown> & {
  id?: string;
  title?: string;
  name?: string;
  status?: string;
  version?: number;
  summary?: string;
  body?: string;
};
export interface ConsoleData {
  records: ConsoleRecord[];
  document: Record<string, unknown>;
  record?: ConsoleRecord;
  meta?: Record<string, number>;
  retry: () => void;
}
const Context = createContext<ConsoleData | null>(null);
export const useConsoleData = () => useContext(Context);
export const text = (record: ConsoleRecord | undefined, key: string) =>
  String(record?.[key] ?? "");
export function ConsoleDataProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const active =
    router.pathname.startsWith("/console") &&
    router.pathname !== "/console/states" &&
    process.env.NEXT_PUBLIC_DESIGN_PREVIEW !== "true";
  const section = router.pathname.split("/")[2] || "dashboard";
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const path =
    section === "editor"
      ? id
        ? "/console/content/" + encodeURIComponent(id)
        : null
      : "/console/" + section;
  const key = JSON.stringify([path, router.query]);
  const result = useApiResource(active ? key : null, async (signal) => {
    if (!path) return { data: null };
    return http<ApiEnvelope<unknown>>(path, {
      signal,
      query: {
        q: String(router.query.q || ""),
        page: Number(router.query.page || 1),
        ...(section === "content"
          ? {
              status: String(router.query.status || ""),
              edition: String(router.query.edition || ""),
            }
          : {}),
      },
    });
  });
  useEffect(() => {
    if (!(result.error instanceof HttpError)) return;
    if (result.error.status === 401)
      window.dispatchEvent(new Event("tb-session-changed"));
    if (result.error.status === 403 && result.error.message === "mfa_required")
      void router.replace("/mfa?redirect=" + encodeURIComponent(router.asPath));
  }, [result.error, router]);
  if (!active) return <>{children}</>;
  if (result.loading) return <PageLoader label="Loading workspace" />;
  if (result.error)
    return <ResourceError error={result.error} retry={result.retry} />;
  const raw = result.data?.data;
  const records = Array.isArray(raw) ? (raw as ConsoleRecord[]) : [];
  const document =
    raw && !Array.isArray(raw) && typeof raw === "object"
      ? (raw as Record<string, unknown>)
      : {};
  return (
    <Context.Provider
      value={{
        records,
        document,
        record:
          section === "editor" && raw ? (document as ConsoleRecord) : undefined,
        meta: (result.data?.meta ||
          (result.data?.current_page
            ? {
                current_page: result.data.current_page,
                last_page: result.data.last_page,
                total: result.data.total,
                per_page: result.data.per_page,
              }
            : undefined)) as Record<string, number> | undefined,
        retry: result.retry,
      }}
    >
      {children}
    </Context.Provider>
  );
}
