import type { ReactNode } from "react";

export function Field({
  label,
  error,
  hint,
  optional,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm font-semibold text-[var(--text-body)]">
      <span className="flex justify-between">
        {label}
        {optional && (
          <span className="font-normal text-[var(--text-meta)]">
            (optional)
          </span>
        )}
      </span>
      {children}
      {hint && !error && (
        <span className="font-normal text-[13px] text-[var(--text-meta)]">
          {hint}
        </span>
      )}
      {error && (
        <span
          role="alert"
          className="font-normal text-[13px] text-[var(--text-error)]"
        >
          {error}
        </span>
      )}
    </label>
  );
}

export const control =
  "min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-card)] px-3 py-2 text-[15px] font-normal text-[var(--text-body)] outline-none transition focus:border-[var(--focus-ring)] focus:ring-1 focus:ring-[var(--focus-ring)] placeholder:text-[var(--text-meta)]";
export const primary =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--text-on-inverse)] transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50";
export const accent =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--text-on-inverse)] transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50";
export const secondary =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-card)] px-5 py-2.5 text-sm font-semibold text-[var(--text-heading)] transition hover:bg-[var(--surface-tint)]";
