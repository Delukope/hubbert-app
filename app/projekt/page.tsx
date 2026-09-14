import type { ReactNode } from "react";
import type { Metadata } from "next";
import { CaseStudyCard } from "@/components/case-study-card";
import { ProjectCard } from "@/components/project-card";
import { appProjects, archiveProjects, caseStudyProjects, liveSiteProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projekt",
  description:
    "Hubberts portfölj på hubberty.se: Akalasi, före/efter-case för Fallatrad och Filipsson, appar under utveckling.",
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
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">{kicker}</p>
      <h2 className="display mt-2 text-2xl sm:text-3xl">{title}</h2>
      {lead ? <p className="mt-3 max-w-2xl text-sm text-muted">{lead}</p> : null}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

export default function ProjectsPage() {
  const live = liveSiteProjects();
  const cases = caseStudyProjects();
  const apps = appProjects();
  const archive = archiveProjects();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ion">Portfolio · hubberty.se</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">Sajter att bära. Appar på väg.</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Live: Hubbert och Akalasi. Fallatrad och Filipsson är före/efter-slotar — inte färdiga case. Apparna är
        vision. Tidigare uppdrag administreras inte vidare.
      </p>
      <Section kicker="Live" title="Aktiva sajter">
        {live.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </Section>
      <section className="mt-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">Klientarbete</p>
        <h2 className="display mt-2 text-2xl sm:text-3xl">Före & efter — kommer</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Ramar för riktiga före/efter-assets. Inga fejkade screenshots.
        </p>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {cases.map((p) => (
            <CaseStudyCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
      <Section kicker="Appar" title="Under utveckling" lead="Produktidéer — inte livesajter. Arbetsnamn kan bytas.">
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
