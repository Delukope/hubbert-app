import Link from "next/link";
import type { Project } from "@/lib/projects";
import { publicFileExists } from "@/lib/public-file";

function Frame({
  caption,
  src,
  exists,
}: {
  caption: string;
  src?: string;
  exists: boolean;
}) {
  return (
    <figure className="min-h-[140px] flex-1">
      {exists && src ? (
        <img src={src} alt={caption} className="h-40 w-full object-cover" />
      ) : (
        <div className="grid h-40 place-items-center border border-dashed border-line bg-white/2">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">{caption}</p>
        </div>
      )}
      <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{caption}</figcaption>
    </figure>
  );
}

export async function CaseStudyCard({ project }: { project: Project }) {
  const slot = project.caseStudy;
  if (!slot) return null;
  const before = await publicFileExists(slot.beforeSrc);
  const after = await publicFileExists(slot.afterSrc);
  return (
    <article className="border border-line p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="display text-2xl">{project.name}</h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ion">{slot.label}</span>
      </div>
      <p className="mt-1 font-mono text-xs text-muted">{project.domain}</p>
      <p className="mt-3 text-sm leading-6 text-muted">{project.summary}</p>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row">
        <Frame caption="Före" src={slot.beforeSrc} exists={before} />
        <Frame caption="Efter — kommer" src={slot.afterSrc} exists={after} />
      </div>
      <Link href={`/projekt/${project.slug}`} className="mt-4 inline-flex font-mono text-[11px] uppercase tracking-[0.18em] text-ion hover:underline">
        Läs mer
      </Link>
    </article>
  );
}
