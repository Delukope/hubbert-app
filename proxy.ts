import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { looksLikeScraper } from "@/lib/security/bot";
import { corsHeadersFor, siteSecurityHeaders } from "@/lib/security/origin";
import { tarpitMs } from "@/lib/security/tarpit";

export function proxy(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const scraper = looksLikeScraper(ua, request.headers.get("accept-language"));
  const path = request.nextUrl.pathname;
  const api = path.startsWith("/api/");

  if (scraper && !api) {
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(siteSecurityHeaders)) res.headers.set(k, v);
    res.headers.set("Retry-After", "3");
    const delay = tarpitMs(true);
    res.headers.set("x-hubbert-pace", String(delay));
    return res;
  }

  if (path.startsWith("/api/analys") && request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeadersFor(request.headers.get("origin")) });
  }

  const response = NextResponse.next();
  for (const [k, v] of Object.entries(siteSecurityHeaders)) response.headers.set(k, v);
  if (path.startsWith("/api/analys")) {
    for (const [k, v] of Object.entries(corsHeadersFor(request.headers.get("origin")))) {
      response.headers.set(k, v);
    }
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|webp|ico)$).*)"],
};
