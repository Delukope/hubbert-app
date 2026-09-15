import type { Metadata } from "next";
import { UrlForm } from "@/components/analyzer/url-form";
import { copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Analysera en sajt",
  description: `Klistra in en URL på ${copy.brand.name} och få betyg på säkerhet, prestanda, SEO och tillgänglighet.`,
};

export default async function AnalyzePage({ searchParams }: PageProps<"/analys">) {
  const sp = await searchParams;
  const preset = typeof sp.url === "string" ? sp.url : "";
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 hero-constellation" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <UrlForm initialUrl={preset} hero />
      </div>
    </div>
  );
}
