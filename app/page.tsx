import Link from "next/link";
import { UrlForm } from "@/components/analyzer/url-form";
import { ProjectCard } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { costNote, formatSek, plans } from "@/lib/pricing";
import { appProjects, showcaseProjects } from "@/lib/projects";

export default function HomePage() {
  const sites = showcaseProjects();
  const apps = appProjects();
  const price = plans();
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-fade" aria-hidden />
        <div
          className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-gold/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-0 top-24 h-96 w-96 rounded-full bg-mint/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
          <Badge className="border-gold/30 text-gold">Hubbert · hubberty.se</Badge>
          <h1 className="display mt-6 max-w-3xl text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            Se din sajt som den verkligen är.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
            Gratis teaser-scan. Full rapport från {formatSek(price[0].sek)}. Hemsidor och appar — bara uppdrag vi
            kan slutföra. Byggt av Konny Pettersson.
          </p>
          <div className="mt-10 max-w-2xl">
            <UrlForm />
          </div>
          <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["Gratis", "Teaser-betyg"],
              [formatSek(price[0].sek), "Snabb analys"],
              [formatSek(price[1].sek), "Djupanalys"],
              ["PDF", "Efter betalning"],
            ].map(([k, v]) => (
              <div key={v}>
                <dt className="font-mono text-xl text-gold">{k}</dt>
                <dd className="mt-1 text-sm text-muted">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/tjanster" className="glass rounded-3xl p-6 transition-colors hover:border-gold/30">
            <p className="text-xs uppercase tracking-[0.16em] text-gold">Tjänster</p>
            <h2 className="display mt-2 text-2xl">Hemsidor</h2>
            <p className="mt-2 text-sm text-muted">Modern stack. Inget Divi. Vi tar bara jobb vi kan leverera.</p>
          </Link>
          <Link href="/projekt/hubberty-app" className="glass rounded-3xl p-6 transition-colors hover:border-gold/30">
            <p className="text-xs uppercase tracking-[0.16em] text-gold">App</p>
            <h2 className="display mt-2 text-2xl">Hubberty</h2>
            <p className="mt-2 text-sm text-muted">Familjenav. Arbetsnamn, under utveckling, kommer bytas.</p>
          </Link>
          <Link href="/projekt/stampe" className="glass rounded-3xl p-6 transition-colors hover:border-gold/30">
            <p className="text-xs uppercase tracking-[0.16em] text-gold">Kommer snart</p>
            <h2 className="display mt-2 text-2xl">STAMPE</h2>
            <p className="mt-2 text-sm text-muted">Arbetsnamn för en kommande app. Ingen live-lansering ännu.</p>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Aktuellt</p>
            <h2 className="display mt-2 text-3xl">Sajter i arbete</h2>
          </div>
          <Link href="/projekt" className="text-sm text-gold hover:underline">
            Alla projekt
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {sites.map((p) => (
            <ProjectCard key={p.slug} project={p} featured />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Appar</p>
        <h2 className="display mt-2 text-3xl">Under utveckling</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {apps.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Priser</p>
        <h2 className="display mt-2 text-3xl">Analys som går att betala</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">{costNote}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {price.map((p) => (
            <div key={p.id} className="glass rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-gold">{p.name}</p>
              <p className="mt-2 font-mono text-3xl">{formatSek(p.sek)}</p>
              <ul className="mt-4 space-y-1 text-sm text-muted">
                {p.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link href="/priser" className="mt-6 inline-flex text-sm text-gold hover:underline">
          Alla priser och villkor
        </Link>
      </section>
    </div>
  );
}
