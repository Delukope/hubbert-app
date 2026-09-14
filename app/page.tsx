import Link from "next/link";
import { UrlForm } from "@/components/analyzer/url-form";
import { FadeIn } from "@/components/fade-in";
import { ProjectCard } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { featuredProjects } from "@/lib/projects";

export default function HomePage() {
  const featured = featuredProjects();
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
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <FadeIn>
            <Badge className="border-gold/30 text-gold">Portfolio + sajtanalys</Badge>
            <h1 className="display mt-6 max-w-3xl text-4xl leading-[1.05] tracking-tight sm:text-6xl">
              Se din sajt som den verkligen är.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
              Klistra in en URL. Få ett tydligt betyg på säkerhet, prestanda, SEO och tillgänglighet — plus vad
              du ska göra först. Byggt av Konny Pettersson, för sajter som tål att visas.
            </p>
            <div className="mt-10 max-w-2xl">
              <UrlForm />
            </div>
            <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                ["A+–F", "Säkerhetsheaders"],
                ["0–100", "SEO & a11y"],
                ["TTFB", "Prestandaheuristik"],
                ["Delbar", "Rapport-URL"],
              ].map(([k, v]) => (
                <div key={v}>
                  <dt className="font-mono text-xl text-gold">{k}</dt>
                  <dd className="mt-1 text-sm text-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Utvalt</p>
            <h2 className="display mt-2 text-3xl">Projekt som bär namnet</h2>
          </div>
          <Link href="/projekt" className="text-sm text-gold hover:underline">
            Alla projekt
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} featured />
          ))}
        </div>
      </section>
    </div>
  );
}
