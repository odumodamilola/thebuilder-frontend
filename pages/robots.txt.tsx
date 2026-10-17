import type { GetServerSideProps } from "next";

export default function Robots() {
  return null;
}
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300");
  res.end(
    "User-agent: *\nAllow: /\nDisallow: /console\nDisallow: /account\nDisallow: /onboarding\nDisallow: /reset-password\nSitemap: " +
      (process.env.NEXT_PUBLIC_APP_URL || "https://thebuilderng.com") +
      "/sitemap.xml\n",
  );
  return { props: {} };
};
