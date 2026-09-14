import { clamp } from "@/lib/utils";
import type { ScanFacts, ScanIssue, ScanReport } from "./types";
import { analyzeSecurityHeaders } from "./security";

function issue(
  partial: Omit<ScanIssue, "id"> & { id: string },
): ScanIssue {
  return partial;
}

export function scoreSeo(facts: ScanFacts, url: string, issues: ScanIssue[]): number {
  let score = 100;
  const titleLen = facts.title?.length ?? 0;
  if (!facts.title) {
    score -= 18;
    issues.push(
      issue({
        id: "seo-title",
        category: "seo",
        severity: "high",
        title: "Saknar title",
        description: "Utan title förstår varken Google eller flikar vad sidan är.",
        recommendation: "Sätt en unik title på 30–60 tecken med primärt sökord först.",
      }),
    );
  } else if (titleLen < 15 || titleLen > 70) {
    score -= 8;
    issues.push(
      issue({
        id: "seo-title-len",
        category: "seo",
        severity: "medium",
        title: "Title har olämplig längd",
        description: `Titeln är ${titleLen} tecken. 30–60 är en bra måltavla.`,
        recommendation: "Korta eller fyll ut titeln så den syns hel i sökresultat.",
        evidence: facts.title,
      }),
    );
  }

  const descLen = facts.description?.length ?? 0;
  if (!facts.description) {
    score -= 14;
    issues.push(
      issue({
        id: "seo-desc",
        category: "seo",
        severity: "high",
        title: "Saknar meta description",
        description: "Utan beskrivning skriver sökmotorer en egen snippet.",
        recommendation: "Skriv 70–160 tecken som säljer klicket.",
      }),
    );
  } else if (descLen < 50 || descLen > 180) {
    score -= 6;
    issues.push(
      issue({
        id: "seo-desc-len",
        category: "seo",
        severity: "low",
        title: "Meta description utanför ideal längd",
        description: `Beskrivningen är ${descLen} tecken.`,
        recommendation: "Sikta på 70–160 tecken.",
      }),
    );
  }

  if (!facts.canonical) {
    score -= 8;
    issues.push(
      issue({
        id: "seo-canonical",
        category: "seo",
        severity: "medium",
        title: "Saknar canonical",
        description: "Utan canonical kan dubbletter splitta ranking.",
        recommendation: "Peka rel=canonical mot den föredragna URL:en.",
      }),
    );
  }

  if (facts.headings.h1 === 0) {
    score -= 10;
    issues.push(
      issue({
        id: "seo-h1",
        category: "seo",
        severity: "high",
        title: "Ingen H1",
        description: "En sida bör ha exakt en huvudrubrik.",
        recommendation: "Lägg en H1 som matchar sidans primära ämne.",
      }),
    );
  } else if (facts.headings.h1 > 1) {
    score -= 5;
    issues.push(
      issue({
        id: "seo-h1-many",
        category: "seo",
        severity: "low",
        title: "Flera H1:or",
        description: `${facts.headings.h1} H1-rubriker hittades.`,
        recommendation: "Behåll en H1 och flytta övriga till H2.",
      }),
    );
  }

  if (!facts.ogTitle && !facts.ogImage) {
    score -= 6;
    issues.push(
      issue({
        id: "seo-og",
        category: "seo",
        severity: "medium",
        title: "Svaga Open Graph-taggar",
        description: "Delningar i sociala ytor blir anonyma utan og:title och og:image.",
        recommendation: "Sätt og:title, og:description och og:image (minst 1200×630).",
      }),
    );
  }

  if (facts.robots && /noindex/i.test(facts.robots)) {
    score -= 25;
    issues.push(
      issue({
        id: "seo-noindex",
        category: "seo",
        severity: "critical",
        title: "Sidan är noindex",
        description: "Meta robots säger åt sökmotorer att inte indexera.",
        recommendation: "Ta bort noindex om sidan ska synas i sök.",
        evidence: facts.robots,
      }),
    );
  }

  if (facts.jsonLdTypes.length === 0) {
    score -= 5;
    issues.push(
      issue({
        id: "seo-jsonld",
        category: "seo",
        severity: "low",
        title: "Ingen strukturerad data",
        description: "JSON-LD hjälper Google förstå organisation, artikel eller produkt.",
        recommendation: "Lägg WebSite/Organization schema som minimum.",
      }),
    );
  }

  if (!facts.viewport) {
    score -= 6;
    issues.push(
      issue({
        id: "seo-viewport",
        category: "seo",
        severity: "medium",
        title: "Saknar viewport",
        description: "Utan viewport-meta ser mobilen en skrivbordsyta.",
        recommendation: 'Sätt <meta name="viewport" content="width=device-width, initial-scale=1">.',
      }),
    );
  }

  try {
    if (new URL(url).protocol !== "https:") {
      score -= 10;
    }
  } catch {
    /* ignore */
  }

  return clamp(score);
}

