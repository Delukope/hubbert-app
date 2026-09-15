import type { Metadata } from "next";
import Link from "next/link";
import { copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Tjänster",
  description: `Hemsidor, appar och åtgärdshjälp från ${copy.brand.name}. Jag tar uppdrag jag kan slutföra.`,
};

export default function ServicesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ion">Tjänster · {copy.brand.domain}</p>
      <h1 className="display mt-3 text-4xl">Uppdrag jag kan slutföra.</h1>
      <p className="mt-4 leading-8 text-muted">
        Inga eviga retainer-löften. Om jobbet är större än vad jag kan leverera säger jag nej.
      </p>
      <section className="mt-12 space-y-10">
        <div>
          <h2 className="display text-2xl">Hemsidor</h2>
          <p className="mt-3 leading-7 text-muted">
            Nya sajter och omskrivningar bort från WordPress och Divi när det är rätt. Värmlands Trädfällning och
            Filipsson Entreprenad får före och efter när omskrivningen är klar.
          </p>
        </div>
        <div>
          <h2 className="display text-2xl">Appar</h2>
          <p className="mt-3 leading-7 text-muted">
            Appbyggen offertas när uppdraget är tydligt. Hubrix är en stämpelklocka under eget märke — inte lanserad.
            Familjeappen Hubberty är en annan produkt än den här webbplatsen, och är inte lanserad.
          </p>
        </div>
        <div>
          <h2 className="display text-2xl">Åtgärdshjälp efter analys</h2>
          <p className="mt-3 leading-7 text-muted">
            En rapport är inte en omskrivning. Jag kan hjälpa med en konkret lista — headers, metadata, prestanda — när
            det ryms. Pentest, juridiskt eller evig SEO-coachning ingår inte.
          </p>
        </div>
      </section>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/analys" className="bg-ion px-5 py-3 text-sm font-medium text-ink">
          Börja med en gratis analys
        </Link>
        <Link href="/priser" className="border border-line px-5 py-3 text-sm">
          Priser
        </Link>
      </div>
    </article>
  );
}
