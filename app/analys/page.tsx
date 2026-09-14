import type { Metadata } from "next";
import { UrlForm } from "@/components/analyzer/url-form";

export const metadata: Metadata = {
  title: "Analysera en sajt",
  description: "Klistra in en URL och få betyg på säkerhet, prestanda, SEO och tillgänglighet.",
};

export default async function AnalyzePage({ searchParams }: PageProps<"/analys">) {
  const sp = await searchParams;
  const preset = typeof sp.url === "string" ? sp.url : "";
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 hero-constellation" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ion">Sajtanalys · hubberty.se</p>
        <h1 className="display mt-3 text-4xl sm:text-6xl">En URL. En rapport.</h1>
        <p className="mt-4 max-w-xl text-muted">
          Gratis teaser stannar på sajten. Djupanalys och tunga sajter betalas innan AI-pass. PDF aldrig före
          betalning. Privata och lokala IP:n blockeras.
        </p>
        <div className="mt-10">
          <UrlForm initialUrl={preset} />
        </div>
      </div>
    </div>
  );
}
