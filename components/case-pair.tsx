import { cn } from "@/lib/utils";

export function CasePair({
  name,
  beforeSrc,
  afterSrc,
  className,
}: {
  name: string;
  beforeSrc?: string;
  afterSrc?: string;
  className?: string;
}) {
  return (
    <div className={cn("grid sm:grid-cols-2", className)}>
      <Frame label="Tidigare webbplats" src={beforeSrc} name={name} />
      <Frame label="Ny version" src={afterSrc} name={name} />
    </div>
  );
}

function Frame({ label, src, name }: { label: string; src?: string; name: string }) {
  return (
    <figure className="relative min-h-52 overflow-hidden bg-[#0c0e14] sm:min-h-64">
      {src ? (
        <img src={src} alt={`${name}, ${label.toLowerCase()}`} className="h-52 w-full object-cover sm:h-64" />
      ) : (
        <div className="grid h-52 place-items-center sm:h-64">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">{label}</span>
        </div>
      )}
      {src ? (
        <figcaption className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-fg/85">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}
