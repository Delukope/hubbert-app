import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integritet",
  description: "Hur Hubbert hanterar URL:er och rapporter.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="display text-4xl">Integritet</h1>
      <p className="mt-6 leading-8 text-muted">
        När du klistrar in en URL hämtar Hubbert den publika HTML:en och svarshuvudena. Vi loggar inte in,
        vi lagrar inga cookies från målsajten, och vi scannar inte bakom inloggning.
      </p>
      <p className="mt-4 leading-8 text-muted">
        Rapporten sparas som ett jobb med ett slumpmässigt id så att den kan delas. Skicka inte URL:er som
        innehåller hemligheter. Privata nät, localhost och moln-metadata blockeras medvetet (SSRF-skydd).
      </p>
      <p className="mt-4 leading-8 text-muted">
        Om PAGESPEED_API_KEY eller OPENAI_API_KEY är satta kan URL:en skickas till Google respektive OpenAI
        för berikning. Utan nycklar stannar allt på servern.
      </p>
      <p className="mt-4 leading-8 text-muted">
        Personuppgiftsansvarig: Konny Pettersson, hubberty.se. Den här sidan är en stubbe och uppdateras när
        drift och e-post är på plats.
      </p>
    </article>
  );
}
