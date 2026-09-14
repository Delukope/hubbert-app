import { siteUrl } from "@/lib/utils";

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  return (request.headers.get("x-real-ip") || "0.0.0.0").slice(0, 64);
}

export function clientUa(request: Request): string {
  return (request.headers.get("user-agent") || "").slice(0, 256);
}

export function allowedOrigin(origin: string | null): boolean {
  if (!origin || origin === "null") return true;
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  const site = siteUrl();
  if (origin === site) return true;
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return true;
  if (url.hostname === "hubberty.se" || url.hostname === "www.hubberty.se") return true;
  if (url.hostname.endsWith(".vercel.app")) return true;
  return false;
}

export function mutationOriginOk(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (origin) return allowedOrigin(origin);
  const referer = request.headers.get("referer");
  if (!referer) return true;
  try {
    return allowedOrigin(new URL(referer).origin);
  } catch {
    return false;
  }
}

export const corsAllowHeaders = "Content-Type, Accept";

export function corsHeadersFor(origin: string | null): Record<string, string> {
  const allow = origin && allowedOrigin(origin) ? origin : siteUrl();
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": corsAllowHeaders,
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
    "Cache-Control": "no-store",
  };
}

export const siteSecurityHeaders: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "X-DNS-Prefetch-Control": "off",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};
