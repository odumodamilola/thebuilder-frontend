import { createHmac } from "node:crypto";
import { API_URL, buildApiUrl, http, type RequestOptions } from "./http";

// Imported only by getServerSideProps. Never pass these headers through page props.
const cache = new Map<string, { expires: number; json: string }>();
let cacheBytes = 0;
const inFlight = new Map<string, Promise<unknown>>();
const MAX_ENTRIES = 256;
const MAX_BYTES = 8 * 1024 * 1024;
const listPaths = new Set([
  "/home",
  "/articles",
  "/builders",
  "/startups",
  "/opportunities",
  "/videos",
  "/categories",
  "/tags",
]);

export function publicSsrHeaders(url: URL): Record<string, string> {
  if (
    !/^\/api\/v1\/(?:home|articles(?:\/[\p{L}\p{N}\p{M}_-]+)?|builders(?:\/[\p{L}\p{N}\p{M}_-]+)?|startups(?:\/[\p{L}\p{N}\p{M}_-]+)?|opportunities(?:\/[\p{L}\p{N}\p{M}_-]+)?|videos(?:\/[A-Za-z0-9_-]+)?|categories(?:\/[\p{L}\p{N}\p{M}_-]+)?|tags|search(?:\/suggestions)?|settings\/public|sitemap\.xml)$/u.test(
      decodeURIComponent(url.pathname),
    )
  )
    throw new Error("SSR transport only permits anonymous public reads.");
  const secret = process.env.BUILDER_SSR_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("Public SSR signing is not configured.");
  const timestamp = String(Math.floor(Date.now() / 1000));
  return {
    "X-Builder-SSR-Timestamp": timestamp,
    "X-Builder-SSR-Signature": createHmac("sha256", secret)
      .update(timestamp + "\nGET\n" + url.pathname + url.search)
      .digest("hex"),
  };
}

export async function publicServerHttp<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  if (
    (options.method || "GET").toUpperCase() !== "GET" ||
    options.headers ||
    options.body ||
    options.credentials
  )
    throw new Error(
      "SSR transport does not accept authenticated or mutating requests.",
    );
  const url = new URL(buildApiUrl(API_URL, path, options.query));
  const headers = publicSsrHeaders(url);
  const key = url.href;
  const cacheable =
    listPaths.has(url.pathname.replace(/^\/api\/v1/, "")) && key.length <= 2048;
  const existing = cache.get(key);
  if (cacheable && existing && existing.expires > Date.now())
    return JSON.parse(existing.json) as T;
  const pending = !options.signal && cacheable ? inFlight.get(key) : undefined;
  if (pending) return (await pending) as T;
  const request = http<T>(path, {
    ...options,
    headers,
    credentials: "omit",
  });
  if (!options.signal && cacheable && inFlight.size < 128)
    inFlight.set(key, request);
  let value: T;
  try {
    value = await request;
  } finally {
    if (inFlight.get(key) === request) inFlight.delete(key);
  }
  if (cacheable) {
    const json = JSON.stringify(value);
    const size = Buffer.byteLength(json);
    if (size <= 256 * 1024) {
      const previous = cache.get(key);
      if (previous) {
        cacheBytes -= Buffer.byteLength(previous.json);
        cache.delete(key);
      }
      while (cache.size >= MAX_ENTRIES || cacheBytes + size > MAX_BYTES) {
        const oldest = cache.keys().next().value;
        if (!oldest) break;
        cacheBytes -= Buffer.byteLength(cache.get(oldest)!.json);
        cache.delete(oldest);
      }
      cache.set(key, { expires: Date.now() + 2000, json });
      cacheBytes += size;
    }
  }
  return value;
}
