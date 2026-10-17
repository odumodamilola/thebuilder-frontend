import Script from "next/script";
import { useEffect, useRef, useState } from "react";
interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  remove: (id: string) => void;
}
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}
export function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const container = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    callback.current = onToken;
  }, [onToken]);
  useEffect(() => {
    if (!ready || !sitekey || !container.current || !window.turnstile) return;
    const id = window.turnstile.render(container.current, {
      sitekey,
      callback: (token) => callback.current(token),
      "expired-callback": () => callback.current(""),
      "error-callback": () => callback.current(""),
    });
    return () => window.turnstile?.remove(id);
  }, [ready, sitekey]);
  if (!sitekey)
    return process.env.NODE_ENV === "production" ? (
      <p role="alert" className="text-sm text-[var(--text-error)]">
        Submission verification is temporarily unavailable.
      </p>
    ) : null;
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onLoad={() => setReady(true)}
        onReady={() => setReady(true)}
      />
      <div ref={container} />
    </>
  );
}
