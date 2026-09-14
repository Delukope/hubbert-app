import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tjänster",
  description: "Hemsidor, appar och åtgärdshjälp från Hubbert. Vi tar bara uppdrag vi kan slutföra.",
};

export default function ServicesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-gold">Tjänster</p>
      <h1 className="display mt-3 text-4xl">Vi tar bara jobb vi kan slutföra.</h1>
      <p className="mt-4 leading-8 text-muted">
        Inga eviga retainer-löften. Om uppdraget är större än vad Konny kan leverera säger vi nej. hubberty.se
      </p>
      <section className="mt-12 space-y-10">
        <div>
          <h2 className="display text-2xl">Hemsidor</h2>
          <p className="mt-3 leading-7 text-muted">
            Nya sajter och omskrivningar bort från WordPress/Divi när det är rätt. Offert efter en kort genomgång.
            Fallatrad och Filipsson Entreprenad är typiska: enkla företagssajter som ska moderniseras.
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
        <Link href="/analys" className="rounded-full bg-gold px-5 py-3 text-sm font-medium text-[#1a1408]">
          Börja med en scan
        </Link>
        <Link href="/priser" className="rounded-full border border-line px-5 py-3 text-sm">
          Priser
        </Link>
      </div>
    </article>
  );
}
