import { NextResponse, type NextRequest } from "next/server";
import { API_URL } from "@/lib/http";

/** Laravel remains authoritative; the proxy protects initial private-page navigation. */
export async function proxy(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_DESIGN_PREVIEW === "true")
    return NextResponse.next();
  const name = process.env.SESSION_COOKIE_NAME || "the_builder_session";
  const session = request.cookies.get(name);
  const signin = () => {
    const url = new URL("/signin", request.url);
    url.searchParams.set(
      "redirect",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(url);
  };
  if (!session) return signin();
  try {
    const response = await fetch(API_URL.replace(/\/$/, "") + "/me", {
      headers: {
        Accept: "application/json",
        Cookie: name + "=" + session.value,
        Origin: new URL(process.env.NEXT_PUBLIC_APP_URL || request.url).origin,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (response.status === 401) return signin();
    if (!response.ok) return NextResponse.next();
    const body = await response.json();
    if (!body.data?.emailVerified) {
      const url = new URL("/verify-email", request.url);
      url.searchParams.set("email", body.data?.email || "");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}
export const config = {
  matcher: ["/console/:path*", "/account/:path*", "/onboarding"],
};
