import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Villkor",
  description: "Användarvillkor för Hubbert.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="display text-4xl">Villkor</h1>
      <p className="mt-6 leading-8 text-muted">
        Hubbert tillhandahålls som ett verktyg för att granska publika webbplatser. Analyserna är heuristiska
        och kan vara ofullständiga. En demo-rapport kan visas om målsajten inte går att hämta.
      </p>
      <p className="mt-4 leading-8 text-muted">
        Du får bara analysera sajter du har rätt att granska. Tjänsten får inte användas för att attackera,
        kartlägga interna nät eller kringgå åtkomstskydd.
      </p>
      <p className="mt-4 leading-8 text-muted">
        Betald rapport (Snabb analys / Djupanalys) låser upp den skann som redan körts, plus PDF. Ingen
        återbetalning för en sajt du inte äger rätten att granska. Åtgärdshjälp offertas separat och bara när
        vi kan slutföra jobbet.
      </p>
      <p className="mt-4 leading-8 text-muted">
        Inget avtal om tillgänglighet eller SLA i den här versionen. Innehåll i portföljen tillhör respektive
        projekt. hubberty.se
      </p>
    </article>
  );
}
