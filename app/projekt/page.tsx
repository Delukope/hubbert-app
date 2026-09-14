import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projekt",
  description: "Webbprojekt av Konny Pettersson — från Akalacity till Huberty.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-gold">Portfolio</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">Sju sajter. En linje.</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Inte ett temaförråd — utvalda ytor med egna problem. Klicka in för fallstudie, eller kör dem genom
        analysen.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </div>
  );
}
