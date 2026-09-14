export type UnlockTier = "free" | "snabb" | "djup";

export type PricePlan = {
  id: Exclude<UnlockTier, "free">;
  name: string;
  sek: number;
  stripePriceId?: string;
  points: string[];
};

function envInt(name: string, fallback: number) {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function snabbSek() {
  return envInt("PRICE_SNABB_SEK", 199);
}

export function djupSek() {
  return envInt("PRICE_DJUP_SEK", 990);
}

export function formatSek(sek: number) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(sek);
}

export function plans(): PricePlan[] {
  return [
    {
      id: "snabb",
      name: "Snabb analys",
      sek: snabbSek(),
      stripePriceId: process.env.STRIPE_PRICE_SNABB?.trim() || undefined,
      points: [
        "Full rapport per kategori",
        "Prioriterad åtgärdslista",
        "Nedladdningsbar PDF",
      ],
    },
    {
      id: "djup",
      name: "Djupanalys",
      sek: djupSek(),
      stripePriceId: process.env.STRIPE_PRICE_DJUP?.trim() || undefined,
      points: [
        "Allt i Snabb analys",
        "Rikare narrativ och E-E-A-T",
        "Design, säkerhet och prestanda i djupare sektioner",
        "Roadmap + erbjudande om uppföljande pass",
      ],
    },
  ];
}

export function plan(id: Exclude<UnlockTier, "free">) {
  return plans().find((p) => p.id === id)!;
}

export function stripeReady() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY?.trim() &&
      (process.env.STRIPE_PRICE_SNABB?.trim() || process.env.STRIPE_PRICE_DJUP?.trim()),
  );
}

export function demoUnlockAllowed() {
  return process.env.ALLOW_DEMO_UNLOCK === "true";
}

export const costNote =
  "Priset täcker AI/agent-körning, kortavgifter och en liten marginal — inte ett abonnemang.";
