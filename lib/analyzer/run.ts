import { SsrfError } from "./ssrf";
import { fetchPublicPage } from "./fetch-page";
import { parseHtml } from "./parse-html";
import { analyzeSecurityHeaders } from "./security";
import {
  attachNarrative,
  buildIssuesFromSecurity,
  overallScore,
  prioritize,
  scoreA11y,
  scoreDesign,
  scoreEeat,
  scorePerformance,
  scoreSeo,
  templatedSummary,
} from "./scores";
import { buildDemoReport } from "./demo";
import { enrichReport } from "./enrich";
import { patchJob, readJob } from "./store";
import type { ScanIssue, ScanReport } from "./types";

const STUCK_MS = 90_000;

export async function runScan(jobId: string) {
  const job = await readJob(jobId);
  if (!job) return;
  if (job.status === "complete" || job.status === "error") return;
  if (job.status === "running") {
    const age = Date.now() - new Date(job.updatedAt).getTime();
    if (Number.isFinite(age) && age < STUCK_MS) return;
  }

  await patchJob(jobId, {
    status: "running",
    progress: { step: "DNS / TLS", percent: 12 },
  });

  try {
    const page = await fetchPublicPage(job.url);
    await patchJob(jobId, { progress: { step: "Svarshuvuden", percent: 28 } });

    const https = page.finalUrl.startsWith("https:");
    const facts = parseHtml(page.html, page.finalUrl);

    await patchJob(jobId, { progress: { step: "HTML-dokument", percent: 44 } });
    const sec = analyzeSecurityHeaders(page.headers, https);
    const issues: ScanIssue[] = [];
    buildIssuesFromSecurity(https, sec.headers, issues);

    await patchJob(jobId, { progress: { step: "Poängsättning", percent: 68 } });
    const seo = scoreSeo(facts, page.finalUrl, issues);
    const a11y = scoreA11y(facts, issues);
    const design = scoreDesign(facts, issues);
    const eeat = scoreEeat(facts, issues);
    const performance = scorePerformance({
      ttfbMs: page.ttfbMs,
      bytes: page.bytes,
      compressed: page.compressed,
      cacheControl: page.headers["cache-control"],
      https,
      redirectCount: page.redirectCount,
      issues,
    });
    const securityScore = Math.round(sec.score * 0.72 + (https ? 28 : 0));
    const overall = overallScore({
      security: securityScore,
      performance,
      seo,
      a11y,
      design,
    });

    let report: ScanReport = {
      url: job.url,
      fetchedUrl: page.finalUrl,
      scannedAt: new Date().toISOString(),
      isDemo: false,
      facts,
      security: {
        grade: sec.grade,
        https,
        headers: sec.headers,
        tlsNote: https
          ? "Anslutningen skedde över HTTPS. Full certifikatkedja granskas inte i MVP:n."
          : "Ingen TLS — allt går i klartext.",
        score: securityScore,
      },
      performance: {
        score: performance,
        ttfbMs: page.ttfbMs,
        totalBytes: page.bytes,
        compressed: page.compressed,
        encoding: page.encoding,
        cacheControl: page.headers["cache-control"],
        contentType: page.headers["content-type"],
        redirectCount: page.redirectCount,
        metrics: [
          { name: "TTFB", value: Math.round(page.ttfbMs), unit: "ms" },
          { name: "HTML", value: page.bytes, unit: "B" },
          { name: "Redirects", value: page.redirectCount, unit: "" },
          { name: "Komprimering", value: page.compressed ? 1 : 0, unit: "bool" },
        ],
      },
      seo: { score: seo },
      a11y: { score: a11y },
      design: { score: design },
      eeat,
      overall,
      issues: prioritize(issues),
      summary: "",
      deepSummary: "",
      roadmap: [],
    };
    report.summary = templatedSummary(report);
    report = attachNarrative(report);

    await patchJob(jobId, { progress: { step: "Rapport", percent: 88 } });
    report = attachNarrative(await enrichReport(report));

    await patchJob(jobId, {
      status: "complete",
      progress: { step: "Klar", percent: 100 },
      report,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Okänt fel";
    const blocked = err instanceof SsrfError;
    if (blocked) {
      await patchJob(jobId, {
        status: "error",
        error: message,
        progress: { step: "Blockerad", percent: 100 },
      });
      return;
    }
    const report = attachNarrative(
      await enrichReport(buildDemoReport(job.url, `Livehämtning misslyckades: ${message}`)),
    );
    await patchJob(jobId, {
      status: "complete",
      progress: { step: "Klar (demo)", percent: 100 },
      report,
    });
  }
}
