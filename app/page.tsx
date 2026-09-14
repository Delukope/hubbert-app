import Link from "next/link";
import { UrlForm } from "@/components/analyzer/url-form";
import { CaseStudyCard } from "@/components/case-study-card";
import { ProjectCard } from "@/components/project-card";
import { formatSek, plans, tungPlan } from "@/lib/pricing";
import { appProjects, caseStudyProjects, liveSiteProjects } from "@/lib/projects";

export default function HomePage() {
  const live = liveSiteProjects();
  const cases = caseStudyProjects();
  const apps = appProjects();
  const price = [...plans(), tungPlan()];
  return (
    <div className="pb-24">
      <section className="relative overflow-hidden">
        <div className="hero-constellation pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:pt-14">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-ion">
              Hubbert · hubberty.se · årgång 26
            </p>
            <h1 className="display mt-5 max-w-[14ch] text-[clamp(2.6rem,8vw,6.2rem)] leading-[0.88] tracking-[-0.04em]">
              Se sajten
              <span className="block text-ion">som den är.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-muted sm:text-lg">
              Gratis teaser. Full rapport från {formatSek(price[0].sek)}. Hemsidor och appar — bara jobb vi kan
              leverera.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
              {[
                ["00 kr", "Teaser"],
                [formatSek(price[0].sek), "Snabb"],
                [formatSek(price[1].sek), "Djup"],
                [formatSek(price[2].sek), "Tung"],
              ].map(([k, v]) => (
                <div key={v} className="border-t border-line pt-3">
                  <dt className="font-mono text-lg text-ion">{k}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="self-end">
            <div className="console-panel p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ion">Konsol · analys</p>
              <p className="display mt-3 text-2xl leading-tight">Klistra in en URL. Vi läser den rakt av.</p>
              <div className="mt-6">
                <UrlForm size="md" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
          {[
            ["/tjanster", "01", "Hemsidor", "Nya sajter och omskrivningar. Bara jobb vi kan leverera."],
            ["/projekt/hubberty-app", "02", "Hubberty", "Familjenav under utveckling."],
            ["/projekt/stampe", "03", "STAMPE", "Kommande produkt."],
          ].map(([href, n, title, lead]) => (
            <Link key={href} href={href} className="bg-bg p-6 transition-colors hover:bg-white/3">
              <p className="font-mono text-[11px] text-ion">{n}</p>
              <h2 className="display mt-3 text-2xl">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{lead}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">Live</p>
            <h2 className="display mt-2 text-3xl sm:text-4xl">Hubbert och Akalasi</h2>
          </div>
          <Link href="/projekt" className="font-mono text-[11px] uppercase tracking-[0.18em] text-ion hover:underline">
            Alla projekt
          </Link>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {live.map((p) => (
            <ProjectCard key={p.slug} project={p} featured />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">Klientarbete</p>
        <h2 className="display mt-2 text-3xl sm:text-4xl">Före & efter på gång</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Två företagssajter som ska moderniseras. Bilderna kommer när omskrivningen är klar.
        </p>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {cases.map((p) => (
            <CaseStudyCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">Appar</p>
        <h2 className="display mt-2 text-3xl">Under utveckling</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {apps.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">Priser</p>
        <h2 className="display mt-2 text-3xl">Vad det kostar</h2>
        <div className="mt-8 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
          {price.map((p) => (
            <div key={p.id} className="bg-bg p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ion">{p.name}</p>
              <p className="mt-2 font-mono text-3xl">{formatSek(p.sek)}</p>
              <ul className="mt-4 space-y-1 text-sm text-muted">
                {p.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link href="/priser" className="mt-6 inline-flex font-mono text-[11px] uppercase tracking-[0.18em] text-ion hover:underline">
          Alla priser och villkor
        </Link>
      </section>
    </div>
  );
}
