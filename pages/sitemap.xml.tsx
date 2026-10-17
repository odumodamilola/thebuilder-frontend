import type { GetServerSideProps } from "next";
import { API_URL } from "@/lib/http";
import { publicSsrHeaders } from "@/lib/public-server";

export default function Sitemap() {
  return null;
}
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const upstream = await fetch(API_URL.replace(/\/$/, "") + "/sitemap.xml", {
      headers: publicSsrHeaders(
        new URL(API_URL.replace(/\/$/, "") + "/sitemap.xml"),
      ),
      credentials: "omit",
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!upstream.ok) throw new Error("Sitemap unavailable");
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300");
    res.write(await upstream.text());
    res.end();
  } catch {
    res.statusCode = 503;
    res.setHeader("Retry-After", "300");
    res.end("Sitemap temporarily unavailable.");
  }
  return { props: {} };
};
