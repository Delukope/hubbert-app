import { after } from "next/server";
import { analyzeRequestSchema } from "@/lib/analyzer/schema";
import { createJob } from "@/lib/analyzer/store";
import { runScan } from "@/lib/analyzer/run";
import { assertPublicHttpUrl, SsrfError } from "@/lib/analyzer/ssrf";
import { corsPreflight, jsonErr, jsonOk } from "@/lib/analyzer/http";
import { clientIp, clientUa, mutationOriginOk } from "@/lib/security/origin";
import { hitLimit, LIMITS } from "@/lib/security/rate-limit";
import { honeypotFilled, looksLikeScraper } from "@/lib/security/bot";
import { isBlockedIp } from "@/lib/security/blocklist";
import { maybeTarpit } from "@/lib/security/tarpit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export function OPTIONS(request: Request) {
  return corsPreflight(request);
}

export async function POST(request: Request) {
  if (!mutationOriginOk(request)) {
    return jsonErr("Ogiltig origin.", 403, "csrf", undefined, request);
  }
  const ip = clientIp(request);
  const ua = clientUa(request);
  if (isBlockedIp(ip)) {
    return jsonErr("Tillfällig spärr.", 403, "blocked", undefined, request);
  }
  const scraper = looksLikeScraper(ua, request.headers.get("accept-language"));
  await maybeTarpit(scraper);
  const limited = hitLimit(`analys:${ip}`, LIMITS.analys);
  if (!limited.ok) {
    return jsonErr(
      limited.reason === "daily"
        ? "Dygnstaket för gratis skanning är nått. Kom tillbaka i morgon eller betala för djupanalys."
        : "För många skanningar från den här adressen. Vänta en stund.",
      429,
      "rate_limited",
      { retryAfterSec: limited.retryAfterSec },
      request,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonErr("Ogiltig JSON.", 400, "invalid_json", undefined, request);
  }

  const parsed = analyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Ogiltig URL.";
    return jsonErr(msg, 400, "invalid_url", undefined, request);
  }

  if (honeypotFilled(parsed.data.fax_number)) {
    await maybeTarpit(true);
    return jsonErr("Ogiltig begäran.", 400, "invalid_url", undefined, request);
  }

  try {
    await assertPublicHttpUrl(parsed.data.url);
  } catch (err) {
    const msg = err instanceof SsrfError ? err.message : "URL:en tillåts inte.";
    const blocked = err instanceof SsrfError;
    return jsonErr(msg, 400, blocked ? "blocked" : "invalid_url", undefined, request);
  }

  let job;
  try {
    job = await createJob(parsed.data.url, parsed.data.intent ?? "teaser");
  } catch {
    return jsonErr("Kunde inte spara analysjobbet. Försök igen.", 503, "store_failed", undefined, request);
  }

  after(() => runScan(job.id).catch(() => undefined));

  return jsonOk(
    { id: job.id, url: job.url, status: job.status, intent: job.intent, deepPending: job.deepPending },
    201,
    request,
  );
}
