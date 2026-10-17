import { usePublicData } from "@/context/PublicDataContext";
import Link from "next/link";
import SectionTitle from "../ui/SectionTitle";

export default function HomeMostRead({ loading }: { loading?: boolean }) {
  const records = usePublicData()?.home?.mostRead;
  const mostRead = records?.map((s) => s.title) || [
    "From the Mountains of Tigray to an Australian Record",
    "Q3 2026: where African venture money went",
    "From Sudan to the Mayor's Office",
    "The engineers who stayed",
    "Selling More Than Food",
    "Why Kora Health bet on insurers before patients",
  ];

  return (
    <section className="max-w-container mx-auto px-4 md:px-6 py-section-mobile md:py-section">
      <SectionTitle className="mb-8">Most read</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
        {mostRead.map((title, i) => (
          <div
            key={i}
            className="flex gap-4 group cursor-pointer border-b border-[var(--border)] pb-4 last:border-0 lg:last:border-b lg:[&:nth-last-child(2)]:border-0 lg:[&:nth-last-child(3)]:border-0"
          >
            <span className="font-display font-bold text-2xl text-[var(--text-accent)] opacity-80 leading-none group-hover:opacity-100 transition-opacity">
              0{i + 1}
            </span>
            <h4 className="font-display font-bold text-[var(--text-heading)] group-hover:text-[var(--text-accent)] transition-colors text-[16px] leading-snug">
              <Link
                href={
                  records?.[i]?.slug
                    ? `/stories/${records[i]!.slug}`
                    : "/stories"
                }
              >
                {title}
              </Link>
            </h4>
          </div>
        ))}
      </div>
    </section>
  );
}
