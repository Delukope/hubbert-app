import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Villkor",
  description: "Användarvillkor för Huberty.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="display text-4xl">Villkor</h1>
      <p className="mt-6 leading-8 text-muted">
        Huberty tillhandahålls som ett verktyg för att granska publika webbplatser. Analyserna är heuristiska
        och kan vara ofullständiga. En demo-rapport kan visas om målsajten inte går att hämta.
      </p>
      <p className="mt-4 leading-8 text-muted">
        Du får bara analysera sajter du har rätt att granska. Tjänsten får inte användas för att attackera,
        kartlägga interna nät eller kringgå åtkomstskydd.
      </p>
      <p className="mt-4 leading-8 text-muted">
        Inget avtal om tillgänglighet eller SLA i den här versionen. Innehåll i portföljen tillhör respektive
        projekt. Stubbe — ersätts med fullständiga villkor vid skarp drift.
      </p>
    </article>
  );
}
