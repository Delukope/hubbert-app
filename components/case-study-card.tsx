import { CasePair } from "@/components/case-pair";
import type { Project } from "@/lib/projects";
import { resolvePublicCover } from "@/lib/public-file";

export async function CaseStudyCard({ project }: { project: Project }) {
  const slot = project.caseStudy;
  if (!slot) return null;
  const beforeSrc = await resolvePublicCover(slot.beforeSrc);
  const afterSrc = await resolvePublicCover(slot.afterSrc);
  if (!beforeSrc && !afterSrc) return null;
  return (
    <div className="overflow-hidden border border-line">
      <CasePair name={project.name} beforeSrc={beforeSrc} afterSrc={afterSrc} />
    </div>
  );
}
