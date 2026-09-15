import { CaseCarousel, type CaseSlide } from "@/components/case-carousel";
import { resolvePublicCover } from "@/lib/public-file";
import type { Project } from "@/lib/projects";

export async function CaseCarouselSection({ projects }: { projects: Project[] }) {
  const slides: CaseSlide[] = await Promise.all(
    projects.map(async (project) => ({
      slug: project.slug,
      name: project.name,
      domain: project.domain,
      href: `/projekt/${project.slug}`,
      beforeSrc: await resolvePublicCover(project.caseStudy?.beforeSrc),
      afterSrc: await resolvePublicCover(project.caseStudy?.afterSrc),
    })),
  );
  const ready = slides.filter((slide) => slide.beforeSrc || slide.afterSrc);
  if (ready.length === 0) return null;
  return <CaseCarousel slides={ready} />;
}
