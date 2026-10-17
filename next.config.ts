import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import type { NextConfig } from "next";
import {
  validateBuildEnvironment,
  assertBuildIdentity,
} from "./scripts/release-environment.cjs";
import { PHASE_PRODUCTION_SERVER } from "next/constants";

const build = validateBuildEnvironment(process.env);

if (
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_DESIGN_PREVIEW === "true"
)
  throw new Error(
    "Design preview is development-only. Disable it for release builds.",
  );

const themeInit =
  readFileSync("pages/_document.tsx", "utf8").match(
    /const themeInit\s*=\s*`([^`]+)`/,
  )?.[1] || "";
const themeHash = createHash("sha256").update(themeInit).digest("base64");
const apiOrigin = new URL(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
).origin;

const nextConfig: NextConfig = {
  // Next.js 16 — React 19 compatible
  reactStrictMode: true,

  images: {
    // Explicit remote patterns (Next.js 16 — domains is deprecated)
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "api.thebuilderng.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },

  // Expose to browser (server-only vars go in process.env directly)
  env: {
    NEXT_PUBLIC_APP_NAME: "The Builder",
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1",
  },

  // Keep Turbopack scoped to this application. A separate lockfile exists in
  // the Windows user profile and must not influence dependency discovery.
  turbopack: {
    root: process.cwd(),
  },

  // Experimental features available in Next.js 16
  experimental: {
    // Optimise package imports to reduce bundle size
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  async headers() {
    const policy = [
      "default-src 'self'",
      "script-src 'self' 'sha256-" +
        themeHash +
        "' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://images.unsplash.com https://i.ytimg.com https://api.thebuilderng.com " +
        apiOrigin,
      "font-src 'self' data:",
      "connect-src 'self' " + apiOrigin + " https://challenges.cloudflare.com",
      "frame-src https://www.youtube-nocookie.com https://challenges.cloudflare.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          ...(build.release
            ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]
            : []),
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          ...(process.env.NODE_ENV === "production"
            ? [{ key: "Content-Security-Policy", value: policy }]
            : []),
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      {
        source: "/industries",
        destination: "/category/fintech",
        permanent: false,
      },
      {
        source: "/industries/:slug",
        destination: "/category/:slug",
        permanent: false,
      },
      { source: "/team", destination: "/about#team", permanent: false },
      { source: "/careers", destination: "/about#careers", permanent: false },
    ];
  },
};

export default function configuration(phase: string): NextConfig {
  if (phase === PHASE_PRODUCTION_SERVER) {
    const identity = JSON.parse(
      readFileSync(".next/builder-build.json", "utf8"),
    );
    const buildId = readFileSync(".next/BUILD_ID", "utf8").trim();
    const legalHash = createHash("sha256")
      .update(readFileSync("contracts/legal-content.json"))
      .digest("hex");
    assertBuildIdentity(process.env, identity, buildId, legalHash);
  }
  return nextConfig;
}
