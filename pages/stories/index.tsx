import { useRouter } from "next/router";
import {
  StoriesPage,
  type PageState,
} from "@/features/editorial/EditorialPages";
const states: PageState[] = [
  "default",
  "loading",
  "empty",
  "error",
  "subcategory",
  "empty-tab",
  "sponsored",
  "comments-soon",
  "404",
];
export default function StoriesRoute() {
  const { query } = useRouter();
  const requested =
    process.env.NEXT_PUBLIC_DESIGN_PREVIEW === "true"
      ? String(query.state || "default")
      : "default";
  return (
    <StoriesPage
      state={
        states.includes(requested as PageState)
          ? (requested as PageState)
          : "default"
      }
    />
  );
}

import { publicPageProps } from "@/lib/public-ssr";
export const getServerSideProps = publicPageProps("/stories");