export function scoreA11y(facts: ScanFacts, issues: ScanIssue[]): number {
  let score = 100;
  if (!facts.lang) {
    score -= 16;
    issues.push(
      issue({
        id: "a11y-lang",
        category: "a11y",
        severity: "high",
        title: "html lang saknas",
        description: "Skärmläsare behöver veta vilket språk sidan är på.",
        recommendation: 'Sätt lang="sv" på <html>.',
      }),
    );
  }
  if (!facts.viewport) {
    score -= 8;
    issues.push(
      issue({
        id: "a11y-viewport",
        category: "a11y",
        severity: "medium",
        title: "Ingen viewport — sämre mobil a11y",
        description: "Zoom och layout på små skärmar blir fel utan viewport.",
        recommendation: "Lägg till en standard viewport-meta.",
      }),
    );
  }
  if (facts.images.total > 0) {
    const coverage = facts.images.withAlt / facts.images.total;
    if (coverage < 0.9) {
      const penalty = Math.round((1 - coverage) * 28);
      score -= penalty;
      issues.push(
        issue({
          id: "a11y-alt",
          category: "a11y",
          severity: coverage < 0.5 ? "high" : "medium",
          title: "Bilder utan alt-text",
          description: `${facts.images.withoutAlt} av ${facts.images.total} bilder saknar alt.`,
          recommendation: "Beskriv bildens innehåll. Dekorativa bilder får alt=\"\".",
        }),
      );
    }
  }
  if (facts.headings.h1 === 0) {
    score -= 10;
    issues.push(
      issue({
        id: "a11y-h1",
        category: "a11y",
        severity: "medium",
        title: "Ingen H1 för dokumentstruktur",
        description: "Rubrikhierarki är hur många navigerar med skärmläsare.",
        recommendation: "Börja med en H1, sedan H2/H3 i logisk ordning.",
      }),
    );
  }
  return clamp(score);
}

export function scorePerformance(input: {
  ttfbMs: number;
  bytes: number;
  compressed: boolean;
  cacheControl?: string;
  https: boolean;
  redirectCount: number;
  issues: ScanIssue[];
}): number {
  let score = 100;
  const { ttfbMs, bytes, compressed, cacheControl, https, redirectCount, issues } = input;

  if (ttfbMs > 1800) {
    score -= 28;
    issues.push(
      issue({
        id: "perf-ttfb",
        category: "performance",
        severity: "high",
        title: "Långsam TTFB",
        description: `Servern svarade på ${Math.round(ttfbMs)} ms.`,
        recommendation: "Cachea HTML, se över hosting, undvik kall origin.",
      }),
    );
  } else if (ttfbMs > 800) {
    score -= 14;
    issues.push(
      issue({
        id: "perf-ttfb-mid",
        category: "performance",
        severity: "medium",
        title: "TTFB kan bli bättre",
        description: `Svarstid ${Math.round(ttfbMs)} ms. Under 400 ms är ett starkt mål.`,
        recommendation: "CDN, edge cache eller snabbare origin.",
      }),
    );
  } else if (ttfbMs > 400) {
    score -= 6;
  }

  if (bytes > 500_000) {
    score -= 16;
    issues.push(
      issue({
        id: "perf-size",
        category: "performance",
        severity: "medium",
        title: "Stor HTML-payload",
        description: `HTML är ${Math.round(bytes / 1024)} kB.`,
        recommendation: "Skär bort oanvänd markup, dela upp CSS/JS, lazy-loada.",
      }),
    );
  } else if (bytes > 200_000) {
    score -= 8;
  }

  if (!compressed) {
    score -= 18;
    issues.push(
      issue({
        id: "perf-compress",
        category: "performance",
        severity: "high",
        title: "Ingen komprimering",
        description: "Svaret saknar Content-Encoding (gzip/br).",
        recommendation: "Aktivera Brotli eller gzip på servern/CDN.",
      }),
    );
  }

  if (!cacheControl || /no-store|private/i.test(cacheControl)) {
    score -= 8;
    issues.push(
      issue({
        id: "perf-cache",
        category: "performance",
        severity: "low",
        title: "Svag cache-policy",
        description: cacheControl ? `Cache-Control: ${cacheControl}` : "Ingen Cache-Control-header.",
        recommendation: "Sätt lång cache på statiska assets, kort/SWR på HTML.",
      }),
    );
  }

  if (!https) {
    score -= 10;
    issues.push(
      issue({
        id: "perf-http",
        category: "performance",
        severity: "high",
        title: "HTTP istället för HTTPS",
        description: "Moderna webbläsare och SEO straffar okrypterad trafik.",
        recommendation: "Tvinga HTTPS och HSTS.",
      }),
    );
  }

  if (redirectCount > 1) {
    score -= 6;
    issues.push(
      issue({
        id: "perf-redirects",
        category: "performance",
        severity: "low",
        title: "Flera omdirigeringar",
        description: `${redirectCount} hopp innan slutlig URL.`,
        recommendation: "Peka direkt mot den kanoniska HTTPS-adressen.",
      }),
    );
  }

  return clamp(score);
}

