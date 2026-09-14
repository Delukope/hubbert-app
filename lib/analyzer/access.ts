import type { ScanJob, UnlockTier } from "./types";

const TEASER_COUNT = 3;

export function jobUnlock(job: ScanJob): UnlockTier {
  return job.unlock ?? "free";
}

export function isPaid(job: ScanJob) {
  const u = jobUnlock(job);
  return u === "snabb" || u === "djup" || u === "tung";
}

export function isDeep(job: ScanJob) {
  const u = jobUnlock(job);
  return u === "djup" || u === "tung";
}

export function redactJob(job: ScanJob): ScanJob {
  const previewMeta = {
    previewReady: job.previewReady,
    sizeClass: job.sizeClass,
    heavyReasons: job.heavyReasons,
    deepPending: job.deepPending,
    intent: job.intent,
  };
  if (!job.report) return { ...job, ...previewMeta };
  if (isPaid(job)) {
    return { ...job, ...previewMeta };
  }
  const teaser = job.report.issues.slice(0, TEASER_COUNT);
  return {
    ...job,
    ...previewMeta,
    report: {
      ...job.report,
      issues: teaser,
      summary: job.report.summary,
      deepSummary: "",
      roadmap: [],
      enriched: false,
      facts: {
        ...job.report.facts,
        description: undefined,
        canonical: undefined,
        generator: undefined,
        ogImage: undefined,
      },
      security: {
        ...job.report.security,
        headers: [],
        tlsNote: "Full header-tabell ingår i betald rapport.",
      },
    },
  };
}
