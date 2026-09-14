import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { appProjects, archiveProjects, showcaseProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projekt",
  description: "Hubberts portfölj: Akalasi, Värmlands Trädfällning, Filipsson Entreprenad och appar under utveckling.",
};

function Section({
  kicker,
  title,
  lead,
  children,
}: {
  kicker: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-16">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{kicker}</p>
      <h2 className="display mt-2 text-2xl sm:text-3xl">{title}</h2>
      {lead ? <p className="mt-3 max-w-2xl text-sm text-muted">{lead}</p> : null}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

export default function ProjectsPage() {
  const showcase = showcaseProjects();
  const apps = appProjects();
  const archive = archiveProjects();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-gold">Portfolio</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">Sajter att bära. Appar på väg.</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Konny styr och förbättrar de aktiva sajterna. Apparna är vision. Det som ligger under tidigare uppdrag
        administreras inte vidare.
      </p>
      <Section kicker="Aktuellt" title="Sajter i arbete">
        {showcase.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </Section>
      <Section
        kicker="Appar"
        title="Under utveckling"
        lead="Produktidéer — inte livesajter. Arbetsnamn kan bytas."
      >
        {apps.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </Section>
      <Section
        kicker="Tidigare"
        title="Inte aktiv linje"
        lead="Administrerat tidigare. Ingen mer utveckling planerad."
      >
        {archive.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </Section>
    </div>
  );
}
