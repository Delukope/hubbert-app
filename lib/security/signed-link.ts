import { createHmac, timingSafeEqual } from "node:crypto";

function secret() {
  return (
    process.env.HUBBERT_SIGNING_SECRET?.trim() ||
    process.env.STRIPE_SECRET_KEY?.trim() ||
    "hubberty-dev-signing-only"
  );
}

export function signPayToken(jobId: string, tier: string, expMs: number) {
  const body = `${jobId}.${tier}.${expMs}`;
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyPayToken(token: string): { jobId: string; tier: string } | null {
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [jobId, tier, expRaw, sig] = parts;
  const expMs = Number(expRaw);
  if (!jobId || !tier || !sig || !Number.isFinite(expMs) || Date.now() > expMs) return null;
  const expected = createHmac("sha256", secret()).update(`${jobId}.${tier}.${expMs}`).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return { jobId, tier };
}

export function teaserPayLink(origin: string, jobId: string, tier: string) {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const token = signPayToken(jobId, tier, exp);
  return `${origin}/analys/${jobId}?pay=${token}`;
}
