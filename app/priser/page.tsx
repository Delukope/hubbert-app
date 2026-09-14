import type { Metadata } from "next";
import Link from "next/link";
import { costNote, formatSek, plans, tungPlan } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Priser",
  description: "Gratis teaser, snabb, djup och tung analys på Hubbert. hubberty.se",
};

export default function PricesPage() {
  const [snabb, djup] = plans();
  const tung = tungPlan();
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ion">Priser · hubberty.se</p>
      <h1 className="display mt-3 text-4xl">Betala för det som kostar att köra.</h1>
      <p className="mt-4 text-muted">{costNote}</p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="glass p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ion">Teaser</p>
          <p className="mt-2 font-mono text-3xl">0 kr</p>
          <p className="mt-3 text-sm text-muted">
            På sajten: helhetsbetyg och 2–3 avslöjanden. Ingen e-post med full rapport. Ingen PDF.
          </p>
        </div>
        <div className="glass p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ion">{snabb.name}</p>
          <p className="mt-2 font-mono text-3xl">{formatSek(snabb.sek)}</p>
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {snabb.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="glass p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ion">{djup.name}</p>
          <p className="mt-2 font-mono text-3xl">{formatSek(djup.sek)}</p>
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {djup.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="glass p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ion">{tung.name}</p>
          <p className="mt-2 font-mono text-3xl">{formatSek(tung.sek)}</p>
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {tung.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-8 text-sm text-muted">
        Snabb 149–299 kr; {formatSek(snabb.sek)} är placeholder. Djup och tung kräver betalning innan AI-pass. Se{" "}
        <Link href="/tjanster" className="text-ion hover:underline">
          tjänster
        </Link>
        .
      </p>
      <Link href="/analys" className="mt-8 inline-flex bg-ion px-5 py-3 text-sm font-medium text-ink">
        Kör en teaser-scan
      </Link>
    </article>
  );
}
