import type { ScanReport } from "./types";
import { templatedSummary } from "./scores";

export type EnrichMode = "none" | "snabb" | "djup";

export async function enrichReport(report: ScanReport, mode: EnrichMode = "none"): Promise<ScanReport> {
  const next = { ...report };
  if (mode === "none") {
    if (!next.summary) next.summary = templatedSummary(next);
    next.enriched = false;
    next.enrichLevel = 0;
    return next;
  }

  const psiKey = process.env.PAGESPEED_API_KEY?.trim();
  if (psiKey && (mode === "snabb" || mode === "djup")) {
    try {
      const u = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
      u.searchParams.set("url", report.fetchedUrl || report.url);
      u.searchParams.set("key", psiKey);
      u.searchParams.set("strategy", "mobile");
      for (const c of ["PERFORMANCE", "SEO", "ACCESSIBILITY", "BEST_PRACTICES"]) {
        u.searchParams.append("category", c);
      }
      const res = await fetch(u, { signal: AbortSignal.timeout(18_000) });
      if (res.ok) {
        const data = (await res.json()) as {
          lighthouseResult?: {
            categories?: Record<string, { score?: number | null }>;
          };
        };
        const cats = data.lighthouseResult?.categories ?? {};
        const pct = (v?: number | null) => (typeof v === "number" ? Math.round(v * 100) : undefined);
        next.pagespeed = {
          performance: pct(cats.performance?.score),
          seo: pct(cats.seo?.score),
          accessibility: pct(cats.accessibility?.score),
          bestPractices: pct(cats["best-practices"]?.score),
          source: "pagespeed",
        };
      }
    } catch {
      /* optional */
    }
  }

  if (mode === "djup") {
    const openaiKey = process.env.OPENAI_API_KEY?.trim();
    if (openaiKey) {
      try {
        const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            authorization: `Bearer ${openaiKey}`,
            "content-type": "application/json",
          },
          signal: AbortSignal.timeout(10_000),
          body: JSON.stringify({
            model,
            temperature: 0.3,
            max_tokens: 280,
            messages: [
              {
                role: "system",
                content:
                  "Du är en kortfattad svensk webrådgivare. Skriv 2–4 meningar. Inga emojis. Prioritera konkreta åtgärder.",
              },
              {
                role: "user",
                content: JSON.stringify({
                  url: next.url,
                  overall: next.overall,
                  security: next.security.grade,
                  performance: next.performance.score,
                  seo: next.seo.score,
                  a11y: next.a11y.score,
                  topIssues: next.issues.slice(0, 5).map((i) => i.title),
                }),
              },
            ],
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as {
            choices?: { message?: { content?: string } }[];
          };
          const text = data.choices?.[0]?.message?.content?.trim();
          if (text) next.summary = text;
        }
      } catch {
        /* optional */
      }
    }
  }

  if (!next.summary) next.summary = templatedSummary(next);
  next.enriched = true;
  next.enrichLevel = mode === "djup" ? 2 : 1;
  return next;
}
