import Link from "next/link";
import { UrlForm } from "@/components/analyzer/url-form";
import { CaseCarouselSection } from "@/components/case-carousel-section";
import { OfferingCards } from "@/components/offering-cards";
import { ProjectCard } from "@/components/project-card";
import { copy } from "@/lib/copy";
import { formatSek, packageDetail, plans } from "@/lib/pricing";
import { appProjects, caseStudyProjects, homeLiveProjects } from "@/lib/projects";

export default function HomePage() {
  const live = homeLiveProjects();
  const cases = caseStudyProjects();
  const apps = appProjects();
  const [snabb] = plans();
  const free = packageDetail("free");
  const tung = packageDetail("tung");
  return (
    <div className="pb-24">
      <section className="relative overflow-hidden">
        <div className="hero-constellation pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:pt-14">
          <div>
            <h1 className="display max-w-[16ch] text-[clamp(2.4rem,7vw,5.4rem)] leading-[0.92] tracking-[-0.04em]">
              Hur mår
              <span className="block text-ion">sajten?</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-muted sm:text-lg">{copy.hero.lead}</p>
            <p className="mt-3 max-w-md text-sm text-muted">
              Full rapport från {formatSek(snabb.sek)}. Hemsidor och appar: se{" "}
              <Link href="/tjanster" className="text-ion hover:underline">
                tjänster
              </Link>
              .
            </p>
          </div>
          <div className="self-end">
            <div className="console-panel p-5 sm:p-6">
              <p className="display text-2xl leading-tight">Vad behöver din sajt?</p>
              <p className="mt-2 text-sm text-muted">{copy.hero.hint}</p>
              <div className="mt-6">
                <UrlForm size="md" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <OfferingCards />
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="display text-3xl sm:text-4xl">Utvalda projekt</h2>
          <Link href="/projekt" className="font-mono text-[11px] uppercase tracking-[0.18em] text-ion hover:underline">
            Alla projekt
          </Link>
        </div>
        <div className={live.length > 1 ? "mt-8 grid gap-5 lg:grid-cols-2" : "mt-8 max-w-3xl"}>
          {live.map((p) => (
            <ProjectCard key={p.slug} project={p} featured />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
        <h2 className="display text-3xl sm:text-4xl">Samma företag. Ny webbplats.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Se hur äldre webbplatser får tydligare innehåll, bättre struktur och ett nytt uttryck.
        </p>
        <div className="mt-8">
          <CaseCarouselSection projects={cases} />
        </div>
      </section>

      <section id="appar" className="mx-auto mt-16 max-w-6xl scroll-mt-24 px-4 sm:px-6">
        <h2 className="display text-3xl">Appar &amp; verktyg</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {apps.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
        <h2 className="display text-3xl">Vad det kostar</h2>
        <div className="mt-8 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
          {[free, packageDetail("snabb"), packageDetail("djup")].map((p) => (
            <div key={p.id} className="bg-bg p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ion">{p.name}</p>
              <p className="mt-2 font-mono text-3xl">{p.sek === 0 ? "0 kr" : formatSek(p.sek)}</p>
              <p className="mt-3 text-sm text-muted">{p.gets}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-sm text-muted">
          {tung.gets} {formatSek(tung.sek)} — betalas innan analysen körs. Visas när en sajt bedöms som stor eller tung.
        </p>
        <Link href="/priser" className="mt-6 inline-flex font-mono text-[11px] uppercase tracking-[0.18em] text-ion hover:underline">
          Alla priser och villkor
        </Link>
      </section>
    </div>
  );
}
