import Stripe from "stripe";
import { siteUrl } from "@/lib/utils";
import { plan, stripeReady, type UnlockTier } from "@/lib/pricing";
import { patchJob, readJob } from "@/lib/analyzer/store";
import { isPaid } from "@/lib/analyzer/access";

function stripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) throw new Error("Stripe är inte konfigurerat.");
  return new Stripe(key);
}

export async function createCheckoutUrl(jobId: string, tier: Exclude<UnlockTier, "free">) {
  const job = await readJob(jobId);
  if (!job) throw new Error("Rapporten hittades inte.");
  if (job.status !== "complete" || !job.report) throw new Error("Analysen är inte klar ännu.");
  if (isPaid(job) && (tier === "snabb" || job.unlock === "djup")) {
    throw new Error("Rapporten är redan upplåst.");
  }
  if (!stripeReady()) throw new Error("Stripe-priser saknas.");
  const selected = plan(tier);
  if (!selected.stripePriceId) throw new Error(`Stripe price id saknas för ${selected.name}.`);

  const origin = siteUrl();
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: selected.stripePriceId, quantity: 1 }],
    success_url: `${origin}/analys/${jobId}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/analys/${jobId}?checkout=cancel`,
    client_reference_id: jobId,
    metadata: { jobId, tier },
  });
  if (!session.url) throw new Error("Stripe gav ingen checkout-URL.");
  return session.url;
}

export async function applyUnlock(jobId: string, tier: Exclude<UnlockTier, "free">, sessionId?: string) {
  const job = await readJob(jobId);
  if (!job) return null;
  const current = job.unlock ?? "free";
  if (current === "djup") return job;
  if (current === "snabb" && tier === "snabb") return job;
  return patchJob(jobId, {
    unlock: tier,
    paidAt: new Date().toISOString(),
    stripeSessionId: sessionId ?? job.stripeSessionId,
  });
}

export async function fulfillStripeSession(sessionId: string) {
  const session = await stripe().checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid" && session.status !== "complete") return null;
  const jobId = session.metadata?.jobId || session.client_reference_id;
  const tier = session.metadata?.tier === "djup" ? "djup" : "snabb";
  if (!jobId) return null;
  return applyUnlock(jobId, tier, session.id);
}

export async function constructWebhookEvent(body: string, signature: string) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET saknas.");
  return stripe().webhooks.constructEvent(body, signature, secret);
}
