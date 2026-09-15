import type { ReactNode } from "react";
import type { Metadata } from "next";
import { CaseCarouselSection } from "@/components/case-carousel-section";
import { ProjectCard } from "@/components/project-card";
import { copy } from "@/lib/copy";
import { appProjects, archiveProjects, caseStudyProjects, liveSiteProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projekt",
  description: `${copy.brand.name}s portfölj: webbprojekt, appar och före/efter-omskrivningar.`,
};

function Section({
  id,
  title,
  lead,
  children,
}: {
  id?: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-16 scroll-mt-24">
      <h2 className="display text-2xl sm:text-3xl">{title}</h2>
      {lead ? <p className="mt-3 max-w-2xl text-sm text-muted">{lead}</p> : null}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

export default function ProjectsPage() {
  const live = liveSiteProjects().filter((p) => p.slug !== "hubberty");
  const cases = caseStudyProjects();
  const apps = appProjects();
  const archive = archiveProjects();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="display text-4xl sm:text-5xl">Projekt</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Webbprojekt, appar och omskrivningar. Appar som inte är lanserade går inte att köpa eller ladda ner.
      </p>
      <Section id="sajter" title="Utvalda projekt">
        {live.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </Section>
      <section className="mt-16">
        <h2 className="display text-2xl sm:text-3xl">Samma företag. Ny webbplats.</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Se hur äldre webbplatser får tydligare innehåll, bättre struktur och ett nytt uttryck.
        </p>
        <div className="mt-8">
          <CaseCarouselSection projects={cases} />
        </div>
      </section>
      <Section
        id="appar"
        title="Appar & verktyg"
        lead="Inte lanserade. Korten leder till mer om läget — inte till en butik."
      >
        {apps.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </Section>
      <Section id="tidigare" title="Tidigare uppdrag" lead="Administrerat tidigare. Ingen mer utveckling planerad.">
        {archive.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </Section>
    </div>
  );
}
