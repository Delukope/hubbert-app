import type { ScanFacts, ScanIssue, ScanReport } from "./types";
import { analyzeSecurityHeaders } from "./security";
import {
  buildIssuesFromSecurity,
  overallScore,
  prioritize,
  scoreA11y,
  scorePerformance,
  scoreSeo,
  templatedSummary,
} from "./scores";

function hashHost(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function buildDemoReport(url: string, reason: string): ScanReport {
  let host = url;
  try {
    host = new URL(url).hostname;
  } catch {
    /* keep */
  }
  const h = hashHost(host);
  const ttfbMs = 180 + (h % 520);
  const bytes = 42000 + (h % 180000);
  const https = !url.startsWith("http://");

  const facts: ScanFacts = {
    title: `${host} — webbplats`,
    description: `Publik webbplats för ${host}. Demo-rapport baserad på typiska mönster när livehämtning inte är tillgänglig.`,
    canonical: url,
    lang: "sv",
    charset: "utf-8",
    viewport: "width=device-width, initial-scale=1",
    robots: "index,follow",
    ogTitle: host,
    ogImage: undefined,
    headings: { h1: 1, h2: 4 + (h % 5), h3: 6 },
    images: { total: 12, withAlt: 8 + (h % 4), withoutAlt: 4 - (h % 4) },
    links: { internal: 18, external: 6 },
    jsonLdTypes: h % 2 === 0 ? ["WebSite", "Organization"] : [],
    wordCount: 650 + (h % 900),
    hasFavicon: true,
  };

  const fakeHeaders: Record<string, string> = {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "public, max-age=60",
  };
  if (https && h % 3 !== 0) fakeHeaders["strict-transport-security"] = "max-age=31536000; includeSubDomains";
  if (h % 2 === 0) fakeHeaders["x-content-type-options"] = "nosniff";
  if (h % 5 !== 1) fakeHeaders["x-frame-options"] = "SAMEORIGIN";
  if (h % 4 === 0) fakeHeaders["referrer-policy"] = "strict-origin-when-cross-origin";
  if (h % 3 === 1) fakeHeaders["content-security-policy"] = "default-src 'self'";
  if (h % 7 === 0) fakeHeaders["permissions-policy"] = "geolocation=(), camera=()";
  fakeHeaders["content-encoding"] = "br";

  const sec = analyzeSecurityHeaders(fakeHeaders, https);
  const issues: ScanIssue[] = [];
  buildIssuesFromSecurity(https, sec.headers, issues);
  const seo = scoreSeo(facts, url, issues);
  const a11y = scoreA11y(facts, issues);
  const performance = scorePerformance({
    ttfbMs,
    bytes,
    compressed: true,
    cacheControl: fakeHeaders["cache-control"],
    https,
    redirectCount: 1,
    issues,
  });
  const securityScore = Math.round(sec.score * 0.75 + (https ? 25 : 0));
  const overall = overallScore({
    security: securityScore,
    performance,
    seo,
    a11y,
  });
  const ordered = prioritize(issues);

  const report: ScanReport = {
    url,
    fetchedUrl: url,
    scannedAt: new Date().toISOString(),
    isDemo: true,
    demoReason: reason,
    facts,
    security: {
      grade: sec.grade,
      https,
      headers: sec.headers,
      tlsNote: https
        ? "HTTPS antas i demo. Live-scan verifierar certifikatkedjan via hämtningen."
        : "HTTP i URL:en — uppgradera till HTTPS.",
      score: securityScore,
    },
    performance: {
      score: performance,
      ttfbMs,
      totalBytes: bytes,
      compressed: true,
      encoding: "br",
      cacheControl: fakeHeaders["cache-control"],
      contentType: fakeHeaders["content-type"],
      redirectCount: 1,
      metrics: [
        { name: "TTFB", value: Math.round(ttfbMs), unit: "ms" },
        { name: "HTML", value: bytes, unit: "B" },
        { name: "Redirects", value: 1, unit: "" },
        { name: "Komprimering", value: 1, unit: "bool" },
      ],
    },
    seo: { score: seo },
    a11y: { score: a11y },
    overall,
    issues: ordered,
    summary: "",
  };
  report.summary = templatedSummary(report);
  return report;
}
