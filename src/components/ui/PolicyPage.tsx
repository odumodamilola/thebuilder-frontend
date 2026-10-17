import Head from "next/head";
import Link from "next/link";
import { useEdition } from "@/context/EditionContext";
import {
  policyForEdition,
  publisherForEdition,
  type PolicyKind,
} from "@/lib/legal-content";

export function PolicyPage({ kind }: { kind: PolicyKind }) {
  const { edition } = useEdition();
  const policy = policyForEdition(edition, kind);
  const publisher = publisherForEdition(edition);
  const approved = policy.status === "approved" && policy.sections.length > 0;
  return (
    <>
      <Head>
        <title>{policy.title} · The Builder</title>
        {!approved && <meta name="robots" content="noindex" />}
      </Head>
      <main className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--text-accent)]">
          The Builder {edition}
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-[var(--text-heading)] md:text-6xl">
          {policy.title}
        </h1>
        <p className="mt-4 text-sm text-[var(--text-meta)]">{publisher.name}</p>
        <div className="mt-8 space-y-7 font-serif text-lg leading-8 text-[var(--text-body)]">
          {approved ? (
            <>
              <p>
                Version {policy.version} · Effective{" "}
                {new Date(policy.approvedAt).toISOString().slice(0, 10)}
              </p>
              {policy.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24"
                >
                  <h2 className="font-display text-2xl font-bold text-[var(--text-heading)]">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={index} className="mt-3">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </>
          ) : (
            <p>This policy is awaiting publication by {publisher.name}.</p>
          )}
          {publisher.contactEmail && (
            <p>
              Contact:{" "}
              <a
                className="text-[var(--text-accent)] underline"
                href={"mailto:" + publisher.contactEmail}
              >
                {publisher.contactEmail}
              </a>
            </p>
          )}
          <Link href="/" className="text-[var(--text-accent)] underline">
            Back to The Builder
          </Link>
        </div>
      </main>
    </>
  );
}
