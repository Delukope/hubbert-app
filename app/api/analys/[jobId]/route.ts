import { after } from "next/server";
import { readJob } from "@/lib/analyzer/store";
import { redactJob } from "@/lib/analyzer/access";
import { runScan } from "@/lib/analyzer/run";
import { corsPreflight, jsonErr, jsonOk } from "@/lib/analyzer/http";
import { costNote, demoUnlockAllowed, quotePlans, stripeReady } from "@/lib/pricing";
import type { ScanJob } from "@/lib/analyzer/types";
import { mutationOriginOk } from "@/lib/security/origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function payload(job: ScanJob) {
  const heavy = job.sizeClass === "heavy";
  return {
    ...redactJob(job),
    billing: {
      plans: quotePlans(heavy),
      stripe: stripeReady(),
      demo: demoUnlockAllowed(),
      costNote,
      heavy,
      heavyReasons: job.heavyReasons ?? [],
      deepPending: Boolean(job.deepPending),
    },
  };
}

export function OPTIONS(request: Request) {
  return corsPreflight(request);
}

export async function GET(
  request: Request,
  ctx: RouteContext<"/api/analys/[jobId]">,
) {
  const { jobId } = await ctx.params;
  const job = await readJob(jobId);
  if (!job) return jsonErr("Rapporten hittades inte.", 404, "not_found", undefined, request);
  return jsonOk(payload(job), 200, request);
}

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/analys/[jobId]">,
) {
  if (!mutationOriginOk(request)) {
    return jsonErr("Ogiltig origin.", 403, "csrf", undefined, request);
  }
  const { jobId } = await ctx.params;
  const job = await readJob(jobId);
  if (!job) return jsonErr("Rapporten hittades inte.", 404, "not_found", undefined, request);
  if (job.status === "queued" || job.status === "running") {
    after(() => runScan(jobId).catch(() => undefined));
  }
  const latest = await readJob(jobId);
  return jsonOk(latest ? payload(latest) : { error: "Rapporten hittades inte.", code: "not_found" }, 200, request);
}
