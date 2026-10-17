export type QueryValue = string | number | boolean | null | undefined;

export interface PageMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

export interface ApiEnvelope<T> {
  data: T;
  message?: string;
  meta?: PageMeta | Record<string, unknown>;
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  links?: Record<string, string | null>;
}

export interface ApiValidationError {
  message: string;
  errors: Record<string, string[]>;
}

export class HttpError<T = unknown> extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: T,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  query?: Record<string, QueryValue>;
  body?: BodyInit | Record<string, unknown> | null;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export function buildApiUrl(
  baseUrl: string,
  path: string,
  query?: RequestOptions["query"],
) {
  if (
    /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path) ||
    path.split(/[/?#]/).includes("..")
  )
    throw new Error("API paths must be relative to the configured API.");
  const root = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const url = new URL(path.replace(/^\//, ""), root);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined)
      url.searchParams.set(key, String(value));
  });
  return url.toString();
}

const configuredApiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
export const API_URL = configuredApiUrl.replace(/\/api\/?$/, "/api/v1");

function csrfToken() {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split("; ")
    .find((value) => value.startsWith("XSRF-TOKEN="));
  return cookie ? decodeURIComponent(cookie.slice("XSRF-TOKEN=".length)) : null;
}

let csrfRequest: Promise<void> | null = null;
export async function initializeCsrf(baseUrl = API_URL) {
  if (csrfToken()) return;
  if (!csrfRequest) {
    csrfRequest = fetch(new URL("/sanctum/csrf-cookie", baseUrl), {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      signal: AbortSignal.timeout(15000),
    })
      .then((response) => {
        if (!response.ok)
          throw new HttpError(
            response.status,
            "Could not start a secure session. Please try again.",
          );
      })
      .finally(() => {
        csrfRequest = null;
      });
  }
  await csrfRequest;
}

export function createHttpClient(baseUrl = API_URL) {
  return async function request<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const { query, timeoutMs = 15000, body: input, ...init } = options;
    const headers = new Headers(options.headers);
    headers.set("Accept", "application/json");
    headers.set("X-Requested-With", "XMLHttpRequest");
    const mutating = !["GET", "HEAD", "OPTIONS"].includes(
      (init.method ?? "GET").toUpperCase(),
    );
    if (mutating && typeof window !== "undefined") {
      await initializeCsrf(baseUrl);
      const csrf = csrfToken();
      if (csrf) headers.set("X-XSRF-TOKEN", csrf);
    }
    const isSerializable =
      input !== null &&
      typeof input === "object" &&
      (Object.getPrototypeOf(input) === Object.prototype ||
        Array.isArray(input));
    if (isSerializable && !headers.has("Content-Type"))
      headers.set("Content-Type", "application/json");
    const controller = new AbortController();
    const abort = () => controller.abort(options.signal?.reason);
    if (options.signal?.aborted) abort();
    else options.signal?.addEventListener("abort", abort, { once: true });
    const timer = setTimeout(
      () =>
        controller.abort(
          new DOMException(
            "The request timed out. Please try again.",
            "TimeoutError",
          ),
        ),
      timeoutMs,
    );
    try {
      const response = await fetch(buildApiUrl(baseUrl, path, query), {
        ...init,
        headers,
        signal: controller.signal,
        body: isSerializable
          ? JSON.stringify(input)
          : (input as BodyInit | null | undefined),
        credentials: options.credentials ?? "include",
        cache: options.cache ?? "no-store",
      });
      if (response.status === 204 || response.status === 205)
        return undefined as T;
      const contentType = response.headers.get("content-type") ?? "";
      const raw = await response.text();
      let body: unknown = raw;
      if (
        raw &&
        (contentType.includes("application/json") ||
          contentType.includes("+json"))
      ) {
        try {
          body = JSON.parse(raw);
        } catch {
          throw new HttpError(
            response.status,
            "The server returned an invalid response.",
          );
        }
      }
      if (!response.ok) {
        const message =
          typeof body === "object" && body && "detail" in body
            ? String(body.detail)
            : typeof body === "object" && body && "message" in body
              ? String(body.message)
              : `Request failed with status ${response.status}`;
        throw new HttpError(
          response.status,
          message,
          body,
          response.headers.get("x-request-id") ?? undefined,
        );
      }
      if (raw && typeof body === "string")
        throw new HttpError(
          response.status,
          "Expected a JSON response from the API. Check the API address.",
        );
      return body as T;
    } finally {
      clearTimeout(timer);
      options.signal?.removeEventListener("abort", abort);
    }
  };
}

export function errorMessage(error: unknown) {
  if (error instanceof HttpError) {
    if (error.status === 401) return "Please sign in to continue.";
    if (error.status === 403) return "You do not have access to this action.";
    if (error.status === 419)
      return "Your session has expired. Refresh the page and try again.";
    if (error.status === 429)
      return "Too many requests. Please wait a moment and try again.";
    const body = error.body as Partial<ApiValidationError> | undefined;
    if (body?.errors) return Object.values(body.errors).flat().join(" ");
    return error.message;
  }
  if (error instanceof Error && error.name === "TimeoutError")
    return "The request timed out. Please try again.";
  return "Unable to connect. Check your connection and try again.";
}

export const http = createHttpClient();
