import { isPaid } from "@/lib/analyzer/access";
import { renderReportPdf } from "@/lib/analyzer/pdf";
import { readJob } from "@/lib/analyzer/store";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/analys/[jobId]/pdf">,
) {
  const { jobId } = await ctx.params;
  const job = await readJob(jobId);
  if (!job || !job.report) return new Response("Rapporten hittades inte.", { status: 404 });
  if (!isPaid(job)) return new Response("PDF ingår i betald rapport.", { status: 403 });
  const buf = await renderReportPdf(job);
  const bytes = new Uint8Array(buf);
  return new Response(bytes, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="hubbert-${job.id}.pdf"`,
    },
  });
}
