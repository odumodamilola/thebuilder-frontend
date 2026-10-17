import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEdition } from "./EditionContext";
import {
  loadPublicData,
  emptyPublicData,
  isPublicDataRoute,
  type PublicData,
} from "@/lib/public-data";
import { HttpError } from "@/lib/http";
import { storyRedirect } from "@/lib/story-redirect";
import { PageLoader, ResourceError } from "@/components/ui/ResourceState";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { useSiteSettings } from "./SiteSettingsContext";

const Context = createContext<PublicData | null>(null);
export const usePublicData = () => useContext(Context);
export function PublicDataProvider({
  children,
  initial,
  initialKey,
  initialError,
}: {
  children: ReactNode;
  initial?: PublicData;
  initialKey?: string;
  initialError?: { status: number; message: string };
}) {
  const router = useRouter();
  const { siteName } = useSiteSettings();
  const { edition } = useEdition();
  const active =
    isPublicDataRoute(router.pathname) &&
    process.env.NEXT_PUBLIC_DESIGN_PREVIEW !== "true";
  const key = JSON.stringify([router.pathname, router.query, edition]);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{
    key: string;
    data?: PublicData;
    error?: unknown;
    loading: boolean;
  }>({
    key: initialKey || key,
    data: initial,
    error: initialError
      ? new HttpError(initialError.status, initialError.message)
      : undefined,
    loading: !initial && !initialError,
  });
  const [navigating, setNavigating] = useState(false);
  useEffect(() => {
    const start = () => setNavigating(true);
    const end = () => setNavigating(false);
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);
    };
  }, [router.events]);
  useEffect(() => {
    if (!active) return;
    if (key === initialKey && attempt === 0) {
      setState({
        key,
        data: initial,
        error: initialError
          ? new HttpError(initialError.status, initialError.message)
          : undefined,
        loading: false,
      });
      return;
    }
    const controller = new AbortController();
    setState({ key, loading: true });
    loadPublicData(
      router.pathname,
      router.query,
      edition,
      controller.signal,
    ).then(
      (data) => {
        if (!controller.signal.aborted) setState({ key, data, loading: false });
      },
      (error) => {
        const destination = storyRedirect(error);
        if (!controller.signal.aborted && destination) {
          void router.replace(destination);
          return;
        }
        if (!controller.signal.aborted)
          setState({ key, error, loading: false });
      },
    );
    return () => controller.abort();
  }, [
    key,
    attempt,
    active,
    initial,
    initialError,
    initialKey,
    router,
    router.pathname,
    router.query,
    edition,
  ]);
  if (!active) return <>{children}</>;
  const loading = state.key !== key || state.loading;
  const data = state.data || emptyPublicData;
  const content =
    data.article ||
    data.builders[0] ||
    data.startups[0] ||
    data.opportunities[0];
  const title = content && ("title" in content ? content.title : content.name);
  return (
    <Context.Provider value={data}>
      {title && (
        <Head>
          <title>
            {title} · {siteName}
          </title>
          <meta property="og:title" content={title} />
          {data.article?.summary && (
            <>
              <meta name="description" content={data.article.summary} />
              <meta property="og:description" content={data.article.summary} />
            </>
          )}
        </Head>
      )}
      {navigating && (
        <div className="fixed right-5 top-5 z-50 rounded-lg bg-[var(--surface-inverse)] px-4 py-3 text-[var(--text-on-inverse)]">
          <LoadingDots label="Loading page" />
        </div>
      )}
      {loading ? (
        <PageLoader
          kind={
            router.pathname === "/"
              ? "home"
              : router.pathname.includes("[slug]")
                ? "article"
                : /builders|startups/.test(router.pathname)
                  ? "directory"
                  : "stories"
          }
        />
      ) : state.error ? (
        <ResourceError
          error={state.error}
          retry={() => setAttempt((x) => x + 1)}
        />
      ) : (
        children
      )}
    </Context.Provider>
  );
}
