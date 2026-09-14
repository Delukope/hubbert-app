import { z } from "zod";
import { createCheckoutUrl, applyUnlock } from "@/lib/billing";
import { demoUnlockAllowed, stripeReady } from "@/lib/pricing";
import { readJob } from "@/lib/analyzer/store";

export const runtime = "nodejs";

const bodySchema = z.object({
  jobId: z.string().min(8).max(32),
  tier: z.enum(["snabb", "djup"]),
  demo: z.boolean().optional(),
});

export async function POST(request: Request) {
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
    return Response.json({ demo: true, unlocked: tier });
  }

  if (!stripeReady()) {
    return Response.json(
      {
        error: "Betalning är inte konfigurerad ännu. Sätt Stripe-nycklar, eller ALLOW_DEMO_UNLOCK=true för UI-test.",
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