export function buildIssuesFromSecurity(
  https: boolean,
  headerResults: ReturnType<typeof analyzeSecurityHeaders>["headers"],
  issues: ScanIssue[],
) {
  if (!https) {
    issues.push(
      issue({
        id: "sec-https",
        category: "security",
        severity: "critical",
        title: "Sajten körs inte över HTTPS",
        description: "Trafik och cookies kan avlyssnas. Certifikat är baslinje 2026.",
        recommendation: "Aktivera TLS, 301 från HTTP, och HSTS.",
      }),
    );
  }
  for (const h of headerResults) {
    if (h.ok) continue;
    issues.push(
      issue({
        id: `sec-${h.name.toLowerCase()}`,
        category: "security",
        severity: h.name.includes("Transport") || h.name.includes("CSP") ? "high" : "medium",
        title: `Saknar eller svag ${h.name}`,
        description: h.note,
        recommendation: `Sätt en strikt ${h.name}-header.`,
        evidence: h.value,
      }),
    );
  }
}

export function overallScore(parts: {
  security: number;
  performance: number;
  seo: number;
  a11y: number;
  design: number;
}) {
  return Math.round(
    parts.security * 0.24 +
      parts.performance * 0.22 +
      parts.seo * 0.2 +
      parts.a11y * 0.16 +
      parts.design * 0.18,
  );
}

export function prioritize(issues: ScanIssue[]): ScanIssue[] {
  const rank: Record<ScanIssue["severity"], number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
    info: 4,
  };
  return [...issues].sort((a, b) => rank[a.severity] - rank[b.severity]);
}

export function templatedSummary(report: Pick<ScanReport, "overall" | "security" | "performance" | "seo" | "a11y" | "issues" | "url" | "isDemo">) {
  const top = prioritize(report.issues).slice(0, 3);
  const host = (() => {
    try {
      return new URL(report.url).hostname;
    } catch {
      return report.url;
    }
  })();
  const tone =
    report.overall >= 85
      ? "Sajten är i gott skick — finputs mer än räddning."
      : report.overall >= 65
        ? "En solid bas, men några hål sänker helhetsintrycket."
        : "Här finns tydlig uppsida. Prioritera säkerhet och grundläggande SEO först.";
  const bullets = top.length
    ? top.map((i) => `${i.title}`).join("; ")
    : "Inga allvarliga fel hittades.";
  const demo = report.isDemo ? " (demo-rapport — livehämtning gick inte)" : "";
  return `${host} landar på ${report.overall}/100. Säkerhet ${report.security.grade}, prestanda ${report.performance.score}, SEO ${report.seo.score}, tillgänglighet ${report.a11y.score}. ${tone} Först: ${bullets}.${demo}`;
}

