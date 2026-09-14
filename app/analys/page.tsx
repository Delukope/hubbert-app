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
      <div className="pointer-events-none absolute inset-0 grid-fade" aria-hidden />
      <div className="relative mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Sajtanalys</p>
        <h1 className="display mt-3 text-4xl sm:text-5xl">En URL. En rapport.</h1>
        <p className="mt-4 text-muted">
          Vi hämtar HTML och headers, sätter betyg och listar vad som faktiskt är värt att fixa. Privata,
          lokala och metadata-IP:n blockeras.
        </p>
        <div className="mt-10">
          <UrlForm initialUrl={preset} />
        </div>
      </div>
    </div>
  );
}
