"use client";

import { useMemo, type CSSProperties } from "react";
import { findsForProgress, nisseCatalog, type NisseFind } from "@/lib/analyzer/nisse";
import type { ScanStageId } from "@/lib/analyzer/scan-stages";
import { cn } from "@/lib/utils";

function PixelNisse({ rummage }: { rummage: boolean }) {
  return (
    <svg
      viewBox="0 0 16 24"
      className={cn("nisse-sprite h-14 w-10", rummage && "nisse-rummage")}
      shapeRendering="crispEdges"
      aria-hidden
    >
      <rect x="4" y="1" width="8" height="2" fill="#c45c28" />
      <rect x="3" y="2" width="10" height="2" fill="#a3471c" />
      <rect x="5" y="3" width="6" height="4" fill="#e8b896" />
      <rect x="5" y="4" width="2" height="2" fill="#1a120e" />
      <rect x="9" y="4" width="2" height="2" fill="#1a120e" />
      <rect x="7" y="6" width="2" height="1" fill="#7a3a22" />
      <rect x="4" y="8" width="8" height="6" fill="#6b8f4a" />
      <rect x="5" y="9" width="6" height="2" fill="#c9a227" />
      <rect x="3" y="9" width="2" height="4" fill="#e8b896" />
      <rect x="11" y="8" width="4" height="2" fill="#8a8f98" />
      <rect x="13" y="7" width="2" height="2" fill="#d4d0c4" />
      <rect x="4" y="14" width="3" height="5" fill="#3d4654" />
      <rect x="9" y="14" width="3" height="5" fill="#3d4654" />
      <rect x="4" y="19" width="3" height="3" fill="#5c3310" />
      <rect x="9" y="19" width="3" height="3" fill="#5c3310" />
      <rect x="2" y="11" width="2" height="2" fill="#7a3a22" />
    </svg>
  );
}

function heapStyle(find: NisseFind, i: number, side: "l" | "r"): CSSProperties {
  const rot = ((find.id.charCodeAt(0) + i * 17) % 46) - 23;
  const x = (i % 3) * 22 + (side === "l" ? 4 : 10);
  const y = Math.floor(i / 3) * 14 + (i % 2) * 6;
  const land = `translate(${x}px, ${-y}px) rotate(${rot}deg)`;
  return {
    ["--nisse-land" as string]: land,
    animationDelay: `${Math.min(i * 0.12, 1.4)}s`,
  };
}

export function SkrotNisse({
  seed,
  percent,
  stage,
  reduced,
  active,
}: {
  seed: string;
  percent: number;
  stage: ScanStageId;
  reduced: boolean;
  active: boolean;
}) {
  const { finds, mutters } = useMemo(() => nisseCatalog(seed), [seed]);
  const revealed = useMemo(() => findsForProgress(finds, percent, stage), [finds, percent, stage]);
  const mutter = mutters[Math.min(mutters.length - 1, Math.floor(percent / 12))] ?? mutters[0];
  const inPage = active && percent > 10;
  const leftHeap = revealed.filter((_, i) => i % 2 === 0);
  const rightHeap = revealed.filter((_, i) => i % 2 === 1);

  if (reduced) {
    return (
      <div className="flex items-start gap-4 border border-line bg-black/25 p-3">
        <PixelNisse rummage={false} />
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ion">Skrot-Nisse · lugnt läge</p>
          <p className="mt-1 text-sm text-fg">{mutter}</p>
          <ul className="mt-2 flex flex-wrap gap-1">
            {revealed.slice(0, 8).map((f) => (
              <li
                key={f.id}
                className={cn(
                  "font-mono text-[10px] uppercase tracking-[0.08em]",
                  f.decoy ? "text-warn" : "text-muted",
                )}
              >
                {f.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="nisse-field pointer-events-none absolute inset-0 z-10 overflow-visible" aria-hidden>
      <div className={cn("nisse-walker", inPage ? "nisse-walker--in" : "nisse-walker--enter")}>
        <PixelNisse rummage={inPage} />
        <span className="sr-only">Skrot-Nisse rotar i sidans skrot.</span>
      </div>
      <p className="nisse-mutter absolute left-[18%] top-2 max-w-[70%] font-mono text-[10px] leading-4 text-ion sm:text-[11px]">
        {mutter}
      </p>
      <div className="nisse-heap nisse-heap--l">
        {leftHeap.map((f, i) => (
          <span key={f.id} className={cn("nisse-scrap", f.decoy && "nisse-scrap--decoy")} style={heapStyle(f, i, "l")}>
            {f.label}
          </span>
        ))}
      </div>
      <div className="nisse-heap nisse-heap--r">
        {rightHeap.map((f, i) => (
          <span key={f.id} className={cn("nisse-scrap", f.decoy && "nisse-scrap--decoy")} style={heapStyle(f, i, "r")}>
            {f.label}
          </span>
        ))}
      </div>
    </div>
  );
}
