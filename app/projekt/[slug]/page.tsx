import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getProject, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projekt/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: PageProps<"/projekt/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link href="/projekt" className="text-sm text-muted hover:text-fg">
        ← Alla projekt
      </Link>
      <div className="mt-8 overflow-hidden rounded-[2rem] border border-line">
        <div
          className="h-48"
          style={{
            background: `radial-gradient(90% 120% at 80% 10%, ${project.accent}55, transparent 50%), linear-gradient(135deg, #0c0e14, ${project.accentTo}22)`,
          }}
        />
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <Badge>{project.domain}</Badge>
        <Badge>{project.year}</Badge>
        {project.status === "wip" ? <Badge className="text-gold">Pågår</Badge> : null}
      </div>
      <h1 className="display mt-4 text-4xl sm:text-5xl">{project.name}</h1>
      <p className="mt-3 text-muted">{project.role}</p>
      <p className="mt-6 text-lg leading-8">{project.summary}</p>
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="display text-2xl">Problem</h2>
          <p className="mt-3 leading-7 text-muted">{project.problem}</p>
        </div>
        <div>
          <h2 className="display text-2xl">Angreppssätt</h2>
          <p className="mt-3 leading-7 text-muted">{project.approach}</p>
        </div>
        <div>
          <h2 className="display text-2xl">Läge</h2>
          <p className="mt-3 leading-7 text-muted">{project.outcome}</p>
        </div>
      </section>
      <div className="mt-12 flex flex-wrap gap-3">
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-line px-5 py-3 text-sm hover:border-gold/40"
        >
          Besök {project.domain}
        </a>
        <Link
          href={`/analys?url=${encodeURIComponent(project.url)}`}
          className="rounded-full bg-gold px-5 py-3 text-sm font-medium text-[#1a1408]"
        >
          Analysera i Huberty
        </Link>
      </div>
    </div>
  );
}