export function scoreDesign(facts: ScanFacts, issues: ScanIssue[]): number {
  let score = 100;
  if (!facts.viewport) {
    score -= 16;
    issues.push(
      issue({
        id: "design-viewport",
        category: "design",
        severity: "high",
        title: "Ingen mobil viewport",
        description: "Utan viewport känns sajten som en ihoptryckt skrivbordsyta.",
        recommendation: "Sätt width=device-width och testa på en riktig telefon.",
      }),
    );
  }
  if (!facts.hasFavicon) {
    score -= 6;
    issues.push(
      issue({
        id: "design-favicon",
        category: "design",
        severity: "low",
        title: "Saknar favicon",
        description: "Fliken blir anonym i en hav av andra flikar.",
        recommendation: "Lägg en SVG- eller PNG-favicon.",
      }),
    );
  }
  if (!facts.ogImage) {
    score -= 8;
    issues.push(
      issue({
        id: "design-og",
        category: "design",
        severity: "medium",
        title: "Ingen og:image",
        description: "Delningar ser ofärdiga ut utan en avsiktlig bild.",
        recommendation: "En 1200×630-bild som bär varumärket.",
      }),
    );
  }
  const gen = facts.generator?.toLowerCase() ?? "";
  if (/divi|wpbakery|elementor/i.test(gen) || /wordpress/i.test(gen)) {
    score -= 10;
    issues.push(
      issue({
        id: "design-generator",
        category: "design",
        severity: "medium",
        title: "Temamotor syns i källan",
        description: facts.generator
          ? `Generator: ${facts.generator}. Det är ofta ett tecken på tunga teman och svåritererad yta.`
          : "Temamotor syns.",
        recommendation: "Om sajten ska utvecklas vidare: byt till en kodyta ni äger, inte ett tema ni jagar.",
        evidence: facts.generator,
      }),
    );
  }
  if (facts.wordCount > 0 && facts.wordCount < 80) {
    score -= 10;
    issues.push(
      issue({
        id: "design-thin",
        category: "design",
        severity: "medium",
        title: "Tunn startsida",
        description: `Ungefär ${facts.wordCount} ord i body. Svårt att förstå erbjudandet.`,
        recommendation: "Skriv vad ni gör, för vem, och hur man tar nästa steg — ovanför vecket.",
      }),
    );
  }
  return clamp(score);
}

export function scoreEeat(facts: ScanFacts, issues: ScanIssue[]): { score: number; notes: string[] } {
  let score = 100;
  const notes: string[] = [];
  const types = facts.jsonLdTypes.map((t) => t.toLowerCase());
  const hasOrg = types.some((t) => t.includes("organization") || t.includes("person") || t.includes("localbusiness"));
  if (!hasOrg) {
    score -= 18;
    notes.push("Ingen Organization/Person i JSON-LD — svagare E-E-A-T-signal.");
    issues.push(
      issue({
        id: "eeat-org",
        category: "seo",
        severity: "medium",
        title: "Svagt avsändar-schema",
        description: "Google vill se vem som står bakom sajten (Organization eller Person).",
        recommendation: "JSON-LD med namn, URL och gärna sammaAs mot riktiga profiler.",
      }),
    );
  } else {
    notes.push("Schema för organisation eller person finns.");
  }
  if (!facts.description) {
    score -= 10;
    notes.push("Ingen meta description — sämre snippet och svagare första intryck.");
  }
  if (!facts.lang) {
    score -= 8;
    notes.push("html lang saknas — sämre språksignal.");
  }
  if (facts.wordCount < 120) {
    score -= 12;
    notes.push("Lite brödtext gör det svårt att visa erfarenhet och expertis.");
  }
  return { score: clamp(score), notes };
}

export function attachNarrative(report: ScanReport): ScanReport {
  const ordered = prioritize(report.issues);
  report.roadmap = ordered.slice(0, 8).map((item, i) => ({
    order: i + 1,
    title: item.title,
    category: item.category,
    severity: item.severity,
    action: item.recommendation,
  }));
  const host = (() => {
    try {
      return new URL(report.url).hostname;
    } catch {
      return report.url;
    }
  })();
  const eeat = report.eeat.notes.slice(0, 3).join(" ");
  report.deepSummary = `${host} får ${report.overall}/100. Säkerhetsbetyg ${report.security.grade}, TTFB ${Math.round(report.performance.ttfbMs)} ms, design ${report.design.score}, E-E-A-T ${report.eeat.score}. ${eeat} En prioriterad läsning — inte en omskrivning av sajten.`;
  if (!report.summary) report.summary = templatedSummary(report);
  return report;
}
