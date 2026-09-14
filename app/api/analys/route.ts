import { after } from "next/server";
import { analyzeRequestSchema } from "@/lib/analyzer/schema";
import { createJob } from "@/lib/analyzer/store";
import { runScan } from "@/lib/analyzer/run";
import { assertPublicHttpUrl, SsrfError } from "@/lib/analyzer/ssrf";
import { corsPreflight, jsonErr, jsonOk } from "@/lib/analyzer/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export function OPTIONS() {
  return corsPreflight();
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonErr("Ogiltig JSON.", 400, "invalid_json");
  }

  const parsed = analyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Ogiltig URL.";
    return jsonErr(msg, 400, "invalid_url");
  }

  try {
    await assertPublicHttpUrl(parsed.data.url);
  } catch (err) {
    const msg = err instanceof SsrfError ? err.message : "URL:en tillåts inte.";
    const blocked = err instanceof SsrfError;
    return jsonErr(msg, 400, blocked ? "blocked" : "invalid_url");
  }

  let job;
  try {
    job = await createJob(parsed.data.url);
  } catch {
    return jsonErr("Kunde inte spara analysjobbet. Försök igen.", 503, "store_failed");
  }

  after(() => runScan(job.id).catch(() => undefined));

  return jsonOk({ id: job.id, url: job.url, status: job.status }, 201);
}
