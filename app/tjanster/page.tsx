import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tjänster",
  description: "Hemsidor, appar och åtgärdshjälp från Hubbert. Vi tar bara uppdrag vi kan slutföra.",
};

export default function ServicesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ion">Tjänster · hubberty.se</p>
      <h1 className="display mt-3 text-4xl">Vi tar bara jobb vi kan slutföra.</h1>
      <p className="mt-4 leading-8 text-muted">
        Inga eviga retainer-löften. Om uppdraget är större än vad Konny kan leverera säger vi nej.
      </p>
      <section className="mt-12 space-y-10">
        <div>
          <h2 className="display text-2xl">Hemsidor</h2>
          <p className="mt-3 leading-7 text-muted">
            Nya sajter och omskrivningar bort från WordPress/Divi när det är rätt. Klientarbete kan visas som
            före/efter. Första slotarna: Värmlands Trädfällning och Filipsson Entreprenad — ramarna finns, efter-bilder
            kommer när omskrivningen är gjord. Inga fejkade screenshots.
          </p>
        </div>
        <div>
          <h2 className="display text-2xl">Appar</h2>
          <p className="mt-3 leading-7 text-muted">
            Hubberty (familjenav, arbetsnamn) är tidigt. STAMPE kommer snart som arbetsnamn — inte till salu som
            färdig produkt. Appbyggen offertas bara när scope är tydligt.
          </p>
        </div>
        <div>
          <h2 className="display text-2xl">Åtgärdshjälp efter analys</h2>
          <p className="mt-3 leading-7 text-muted">
            En rapport är inte en omskrivning. Vi kan hjälpa med konkret lista (headers, metadata, prestanda) när
            det ryms. Pentest, juridiskt eller evig SEO-coachning ingår inte.
          </p>
        </div>
      </section>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/analys" className="bg-ion px-5 py-3 text-sm font-medium text-ink">
          Börja med en scan
        </Link>
        <Link href="/priser" className="border border-line px-5 py-3 text-sm">
          Priser
        </Link>
      </div>
    </article>
  );
}
