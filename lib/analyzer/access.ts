import type { ScanJob, UnlockTier } from "./types";

const TEASER_COUNT = 3;

export function jobUnlock(job: ScanJob): UnlockTier {
  return job.unlock ?? "free";
}

export function isPaid(job: ScanJob) {
  const u = jobUnlock(job);
  return u === "snabb" || u === "djup";
}

export function isDeep(job: ScanJob) {
  return jobUnlock(job) === "djup";
}

export function redactJob(job: ScanJob): ScanJob {
  if (!job.report || isPaid(job)) return job;
  const teaser = job.report.issues.slice(0, TEASER_COUNT);
  return {
    ...job,
    report: {
      ...job.report,
      issues: teaser,
      summary: job.report.summary,
      deepSummary: "",
      roadmap: [],
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
