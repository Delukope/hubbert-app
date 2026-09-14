import type { HeaderGrade, SecurityHeaderResult } from "./types";

function get(headers: Record<string, string>, name: string) {
  return headers[name.toLowerCase()];
}

export function gradeFromCount(ok: number, total: number): HeaderGrade {
  const ratio = ok / total;
  if (ok === total) return "A+";
  if (ratio >= 0.83) return "A";
  if (ratio >= 0.66) return "B";
  if (ratio >= 0.5) return "C";
  if (ratio >= 0.33) return "D";
  if (ratio > 0) return "E";
  return "F";
}

export function analyzeSecurityHeaders(headers: Record<string, string>, https: boolean) {
  const results: SecurityHeaderResult[] = [];

  const hsts = get(headers, "strict-transport-security");
  const hstsOk = Boolean(https && hsts && /max-age\s*=\s*(\d+)/i.test(hsts) && Number(hsts.match(/max-age\s*=\s*(\d+)/i)?.[1] || 0) >= 31536000);
  results.push({
    name: "Strict-Transport-Security",
    present: Boolean(hsts),
    value: hsts,
    ok: hstsOk,
    note: hstsOk
      ? "HSTS med minst ett års max-age."
      : https
        ? "Saknas eller max-age under 31536000. Lägg till includeSubDomains."
        : "HSTS kräver HTTPS.",
  });

  const csp = get(headers, "content-security-policy");
  const cspOk = Boolean(csp && !/unsafe-inline|unsafe-eval/i.test(csp) || (csp && csp.length > 12));
  results.push({
    name: "Content-Security-Policy",
    present: Boolean(csp),
    value: csp,
    ok: Boolean(csp),
    note: csp
      ? cspOk && !/unsafe-inline/i.test(csp)
        ? "CSP finns."
        : "CSP finns men tillåter unsafe-inline/eval — svag policy."
      : "Ingen CSP. Skyddar mot XSS och oönskade resurser.",
  });

  const xcto = get(headers, "x-content-type-options");
  results.push({
    name: "X-Content-Type-Options",
    present: Boolean(xcto),
    value: xcto,
    ok: xcto?.toLowerCase() === "nosniff",
    note: xcto?.toLowerCase() === "nosniff" ? "nosniff är satt." : "Sätt nosniff för att stoppa MIME-sniffing.",
  });

  const xfo = get(headers, "x-frame-options");
  const frameAncestors = csp ? /frame-ancestors/i.test(csp) : false;
  const xfoOk = Boolean(xfo && /deny|sameorigin/i.test(xfo)) || frameAncestors;
  results.push({
    name: "X-Frame-Options",
    present: Boolean(xfo) || frameAncestors,
    value: xfo || (frameAncestors ? "(CSP frame-ancestors)" : undefined),
    ok: xfoOk,
    note: xfoOk ? "Clickjacking-skydd finns." : "Sätt DENY/SAMEORIGIN eller CSP frame-ancestors.",
  });

  const rp = get(headers, "referrer-policy");
  const rpOk = Boolean(rp && rp.trim().length > 0);
  results.push({
    name: "Referrer-Policy",
    present: rpOk,
    value: rp,
    ok: rpOk,
    note: rpOk ? "Referrer-Policy är satt." : "Rekommenderas: strict-origin-when-cross-origin.",
  });

  const pp = get(headers, "permissions-policy") || get(headers, "feature-policy");
  results.push({
    name: "Permissions-Policy",
    present: Boolean(pp),
    value: pp,
    ok: Boolean(pp),
    note: pp ? "Permissions-Policy är satt." : "Styr kamera, geolocation, mikrofon m.m.",
  });

  const okCount = results.filter((r) => r.ok).length;
  const grade = gradeFromCount(okCount, results.length);
  const score = Math.round((okCount / results.length) * 100);

  return { headers: results, grade, score };
}

export function headerGradeToScore(grade: HeaderGrade): number {
  const map: Record<HeaderGrade, number> = {
    "A+": 100,
    A: 90,
    B: 75,
    C: 60,
    D: 45,
    E: 30,
    F: 10,
  };
  return map[grade];
}
