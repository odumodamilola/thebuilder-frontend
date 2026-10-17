import Link from "next/link";
import { errorMessage, HttpError } from "@/lib/http";
import { Skeleton } from "./Skeleton";

export function PageLoader({
  kind = "stories",
  label = "Loading content",
}: {
  kind?: "stories" | "directory" | "article" | "home";
  label?: string;
}) {
  return (
    <section
      role="status"
      aria-busy="true"
      aria-label={label}
      className="mx-auto w-full max-w-container px-4 py-10 md:px-6"
    >
      <span className="sr-only">{label}</span>
      {kind === "home" ? (
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
          <Skeleton aspectRatio="16 / 10" radius="lg" />
          <div className="grid gap-6">
            {[0, 1].map((i) => (
              <div key={i} className="grid grid-cols-[1fr_2fr] gap-5">
                <Skeleton aspectRatio="3 / 2" />
                <Skeleton lines={3} />
              </div>
            ))}
          </div>
        </div>
      ) : kind === "article" ? (
        <div className="mx-auto flex max-w-[760px] flex-col items-center gap-5">
          <Skeleton width={96} height={14} />
          <Skeleton lines={3} height={40} />
          <Skeleton aspectRatio="16 / 9" radius="lg" />
          <Skeleton lines={5} />
        </div>
      ) : kind === "directory" ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton aspectRatio="4 / 5" radius="lg" />
              <Skeleton lines={3} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <Skeleton aspectRatio="16 / 7" radius="lg" />
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_2fr] gap-5 border-t border-[var(--border)] pt-6"
            >
              <Skeleton aspectRatio="3 / 2" radius="lg" />
              <Skeleton lines={3} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function ResourceError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const missing = error instanceof HttpError && error.status === 404;
  return (
    <section role="alert" className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-extrabold text-[var(--text-heading)]">
        {missing
          ? "This page could not be found"
          : "We couldn’t load this content"}
      </h1>
      <p className="mt-4 text-[var(--text-meta)]">
        {missing
          ? "It may have moved or is no longer available."
          : errorMessage(error)}
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <button
          type="button"
          onClick={retry}
          className="min-h-11 rounded-lg bg-[var(--surface-inverse)] px-5 font-semibold text-[var(--text-on-inverse)]"
        >
          Try again
        </button>
        <Link href="/" className="inline-flex min-h-11 items-center px-4">
          Go to homepage
        </Link>
      </div>
    </section>
  );
}

export function EmptyState({
  title = "Nothing here yet",
  copy = "Check back soon for new updates.",
}: {
  title?: string;
  copy?: string;
}) {
  return (
    <section className="px-4 py-16 text-center">
      <h2 className="font-display text-2xl font-bold text-[var(--text-heading)]">
        {title}
      </h2>
      <p className="mt-3 text-[var(--text-meta)]">{copy}</p>
    </section>
  );
}
