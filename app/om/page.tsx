import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om",
  description: "Hubbert är Konny Petterssons nav för webbprojekt och sajtanalys.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ion">Om · hubberty.se</p>
      <h1 className="display mt-3 text-4xl">Inte ett tema. En produkt.</h1>
      <p className="mt-6 leading-8 text-muted">
        Hubbert drivs av Konny Pettersson. De andra sajterna sitter i WordPress och Divi — det funkar, men det är trögt
        att ändra. Hubbert är den andra polen: modern stack, snabb att iterera, en analysyta som går att visa live.
      </p>
      <p className="mt-4 leading-8 text-muted">
        Portfolio först. Därefter en sajtanalys som samlar PageSpeed-tydlighet, säkerhetsbetyg och grafer — i ett enda
        svenskt gränssnitt.
      </p>
      <p className="mt-4 leading-8 text-muted">
        Kontakt via sajterna i portföljen, eller via hubberty.se när mailet är på plats.
      </p>
    </article>
  );
}
