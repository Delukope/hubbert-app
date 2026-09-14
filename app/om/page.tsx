import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om",
  description: "Hubbert är Konny Petterssons nav för webbprojekt och sajtanalys.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-gold">Om</p>
      <h1 className="display mt-3 text-4xl">Inte ett tema. En produkt.</h1>
      <p className="mt-6 leading-8 text-muted">
        Hubbert drivs av Konny Pettersson. Övriga sajter lever på WordPress, One.com och Divi — det funkar,
        men det begränsar. Hubbert är den andra polen: modern stack, snabb att iterera, inget temajakt, och
        en analysyta som går att visa live.
      </p>
      <p className="mt-4 leading-8 text-muted">
        Portfolio först. Därefter en sajtanalys som samlar det bästa från PageSpeed-tydlighet,
        SecurityHeaders-betyg och GTmetrix-grafer — i ett enda svenskt gränssnitt.
      </p>
      <p className="mt-4 leading-8 text-muted">
        Kontakt via sajterna i portföljen, eller via hubberty.se när mailet är på plats.
      </p>
    </article>
  );
}
