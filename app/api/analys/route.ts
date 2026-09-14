import { after } from "next/server";
import { analyzeRequestSchema } from "@/lib/analyzer/schema";
import { createJob } from "@/lib/analyzer/store";
import { runScan } from "@/lib/analyzer/run";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ogiltig JSON." }, { status: 400 });
  }

  const parsed = analyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Ogiltig URL.";
    return Response.json({ error: msg }, { status: 400 });
  }

  const job = await createJob(parsed.data.url);
  after(() => runScan(job.id));
  return Response.json({ id: job.id, url: job.url }, { status: 201 });
}
