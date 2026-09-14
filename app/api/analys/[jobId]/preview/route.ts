import { readJob } from "@/lib/analyzer/store";
import { readPreviewHtml } from "@/lib/analyzer/preview-store";
import { clientIp } from "@/lib/security/origin";
import { hitLimit, LIMITS } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  ctx: RouteContext<"/api/analys/[jobId]/preview">,
) {
  const { jobId } = await ctx.params;
  const limited = hitLimit(`preview:${clientIp(request)}`, LIMITS.preview);
  if (!limited.ok) return new Response("För många förhandsvisningar.", { status: 429 });
  const job = await readJob(jobId);
  if (!job) return new Response("Saknas.", { status: 404 });
  const html = await readPreviewHtml(jobId);
  if (!html) {
    return new Response(
      `<!doctype html><html lang="sv"><body style="background:#07050a;color:#a3988c;font:14px ui-monospace,monospace;padding:24px">Förhandsvisning byggs …</body></html>`,
      {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "content-security-policy": "sandbox; default-src 'none'; style-src 'unsafe-inline'",
          "x-content-type-options": "nosniff",
          "cache-control": "no-store",
        },
      },
    );
  }
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "content-security-policy":
        "sandbox; default-src 'none'; img-src https: http: data:; style-src 'unsafe-inline' https: http:; font-src https: data:; frame-ancestors 'self'",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      "cache-control": "no-store",
    },
  });
}
