import { HttpError } from "./http";

export function storyRedirect(error: unknown): string | null {
  if (!(error instanceof HttpError) || error.status !== 301) return null;
  const body = error.body as
    { data?: { redirect?: unknown }; redirect?: unknown } | undefined;
  const path = body?.data?.redirect ?? body?.redirect;
  return typeof path === "string" &&
    /^\/stories\/[\p{L}\p{N}\p{M}_-]{1,240}$/u.test(path)
    ? path
    : null;
}
