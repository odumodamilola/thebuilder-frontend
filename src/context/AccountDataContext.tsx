import { createContext, useContext, type ReactNode } from "react";
import { useRouter } from "next/router";
import { useSession } from "./SessionContext";
import { useApiResource } from "@/hooks/useApiResource";
import { http, type ApiEnvelope } from "@/lib/http";
import type { Story } from "@/lib/types";
import { PageLoader, ResourceError } from "@/components/ui/ResourceState";
export interface AccountData {
  meta?: import("@/components/ui/Pagination").PaginationMeta;
  stories: Story[];
  profile: Record<string, unknown>;
  retry: () => void;
}
const Context = createContext<AccountData>({
  stories: [],
  profile: {},
  retry: () => {},
});
export const useAccountData = () => useContext(Context);
export function AccountDataProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user } = useSession();
  const view = String(router.query.state || "feed").split("-")[0];
  const resource = useApiResource(
    user
      ? "account:" + view + ":" + user.id + ":" + String(router.query.page || 1)
      : null,
    async (signal) => {
      const profile = await http<
        ApiEnvelope<{ profile: Record<string, unknown> }>
      >("/me/profile", { signal });
      const path =
        view === "saved"
          ? "/me/bookmarks"
          : view === "recent"
            ? "/me/recent"
            : "/me/feed";
      const records = ["feed", "saved", "recent"].includes(view || "")
        ? await http<ApiEnvelope<Story[]>>(path, {
            signal,
            query: { page: Number(router.query.page || 1) },
          })
        : { data: [], meta: undefined };
      return {
        profile: profile.data.profile || {},
        stories: records.data,
        meta: records.meta as AccountData["meta"],
      };
    },
  );
  if (resource.loading) return <PageLoader label="Loading account" />;
  if (resource.error)
    return <ResourceError error={resource.error} retry={resource.retry} />;
  return (
    <Context.Provider
      value={{
        meta: resource.data?.meta,
        profile: resource.data?.profile || {},
        stories: resource.data?.stories || [],
        retry: resource.retry,
      }}
    >
      {children}
    </Context.Provider>
  );
}
