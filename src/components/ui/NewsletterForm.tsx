"use client";
import { useIdempotencyKey } from "@/hooks/useIdempotencyKey";
import { publicApi } from "@/lib/api";
import { Turnstile } from "@/components/ui/Turnstile";
import { useEdition } from "@/context/EditionContext";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export default function NewsletterForm({ className }: { className?: string }) {
  const requestKey = useIdempotencyKey();
  const { edition } = useEdition();
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [email, setEmail] = useState("");
  const emailId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await publicApi.subscribe(
        email,
        edition,
        requestKey({ email, edition }),
        turnstileToken,
      );
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="text-sm font-medium text-[var(--text-on-inverse)]"
      >
        <span aria-hidden="true">✓ </span>Thanks for subscribing! Check your
        inbox to confirm.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-2", className)}
    >
      <div className="flex gap-2">
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email address"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-describedby={status === "error" ? `${emailId}-error` : undefined}
          className="min-h-12 min-w-0 flex-1 rounded-control border border-[var(--border-inverse)] bg-[color:color-mix(in_srgb,var(--text-on-inverse)_5%,transparent)] px-4 py-3 text-sm text-[var(--text-on-inverse)] placeholder:text-[var(--text-meta-on-inverse)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--surface-inverse)]"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="min-h-12 bg-[var(--accent)] text-[var(--text-on-inverse)] px-6 py-3 rounded-control text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      <Turnstile onToken={setTurnstileToken} />
      {status === "error" && (
        <div
          id={`${emailId}-error`}
          role="alert"
          className="rounded-md bg-[var(--surface-accent-soft)] p-3 text-sm text-[var(--text-error)]"
        >
          <span aria-hidden="true">! </span>Subscription failed. Please try
          again.
        </div>
      )}
      <p className="text-xs text-[var(--text-meta-on-inverse)]">
        Weekly, every Friday. Unsubscribe any time.
      </p>
    </form>
  );
}
