import type { Metadata } from "next";
import Link from "next/link";
import { costNote, formatSek, plans } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Priser",
  description: "Gratis teaser, snabb analys och djupanalys på Hubbert. hubberty.se",
};

export default function PricesPage() {
  const [snabb, djup] = plans();
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-gold">Priser</p>
      <h1 className="display mt-3 text-4xl">Betala för det som kostar att köra.</h1>
      <p className="mt-4 text-muted">{costNote} Inget abonnemang. Hemsidor och appar offert — inte löpande retainer.</p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="glass rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-gold">Teaser</p>
          <p className="mt-2 font-mono text-3xl">0 kr</p>
          <p className="mt-3 text-sm text-muted">Helhetsbetyg, kategoripoäng och 2–3 avslöjanden. Resten låst.</p>
        </div>
        <div className="glass rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-gold">{snabb.name}</p>
          <p className="mt-2 font-mono text-3xl">{formatSek(snabb.sek)}</p>
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {snabb.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-gold">{djup.name}</p>
          <p className="mt-2 font-mono text-3xl">{formatSek(djup.sek)}</p>
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {djup.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-8 text-sm text-muted">
        Snabb analys ligger i spannet 149–299 kr; {formatSek(snabb.sek)} är placeholder tills Stripe-priser är
        satta. Åtgärdshjälp är separat — se{" "}
        <Link href="/tjanster" className="text-gold hover:underline">
          tjänster
        </Link>
        .
      </p>
      <Link
        href="/analys"
        className="mt-8 inline-flex rounded-full bg-gold px-5 py-3 text-sm font-medium text-[#1a1408]"
      >
        Kör en teaser-scan
      </Link>
    </article>
  );
}
