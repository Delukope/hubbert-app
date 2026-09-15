import Image from "next/image";
import Link from "next/link";
import { statusLabel, type Project } from "@/lib/projects";
import { resolvePublicCover } from "@/lib/public-file";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function Pattern({ project }: { project: Project }) {
  const a = project.accent;
  const b = project.accentTo;
  if (project.pattern === "orbit") {
    return (
      <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={`${project.slug}-g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={a} />
            <stop offset="100%" stopColor={b} />
          </linearGradient>
        </defs>
        <circle cx="260" cy="90" r="88" fill="none" stroke={`url(#${project.slug}-g)`} strokeWidth="1.2" opacity="0.7" />
        <circle cx="260" cy="90" r="54" fill="none" stroke={a} strokeWidth="1" opacity="0.45" />
        <circle cx="260" cy="90" r="8" fill={a} />
        <path d="M20 180 C 120 40, 200 200, 380 70" fill="none" stroke={b} strokeWidth="1.4" opacity="0.5" />
      </svg>
    );
  }
  if (project.pattern === "wave") {
    return (
      <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden>
        <path d="M0 140 Q 80 80 160 140 T 320 140 T 480 140 V 220 H 0 Z" fill={a} opacity="0.25" />
        <path d="M0 160 Q 90 110 180 160 T 360 160 T 520 160" fill="none" stroke={b} strokeWidth="2" />
      </svg>
    );
  }
  if (project.pattern === "grid") {
    return (
      <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x={40 + (i % 4) * 80}
            y={40 + Math.floor(i / 4) * 80}
            width="48"
            height="48"
            rx="8"
            fill={i % 2 ? a : b}
            opacity={0.25 + (i % 3) * 0.12}
          />
        ))}
      </svg>
    );
  }
  if (project.pattern === "bars") {
    return (
      <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden>
        {[40, 90, 70, 120, 55, 100, 80].map((h, i) => (
          <rect key={i} x={40 + i * 48} y={200 - h} width="28" height={h} rx="6" fill={i % 2 ? a : b} opacity="0.55" />
        ))}
      </svg>
    );
  }
  if (project.pattern === "hex") {
    return (
      <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden>
        {["80,110 120,86 160,110 160,158 120,182 80,158", "200,70 240,46 280,70 280,118 240,142 200,118", "260,140 300,116 340,140 340,188 300,212 260,188"].map(
          (p, i) => (
            <polygon key={i} points={p} fill="none" stroke={i ? b : a} strokeWidth="1.4" opacity="0.7" />
          ),
        )}
      </svg>
    );
  }
  if (project.pattern === "pulse") {
    return (
      <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden>
        <polyline
          points="20,120 70,120 90,60 120,170 150,100 180,120 390,120"
          fill="none"
          stroke={a}
          strokeWidth="2"
        />
        <circle cx="90" cy="60" r="5" fill={b} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden>
      <circle cx="200" cy="110" r="70" fill="none" stroke={a} strokeWidth="1.2" />
      <circle cx="200" cy="110" r="38" fill={b} opacity="0.2" />
      <circle cx="200" cy="110" r="6" fill={a} />
    </svg>
  );
}

function BrandSlot({ project }: { project: Project }) {
  const label = project.domain ?? project.name;
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `radial-gradient(90% 120% at 8% 110%, ${project.accent}3d, transparent 58%), radial-gradient(80% 100% at 100% -10%, ${project.accentTo}36, transparent 52%), linear-gradient(165deg, #0b0d12 0%, #141821 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{ background: `linear-gradient(to top, ${project.accent}14, transparent)` }}
        aria-hidden
      />
      <p className="absolute bottom-5 left-5 font-mono text-[13px] uppercase tracking-[0.22em] text-fg/90">
        {label}
      </p>
    </div>
  );
}

export async function ProjectCover({
  project,
  featured,
  className,
  variant = "card",
}: {
  project: Project;
  featured?: boolean;
  className?: string;
  variant?: "card" | "hero";
}) {
  const primary = project.coverSrc ?? project.image;
  const compact = variant === "card" && !featured && project.coverSrcCompact;
  const preferred =
    variant === "hero" ? (project.heroSrc ?? primary) : compact ? project.coverSrcCompact : primary;
  const cover = (await resolvePublicCover(preferred)) ?? (await resolvePublicCover(primary));
  const fitContain = project.coverFit === "contain" || Boolean(preferred?.includes("/brands/") || preferred?.includes("/hubrix/"));
  return (
    <div
      className={cn("relative overflow-hidden", className ?? "h-40")}
      style={{ background: "#0c0e14" }}
    >
      {cover ? (
        <div className={cn("absolute inset-0", fitContain && "inset-5 sm:inset-6")}>
          <Image
            src={cover}
            alt={project.name}
            fill
            sizes={featured || variant === "hero" ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 640px) 33vw, 100vw"}
            className={fitContain ? "object-contain" : "object-cover"}
            priority={featured || variant === "hero"}
          />
        </div>
      ) : primary ? (
        <BrandSlot project={project} />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 80% at 80% 20%, ${project.accent}33, transparent 55%), #0c0e14`,
          }}
        >
          <Pattern project={project} />
        </div>
      )}
    </div>
  );
}

export function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  return (
    <Link
      href={`/projekt/${project.slug}`}
      className={cn(
        "group glass flex flex-col overflow-hidden transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-ion/35",
        featured && "md:min-h-[340px]",
      )}
    >
      <div className="relative">
        <ProjectCover project={project} featured={featured} className={featured ? "h-44 sm:h-52" : undefined} />
        <div className="absolute left-4 top-4 z-10 flex gap-2">
          <Badge className="bg-black/30 text-fg">{project.domain ?? "App"}</Badge>
          {project.callout ? (
            <Badge className="border-ion/40 text-ion">{project.callout}</Badge>
          ) : project.status !== "live" ? (
            <Badge className={project.status === "wip" ? "border-ion/40 text-ion" : "text-muted"}>
              {statusLabel(project.status, project)}
            </Badge>
          ) : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="display text-xl tracking-tight">{project.name}</h3>
          <span className="font-mono text-xs text-muted">{project.year}</span>
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-muted">{project.summary}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {project.tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
