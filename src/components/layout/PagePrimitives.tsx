import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return <Tag className={cn("tb-container", className)}>{children}</Tag>;
}

export function PageSection({
  children,
  className,
  labelledBy,
}: {
  children: React.ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn("tb-section", className)}
    >
      {children}
    </section>
  );
}

export function PageIntro({
  eyebrow,
  title,
  summary,
  id,
}: {
  eyebrow?: string;
  title: string;
  summary?: string;
  id?: string;
}) {
  return (
    <header className="max-w-article-head">
      {eyebrow && (
        <p className="mb-3 font-ui text-kicker font-bold uppercase text-[var(--text-accent)]">
          {eyebrow}
        </p>
      )}
      <h1
        id={id}
        className="font-display text-[32px] font-extrabold leading-[38px] tracking-heading text-text-heading md:text-h1"
      >
        {title}
      </h1>
      {summary && (
        <p className="mt-5 max-w-[68ch] font-serif text-body text-text-meta">
          {summary}
        </p>
      )}
    </header>
  );
}

export function StatePanel({
  title,
  description,
  action,
  tone = "neutral",
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  tone?: "neutral" | "error";
}) {
  return (
    <section
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-lg border bg-surface-card p-8 text-center",
        tone === "error" &&
          "border-[color:color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[var(--surface-accent-soft)]",
      )}
    >
      <h2 className="font-display text-h3 font-bold text-text-heading">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-2 max-w-[56ch] text-meta text-text-meta">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </section>
  );
}
