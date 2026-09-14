export type UnlockTier = "free" | "snabb" | "djup" | "tung";

export type PricePlan = {
  id: Exclude<UnlockTier, "free">;
  name: string;
  sek: number;
  stripePriceId?: string;
  points: string[];
  payBefore?: boolean;
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

export function tungSek() {
  return envInt("PRICE_TUNG_SEK", 2490);
}

export function formatSek(sek: number) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(sek);
}

export function snabbPlan(): PricePlan {
  return {
    id: "snabb",
    name: "Snabb analys",
    sek: snabbSek(),
    stripePriceId: process.env.STRIPE_PRICE_SNABB?.trim() || undefined,
    points: [
      "Genomgång av startsidan",
      "Alla kategorier upplåsta",
      "PDF du kan dela",
      "Utan AI-pass",
    ],
  };
}

export function djupPlan(): PricePlan {
  return {
    id: "djup",
    name: "Djupanalys",
    sek: djupSek(),
    stripePriceId: process.env.STRIPE_PRICE_DJUP?.trim() || undefined,
    payBefore: true,
    points: [
      "AI-genomgång och PageSpeed",
      "Roadmap och tydligare rekommendationer",
      "PDF",
      "Startar efter betalning",
    ],
  };
}

export function tungPlan(): PricePlan {
  return {
    id: "tung",
    name: "Tung / stor sajt",
    sek: tungSek(),
    stripePriceId: process.env.STRIPE_PRICE_TUNG?.trim() || undefined,
    payBefore: true,
    points: [
      "För tunga sajter",
      "Betalas innan de tunga passen",
      "Samma som djupanalys, med extra utrymme",
    ],
  };
}

export function plans(): PricePlan[] {
  return [snabbPlan(), djupPlan()];
}

export function quotePlans(heavy: boolean): PricePlan[] {
  return heavy ? [snabbPlan(), djupPlan(), tungPlan()] : plans();
}

export function plan(id: Exclude<UnlockTier, "free">) {
  if (id === "tung") return tungPlan();
  if (id === "djup") return djupPlan();
  return snabbPlan();
}

export function stripeReady() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY?.trim() &&
      (process.env.STRIPE_PRICE_SNABB?.trim() ||
        process.env.STRIPE_PRICE_DJUP?.trim() ||
        process.env.STRIPE_PRICE_TUNG?.trim()),
  );
}

export function demoUnlockAllowed() {
  return process.env.ALLOW_DEMO_UNLOCK === "true";
}

export const costNote =
  "Engångsbelopp, inget abonnemang. Djupanalys och tung startar efter betalning — de tunga passen körs först då.";
