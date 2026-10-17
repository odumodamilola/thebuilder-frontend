"use client";
import { useIdempotencyKey } from "@/hooks/useIdempotencyKey";
import { publicApi } from "@/lib/api";
import { Turnstile } from "@/components/ui/Turnstile";
import { useEdition } from "@/context/EditionContext";

import { useState } from "react";
import type { FormEvent } from "react";

type SubscribeState = "idle" | "loading" | "success" | "error";

interface NewsletterFormProps {
  state?: SubscribeState;
  inverse?: boolean;
  compact?: boolean;
}

export function NewsletterForm({
  state = "idle",
  inverse = false,
  compact = false,
}: NewsletterFormProps) {
  const requestKey = useIdempotencyKey();
  const [turnstileToken, setTurnstileToken] = useState("");
  const [formState, setFormState] = useState<SubscribeState>(state);
  const [email, setEmail] = useState("");
  const { edition } = useEdition();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setFormState("loading");
    try {
      await publicApi.subscribe(
        email,
        edition,
        requestKey({ email, edition }),
        turnstileToken,
      );
      setFormState("success");
    } catch {
      setFormState("error");
    }
  }

  if (formState === "success") {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-card)]">
        <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--text-on-inverse)] flex items-center justify-center shrink-0">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="flex flex-col">
          <p
            role="status"
            className="font-display font-bold text-[15px] text-[var(--text-heading)] m-0"
          >
            Check your inbox to confirm your subscription.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-md ${compact ? "flex flex-col gap-3" : ""}`}
    >
      <div className="flex w-full relative">
        <input
          type="email"
          aria-label="Email address"
          required
          placeholder="Your email address"
          className={`w-full h-14 pl-4 pr-[120px] rounded-lg border ${
            inverse
              ? "bg-[color:color-mix(in_srgb,var(--text-on-inverse)_10%,transparent)] border-[color:color-mix(in_srgb,var(--text-on-inverse)_20%,transparent)] text-[var(--text-on-inverse)] placeholder-[color:color-mix(in_srgb,var(--text-on-inverse)_50%,transparent)] focus:border-[var(--text-on-inverse)] focus:ring-[var(--text-on-inverse)]"
              : "bg-[var(--surface-card)] border-[var(--border)] text-[var(--text-body)] focus:border-[var(--focus-ring)] focus:ring-[var(--focus-ring)]"
          } text-[15px] focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={formState === "loading"}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-6 rounded-[6px] font-medium text-[15px] bg-[var(--accent)] text-[var(--text-on-inverse)] hover:bg-[var(--accent-hover)] transition-colors flex items-center justify-center min-w-[100px]"
        >
          {formState === "loading" ? (
            <div className="w-5 h-5 border-2 border-[color:color-mix(in_srgb,var(--text-on-inverse)_30%,transparent)] border-t-[var(--text-on-inverse)] rounded-full animate-spin" />
          ) : (
            "Subscribe"
          )}
        </button>
      </div>
      <Turnstile onToken={setTurnstileToken} />
      {formState === "error" && (
        <p
          role="alert"
          className="text-sm text-[var(--text-accent)] mt-2 block"
        >
          Something went wrong on our side. Try again.
        </p>
      )}
    </form>
  );
}
