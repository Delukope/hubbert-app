import { after } from "next/server";
import { z } from "zod";
import { createCheckoutUrl, applyUnlock } from "@/lib/billing";
import { demoUnlockAllowed, stripeReady } from "@/lib/pricing";
import { readJob } from "@/lib/analyzer/store";
import { runPaidEnrich } from "@/lib/analyzer/run";
import { clientIp, mutationOriginOk } from "@/lib/security/origin";
import { hitLimit, LIMITS } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

const bodySchema = z.object({
  jobId: z.string().min(8).max(32),
  tier: z.enum(["snabb", "djup", "tung"]),
  demo: z.boolean().optional(),
});

export async function POST(request: Request) {
  if (!mutationOriginOk(request)) {
    return Response.json({ error: "Ogiltig origin.", code: "csrf" }, { status: 403 });
  }
  const limited = hitLimit(`checkout:${clientIp(request)}`, LIMITS.checkout);
  if (!limited.ok) {
    return Response.json({ error: "För många betalningsförsök.", code: "rate_limited" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: "Ogiltig JSON." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Ogiltig begäran." }, { status: 400 });
  }
  const { jobId, tier, demo } = parsed.data;
  const job = await readJob(jobId);
  if (!job) return Response.json({ error: "Rapporten hittades inte." }, { status: 404 });

  if (demo) {
    if (!demoUnlockAllowed()) {
      return Response.json({ error: "Demo-upplåsning är avstängd." }, { status: 403 });
    }
    await applyUnlock(jobId, tier);
    after(() => runPaidEnrich(jobId).catch(() => undefined));
    return Response.json({ demo: true, unlocked: tier });
  }

  if (!stripeReady()) {
    return Response.json(
      {
        error: "Betalning är inte igång ännu.",
      },
      { status: 503 },
    );
  }

  try {
    const url = await createCheckoutUrl(jobId, tier);
    return Response.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Kunde inte starta Checkout.";
    return Response.json({ error: message }, { status: 400 });
  }
}
