import Link from "next/link";
import { useRouter } from "next/router";
import { useEdition } from "@/context/EditionContext";
import { editionCredit } from "@/lib/editorial-policy";
import { useSyncExternalStore, useEffect, useRef, useId, useState } from "react";
import {
  readCookieChoice,
  saveCookieChoice,
  type CookieChoice,
} from "@/lib/cookie-consent";
import { cn } from "@/lib/utils";

// ─── External store sync ────────────────────────────────────────────────────

const subscribe = (notify: () => void) => {
  window.addEventListener("tb-cookie-choice-changed", notify);
  window.addEventListener("storage", notify);
  return () => {
    window.removeEventListener("tb-cookie-choice-changed", notify);
    window.removeEventListener("storage", notify);
  };
};
const snapshot = () => JSON.stringify(readCookieChoice());

function useChoice(): CookieChoice | null | undefined {
  const value = useSyncExternalStore(subscribe, snapshot, () => "");
  return value === "" ? undefined : JSON.parse(value);
}

// ─── Toggle switch ───────────────────────────────────────────────────────────

interface ToggleProps {
  id: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

function Toggle({ id, checked, disabled, onChange, label }: ToggleProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40",
        checked ? "bg-[var(--surface-inverse)]" : "bg-[var(--surface-skeleton)]",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

// ─── Category row ────────────────────────────────────────────────────────────

interface CategoryProps {
  id: string;
  title: string;
  description: string;
  always?: boolean;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function CategoryRow({ id, title, description, always, checked, onChange }: CategoryProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface-tint)] px-4 py-3.5">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--text-heading)]">
          {title}
          {always && (
            <span className="ml-2 rounded-full bg-[var(--surface-skeleton)] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-[var(--text-meta)]">
              Always on
            </span>
          )}
        </p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-[var(--text-meta)]">
          {description}
        </p>
      </div>
      <Toggle
        id={`toggle-${id}`}
        checked={checked}
        disabled={always}
        onChange={onChange}
        label={`${title} cookies`}
      />
    </div>
  );
}

// ─── CookieChoices (used on /cookies page) ──────────────────────────────────

export function CookieChoices() {
  const choice = useChoice();
  return (
    <div className="space-y-4">
      <p className="text-sm" role="status">
        {choice
          ? `Optional analytics are ${choice.analytics ? "enabled" : "disabled"}. You can change this at any time.`
          : "Optional analytics are disabled until you choose."}
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => saveCookieChoice(false)}
          className="min-h-11 rounded-lg border border-current px-5 font-semibold"
        >
          Essential only
        </button>
        <button
          type="button"
          onClick={() => saveCookieChoice(true)}
          className="min-h-11 rounded-lg border border-current px-5 font-semibold"
        >
          Allow analytics
        </button>
      </div>
    </div>
  );
}

// ─── Core modal dialog ───────────────────────────────────────────────────────

interface ConsentModalProps {
  isOpen: boolean;
  /** Called when the user has finished making a choice or dismisses (if already consented). */
  onClose: () => void;
  /** When true, the modal cannot be dismissed until a choice is made. */
  required?: boolean;
}

