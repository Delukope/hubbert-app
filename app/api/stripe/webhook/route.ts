import { applyUnlock, constructWebhookEvent } from "@/lib/billing";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Saknar signatur.", { status: 400 });
  const body = await request.text();
  try {
    const event = await constructWebhookEvent(body, signature);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as {
        id: string;
        metadata?: { jobId?: string; tier?: string };
        client_reference_id?: string | null;
      };
      const jobId = session.metadata?.jobId || session.client_reference_id;
      const raw = session.metadata?.tier;
      const tier = raw === "tung" ? "tung" : raw === "djup" ? "djup" : "snabb";
      if (jobId) await applyUnlock(jobId, tier, session.id);
    }
    return Response.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook-fel";
    return new Response(message, { status: 400 });
  }
}
