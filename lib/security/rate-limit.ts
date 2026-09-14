type Bucket = { hits: number[]; day: string; dayCount: number };

const buckets = new Map<string, Bucket>();

function today() {
  return new Date().toISOString().slice(0, 10);
}

function prune(hits: number[], windowMs: number, now: number) {
  const min = now - windowMs;
  return hits.filter((t) => t > min);
}

export type LimitResult = { ok: true } | { ok: false; retryAfterSec: number; reason: "rate" | "daily" };

export function hitLimit(
  key: string,
  { windowMs, max, dailyMax }: { windowMs: number; max: number; dailyMax: number },
): LimitResult {
  const now = Date.now();
  const day = today();
  const current = buckets.get(key) ?? { hits: [], day, dayCount: 0 };
  if (current.day !== day) {
    current.day = day;
    current.dayCount = 0;
  }
  current.hits = prune(current.hits, windowMs, now);
  if (current.dayCount >= dailyMax) {
    buckets.set(key, current);
    return { ok: false, retryAfterSec: 3600, reason: "daily" };
  }
  if (current.hits.length >= max) {
    buckets.set(key, current);
    const wait = Math.max(1, Math.ceil((current.hits[0]! + windowMs - now) / 1000));
    return { ok: false, retryAfterSec: wait, reason: "rate" };
  }
  current.hits.push(now);
  current.dayCount += 1;
  buckets.set(key, current);
  return { ok: true };
}

export const LIMITS = {
  analys: { windowMs: 60 * 60 * 1000, max: 8, dailyMax: 20 },
  checkout: { windowMs: 60 * 60 * 1000, max: 10, dailyMax: 30 },
  preview: { windowMs: 60 * 1000, max: 40, dailyMax: 400 },
};
