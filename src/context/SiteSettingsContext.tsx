import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Head from "next/head";
import { http, type ApiEnvelope } from "@/lib/http";
import { normalizeSiteSettings } from "@/lib/site-settings";

const Context = createContext(normalizeSiteSettings(undefined));
export const useSiteSettings = () => useContext(Context);
export function SiteSettingsProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial?: unknown;
}) {
  const [settings, setSettings] = useState(() =>
    normalizeSiteSettings(initial),
  );
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const refresh = () => setAttempt((value) => value + 1);
    window.addEventListener("tb-settings-changed", refresh);
    return () => window.removeEventListener("tb-settings-changed", refresh);
  }, []);
  useEffect(() => {
    if (initial && attempt === 0) {
      return;
    }
    const controller = new AbortController();
    http<ApiEnvelope<unknown>>("/settings/public", {
      signal: controller.signal,
    })
      .then((response) => {
        if (!controller.signal.aborted)
          setSettings(normalizeSiteSettings(response.data));
      })
      .catch(() => {
        /* Keep approved defaults or the last known configuration during an outage. */
      });
    return () => controller.abort();
  }, [initial, attempt]);
  return (
    <Context.Provider value={settings}>
      <Head>
        <title>{settings.siteName}</title>
        <meta name="description" content={settings.description} />
      </Head>
      {children}
    </Context.Provider>
  );
}
