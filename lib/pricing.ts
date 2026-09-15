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
      "Full rapport av den körda genomgången",
      "PDF du kan spara och dela",
      "Ingen extra AI-läsning",
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
      "Djupare genomgång och tydligare nästa steg",
      "PDF",
      "Betalas innan den djupare körningen startar",
    ],
  };
}

export function tungPlan(): PricePlan {
  return {
    id: "tung",
    name: "Större sajt",
    sek: tungSek(),
    stripePriceId: process.env.STRIPE_PRICE_TUNG?.trim() || undefined,
    payBefore: true,
    points: [
      "Samma djupare genomgång som Djup",
      "För större eller tyngre sajter",
      "Betalas innan analysen körs",
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
  "Engångsbelopp, inget abonnemang. Djupare genomgång och större sajter betalas innan den körningen startar.";

export type PackageId = "free" | "snabb" | "djup" | "tung";

export type PackageDetail = {
  id: PackageId;
  name: string;
  sek: number;
  gets: string;
  included: string[];
  notIncluded: string[];
  payWhen: string;
};

export function packageDetail(id: PackageId): PackageDetail {
  if (id === "snabb") {
    const p = snabbPlan();
    return {
      id,
      name: "Snabb",
      sek: p.sek,
      gets: "Full rapport och PDF av den körda genomgången.",
      included: ["Helhetsbetyg och alla kategorier", "Åtgärder", "PDF"],
      notIncluded: ["Extra AI-läsning", "Djupare körning"],
      payWhen: "Du får en gratis teaser först. Rapporten låses upp när du betalar — analysen har redan körts.",
    };
  }
  if (id === "djup") {
    const p = djupPlan();
    return {
      id,
      name: "Djup",
      sek: p.sek,
      gets: "Djupare genomgång och tydligare nästa steg.",
      included: ["Allt i Snabb", "Djupare genomgång", "Tydligare rekommendationer", "PDF"],
      notIncluded: ["Omskrivning av sajten", "Löpande SEO-avtal"],
      payWhen: "Du får teasern först. Den djupare körningen startar efter betalning.",
    };
  }
  if (id === "tung") {
    const p = tungPlan();
    return {
      id,
      name: "Större sajt",
      sek: p.sek,
      gets: "Samma djupare genomgång, för större eller tyngre sajter.",
      included: ["Samma som Djup", "För sajter som bedöms som stora eller tunga"],
      notIncluded: ["Omskrivning av sajten", "En annan sorts rapport än Djup"],
      payWhen: "Betalas innan analysen körs.",
    };
  }
  return {
    id: "free",
    name: "Gratis",
    sek: 0,
    gets: "Helhetsbetyg och ett urval fynd, direkt på sidan.",
    included: ["Helhetsbetyg", "Ett urval fynd"],
    notIncluded: ["Full rapport", "PDF"],
    payWhen: "Ingen betalning.",
  };
}
