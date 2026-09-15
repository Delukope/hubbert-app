import type { Metadata } from "next";
import { copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Om",
  description: `${copy.brand.name} är ${copy.brand.owner}s sajt för webbprojekt och sajtanalys.`,
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ion">Om · {copy.brand.domain}</p>
      <h1 className="display mt-3 text-4xl">En sajt jag kan ändra utan att slåss med WordPress.</h1>
      <p className="mt-6 leading-8 text-muted">
        Jag heter {copy.brand.owner} och driver {copy.brand.name}. De andra sajterna ligger i WordPress och Divi. Det
        funkar, men det är trögt att ändra. Den här sajten är byggd så att jag kan iterera snabbt — och visa en
        sajtanalys live.
      </p>
      <p className="mt-4 leading-8 text-muted">
        Portfolio först. Därefter en sajtanalys som samlar PageSpeed-tydlighet, säkerhetsbetyg och grafer i ett svenskt
        gränssnitt.
      </p>
      <p className="mt-4 leading-8 text-muted">
        Kontakt via sajterna i portföljen, eller via {copy.brand.domain} när mailet är på plats.
      </p>
    </article>
  );
}
