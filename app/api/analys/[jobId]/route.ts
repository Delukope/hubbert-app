import { readJob } from "@/lib/analyzer/store";
import { redactJob } from "@/lib/analyzer/access";
import { runScan } from "@/lib/analyzer/run";
import { corsPreflight, jsonErr, jsonOk } from "@/lib/analyzer/http";
import { costNote, demoUnlockAllowed, plans, stripeReady } from "@/lib/pricing";
import type { ScanJob } from "@/lib/analyzer/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function payload(job: ScanJob) {
  return {
    ...redactJob(job),
    billing: {
      plans: plans(),
      stripe: stripeReady(),
      demo: demoUnlockAllowed(),
      costNote,
    },
  };
}

export function OPTIONS() {
  return corsPreflight();
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/analys/[jobId]">,
) {
  const { jobId } = await ctx.params;
  const job = await readJob(jobId);
  if (!job) return jsonErr("Rapporten hittades inte.", 404, "not_found");
  return jsonOk(payload(job));
}

export async function POST(
  _request: Request,
  ctx: RouteContext<"/api/analys/[jobId]">,
) {
  const { jobId } = await ctx.params;
  const job = await readJob(jobId);
  if (!job) return jsonErr("Rapporten hittades inte.", 404, "not_found");
  if (job.status === "queued" || job.status === "running") {
    await runScan(jobId).catch(() => undefined);
  }
  const latest = await readJob(jobId);
  return jsonOk(latest ? payload(latest) : { error: "Rapporten hittades inte.", code: "not_found" });
}
