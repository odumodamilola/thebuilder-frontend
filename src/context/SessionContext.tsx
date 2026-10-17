import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useRouter } from "next/router";
import { useApiResource } from "@/hooks/useApiResource";
import { http, HttpError, type ApiEnvelope } from "@/lib/http";
import { PageLoader, ResourceError } from "@/components/ui/ResourceState";
import type { AuthUser } from "@/features/account/api";
const Context = createContext<{ user: AuthUser | null; refresh: () => void }>({
  user: null,
  refresh: () => {},
});
export const useSession = () => useContext(Context);
export function SessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const session = useApiResource("session", async (signal) => {
    try {
      return (await http<ApiEnvelope<AuthUser>>("/me", { signal })).data;
    } catch (error) {
      if (error instanceof HttpError && error.status === 401) return null;
      throw error;
    }
  });
  const retrySession = session.retry;
  useEffect(() => {
    const refresh = () => retrySession();
    window.addEventListener("tb-session-changed", refresh);
    return () => window.removeEventListener("tb-session-changed", refresh);
  }, [retrySession]);
  const protectedPage =
    router.pathname === "/account" ||
    router.pathname === "/onboarding" ||
    router.pathname.startsWith("/console");
  const user = session.data || null;
  const privilegedPage = router.pathname.startsWith("/console");
  const redirect =
    !session.loading && !session.error && protectedPage
      ? !user
        ? "/signin?redirect=" + encodeURIComponent(router.asPath)
        : !user.emailVerified
          ? "/verify-email?email=" + encodeURIComponent(user.email)
          : privilegedPage && user.permissions.length > 0 && !user.mfaEnabled
            ? "/mfa-setup"
            : null
      : null;
  useEffect(() => {
    if (redirect) void router.replace(redirect);
  }, [redirect, router]);
  if (privilegedPage && user && user.permissions.length === 0)
    return (
      <ResourceError
        error={new HttpError(403, "You do not have access to this workspace.")}
        retry={session.retry}
      />
    );
  if (protectedPage && (session.loading || redirect))
    return <PageLoader label="Loading your account" />;
  if (protectedPage && session.error)
    return <ResourceError error={session.error} retry={session.retry} />;
  return (
    <Context.Provider value={{ user, refresh: session.retry }}>
      {children}
    </Context.Provider>
  );
}