function ConsentModal({ isOpen, onClose, required = false }: ConsentModalProps) {
  const { edition } = useEdition();
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [analytics, setAnalytics] = useState(false);
  const [view, setView] = useState<"main" | "preferences">("main");

  // Sync toggle state with saved preference when the modal opens
  useEffect(() => {
    if (!isOpen) return;
    const existing = readCookieChoice();
    setAnalytics(existing?.analytics ?? false);
    setView("main");
  }, [isOpen]);

  // Scroll lock + focus trap + keyboard handling
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!required) onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [role="switch"]:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Move focus into dialog
    requestAnimationFrame(() => {
      dialogRef.current
        ?.querySelector<HTMLElement>("button, [role='switch']")
        ?.focus();
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose, required]);

  function acceptAll() {
    saveCookieChoice(true);
    onClose();
  }
  function rejectAll() {
    saveCookieChoice(false);
    onClose();
  }
  function savePreferences() {
    saveCookieChoice(analytics);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
      aria-modal="true"
    >
      {/* Backdrop – only clickable to close when not required */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[3px] transition-opacity"
        aria-hidden="true"
        onClick={required ? undefined : onClose}
      />

      {/* Dialog panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-labelledby={titleId}
        className="relative w-full max-w-[520px] overflow-hidden rounded-2xl bg-[var(--surface-card)] shadow-[0_32px_80px_rgba(0,0,0,0.28)] animate-in fade-in zoom-in-95 duration-300"
      >
        {/* Header */}
        <div className="border-b border-[var(--border)] px-6 pb-4 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-meta)]">
                Privacy &amp; Cookies
              </p>
              <h2
                id={titleId}
                className="font-display text-[22px] font-bold leading-[1.2] text-[var(--text-heading)]"
              >
                {view === "main" ? "Your privacy, your choice" : "Manage preferences"}
              </h2>
            </div>
            {/* Close button — only shown when not required (i.e. user already consented once) */}
            {!required && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--text-meta)] transition-colors hover:bg-[var(--surface-tint)] hover:text-[var(--text-heading)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {view === "main" ? (
            <>
              <p className="text-[14px] leading-[1.65] text-[var(--text-meta)]">
                The Builder {edition}, powered by{" "}
                <span className="font-medium text-[var(--text-body)]">{editionCredit(edition)}</span>,
                uses cookies to keep the site running, keep you signed in, and remember your edition.
                We also use optional first-party analytics to improve the experience — they stay off
                until you say yes.{" "}
                <Link
                  href="/cookies"
                  className="font-semibold text-[var(--text-heading)] underline underline-offset-2 hover:no-underline"
                >
                  Read our cookie notice
                </Link>
                .
              </p>

              {/* Primary CTA buttons */}
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={acceptAll}
                  className="flex-1 rounded-xl bg-[var(--surface-inverse)] px-5 py-3 text-[14px] font-semibold text-[var(--text-on-inverse)] transition-colors hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
                >
                  Accept all cookies
                </button>
                <button
                  type="button"
                  onClick={rejectAll}
                  className="flex-1 rounded-xl border border-[var(--border-emphasis)] px-5 py-3 text-[14px] font-semibold text-[var(--text-heading)] transition-colors hover:bg-[var(--surface-tint)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
                >
                  Essential only
                </button>
              </div>

              {/* Manage preferences link */}
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => setView("preferences")}
                  className="text-[13px] font-medium text-[var(--text-meta)] underline underline-offset-2 hover:text-[var(--text-body)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                >
                  Manage preferences
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mb-4 text-[13px] leading-relaxed text-[var(--text-meta)]">
                Choose which cookie categories you are happy with. Essential cookies cannot be
                disabled — they are required for the site to function.
              </p>

              <div className="space-y-2.5">
                <CategoryRow
                  id="essential"
                  title="Essential"
                  description="Sign-in, security, CSRF protection, and your selected edition. Strictly necessary."
                  always
                  checked={true}
                  onChange={() => {}}
                />
                <CategoryRow
                  id="analytics"
                  title="Analytics"
                  description="First-party, privacy-respecting analytics that help us understand which content you value. No data is sold or shared with third parties."
                  checked={analytics}
                  onChange={setAnalytics}
                />
              </div>

              {/* Save + back */}
              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={savePreferences}
                  className="flex-1 rounded-xl bg-[var(--surface-inverse)] px-5 py-3 text-[14px] font-semibold text-[var(--text-on-inverse)] transition-colors hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
                >
                  Save preferences
                </button>
                <button
                  type="button"
                  onClick={() => setView("main")}
                  className="rounded-xl border border-[var(--border-emphasis)] px-5 py-3 text-[14px] font-semibold text-[var(--text-heading)] transition-colors hover:bg-[var(--surface-tint)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
                >
                  Back
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer strip */}
        <div className="border-t border-[var(--border)] bg-[var(--surface-tint)] px-6 py-3 text-[12px] text-[var(--text-meta)]">
          Your choices are stored locally and apply for 180 days.{" "}
          <Link href="/cookies" className="underline underline-offset-2 hover:text-[var(--text-body)]">
            Cookie notice
          </Link>{" "}
          ·{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-[var(--text-body)]">
            Privacy policy
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Entry point for AppShell ────────────────────────────────────────────────

export function CookieConsentBanner() {
  const choice = useChoice();
  const router = useRouter();

  // Never show on the dedicated consent pages to avoid double UI
  const onConsentPage =
    router.pathname === "/cookies" ||
    (router.pathname === "/system" && router.query.state === "cookie");

  // undefined → SSR (skip). null → no choice yet → show modal required.
  const shouldShow = !onConsentPage && choice === null;

  return <ConsentModal isOpen={shouldShow} onClose={() => {}} required />;
}

// ─── Re-open hook — wire this into the Footer "Manage cookies" link ──────────

export function ManageCookiesButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        Manage cookies
      </button>
      <ConsentModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
