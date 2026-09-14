import { readJob } from "@/lib/analyzer/store";
import { redactJob } from "@/lib/analyzer/access";
import { runScan } from "@/lib/analyzer/run";
import { corsPreflight, jsonErr, jsonOk } from "@/lib/analyzer/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

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
  return jsonOk(redactJob(job));
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
  return jsonOk(latest ? redactJob(latest) : { error: "Rapporten hittades inte.", code: "not_found" });
}
