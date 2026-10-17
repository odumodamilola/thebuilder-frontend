import { usePublicData } from "@/context/PublicDataContext";
import SectionTitle from "../ui/SectionTitle";
import BuilderCard from "../cards/BuilderCard";
import Link from "next/link";
import { useState } from "react";
import { homeBuilders } from "@/lib/home-builders";
import type { Edition } from "@/lib/types";
import { focusRegions } from "@/lib/editorial-policy";
import { diasporaRegions, focusRegionPages } from "@/lib/diaspora";
import { useApiResource } from "@/hooks/useApiResource";
import { http, type ApiEnvelope } from "@/lib/http";
import type { Builder } from "@/lib/types";
import { Skeleton } from "../ui/Skeleton";

export default function HomeDiaspora({
  loading,
  edition,
}: {
  loading?: boolean;
  edition: Edition;
}) {
  const [selection, setSelection] = useState<{
    edition: Edition;
    region: string;
  } | null>(null);
  const activeRegion =
    selection?.edition === edition
      ? selection.region
      : edition === "Australia"
        ? "Australia"
        : "UK";
  const content = usePublicData()?.home;
  const location = diasporaRegions[focusRegionPages[activeRegion]!]!;
  const resource = useApiResource(
    content ? "home-region-" + activeRegion : null,
    (signal) =>
      http<ApiEnvelope<Builder[]>>("/builders", {
        signal,
        query: {
          per_page: 4,
          ...(activeRegion === "Africa" ? {} : { diaspora: 1 }),
          ...(location.country
            ? { country: location.country }
            : { region: location.region }),
        },
      }),
  );
  const builders = content
    ? (resource.data?.data ??
      content.builders.filter(
        (b) =>
          b.country === activeRegion ||
          (activeRegion === "UK" && b.country === "United Kingdom"),
      ))
    : (homeBuilders[activeRegion] ?? []);

  return (
    <section className="py-section-mobile md:py-section">
      <div className="max-w-container mx-auto px-4 md:px-6">
        <div className="mb-6 flex items-end justify-between gap-6">
          <SectionTitle>Builders Beyond Borders.</SectionTitle>
          <Link
            href="/diaspora"
            className="hidden text-sm font-semibold text-[var(--text-heading)] md:block"
          >
            Explore the Diaspora hub →
          </Link>
        </div>
        <div className="flex gap-4 border-b border-[var(--border)] overflow-x-auto pb-0 scrollbar-hide">
          {focusRegions.map((region) => (
            <button
              type="button"
              aria-pressed={activeRegion === region}
              aria-controls="home-region-profiles"
              onClick={() => setSelection({ edition, region })}
              key={region}
              className={`min-h-11 whitespace-nowrap px-0 mr-5 py-2 font-medium text-sm transition-colors ${activeRegion === region ? "text-[var(--text-heading)] border-b-2 border-[var(--accent)] -mb-[1px]" : "text-[var(--text-meta)] hover:text-[var(--text-heading)]"}`}
            >
              {region}
            </button>
          ))}
        </div>
        <div
          id="home-region-profiles"
          aria-label={`Builders in ${activeRegion}`}
          aria-live="polite"
          aria-busy={loading || resource.loading}
          className="grid grid-cols-2 lg:grid-cols-4 gap-x-[16px] gap-y-[24px] md:gap-x-[24px] md:gap-y-[32px] mt-[32px]"
        >
          {resource.loading ? (
            Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} aspectRatio="4/5" radius="lg" />
            ))
          ) : resource.error ? (
            <div className="col-span-full text-sm text-[var(--text-meta)]">
              <p>We couldn’t load these Builders.</p>
              <button
                type="button"
                className="mt-2 min-h-11 underline"
                onClick={resource.retry}
              >
                Try again
              </button>
            </div>
          ) : builders.length === 0 ? (
            <p className="col-span-full text-sm text-[var(--text-meta)]">
              No published Builders for this region yet.
            </p>
          ) : (
            builders.map((b, i) => <BuilderCard key={i} builder={b} />)
          )}
        </div>
        <Link
          href="/diaspora"
          className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold md:hidden"
        >
          Explore the Diaspora hub →
        </Link>
      </div>
    </section>
  );
}
