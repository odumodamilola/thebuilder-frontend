import Link from "next/link";
import { useRouter } from "next/router";
import { usePublicData } from "@/context/PublicDataContext";

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
};
export function Pagination({ meta }: { meta?: PaginationMeta }) {
  const router = useRouter();
  if (!meta || meta.last_page <= 1) return null;
  return (
    <nav
      aria-label="Pagination"
      className="mx-auto mt-8 flex max-w-container items-center justify-center gap-5 px-4 py-5 text-sm"
    >
      {meta.current_page > 1 && (
        <Link
          className="inline-flex min-h-11 items-center rounded-lg border border-[var(--border)] px-4"
          href={{
            pathname: router.pathname,
            query: { ...router.query, page: meta.current_page - 1 },
          }}
        >
          Previous
        </Link>
      )}
      <span>
        Page {meta.current_page} of {meta.last_page}
      </span>
      {meta.current_page < meta.last_page && (
        <Link
          className="inline-flex min-h-11 items-center rounded-lg border border-[var(--border)] px-4"
          href={{
            pathname: router.pathname,
            query: { ...router.query, page: meta.current_page + 1 },
          }}
        >
          Next
        </Link>
      )}
    </nav>
  );
}
export function PublicPagination() {
  return <Pagination meta={usePublicData()?.meta} />;
}
