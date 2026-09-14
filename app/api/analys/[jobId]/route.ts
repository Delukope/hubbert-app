import { readJob } from "@/lib/analyzer/store";
import { redactJob } from "@/lib/analyzer/access";
import { runScan } from "@/lib/analyzer/run";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/analys/[jobId]">,
) {
  const { jobId } = await ctx.params;
  const job = await readJob(jobId);
  if (!job) return Response.json({ error: "Rapporten hittades inte." }, { status: 404 });
  return Response.json(redactJob(job));
}

export async function POST(
  _request: Request,
  ctx: RouteContext<"/api/analys/[jobId]">,
) {
  const { jobId } = await ctx.params;
  const job = await readJob(jobId);
  if (!job) return Response.json({ error: "Rapporten hittades inte." }, { status: 404 });
  if (job.status === "queued") {
    await runScan(jobId);
  }
  const latest = await readJob(jobId);
  return Response.json(latest ? redactJob(latest) : latest);
}
