"use client";

import { useMemo, type CSSProperties } from "react";
import { findsForProgress, nisseCatalog, type NisseFind } from "@/lib/analyzer/nisse";
import type { ScanStageId } from "@/lib/analyzer/scan-stages";
import { cn } from "@/lib/utils";

function NisseFigure({ rummage }: { rummage: boolean }) {
  return (
    <svg viewBox="0 0 88 148" className={cn("nisse-figure", rummage && "nisse-rummage")} aria-hidden>
      <defs>
        <linearGradient id="nisse-coat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a322c" />
          <stop offset="100%" stopColor="#1c1816" />
        </linearGradient>
        <linearGradient id="nisse-ion" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7dffb3" />
          <stop offset="100%" stopColor="#e8c07a" />
        </linearGradient>
      </defs>
      <ellipse cx="44" cy="142" rx="22" ry="5" fill="#000" opacity="0.35" />
      <path d="M28 118 L32 142 L42 142 L40 118 Z" fill="#1a1410" />
      <path d="M48 118 L50 142 L62 142 L58 118 Z" fill="#241c16" />
      <path d="M30 70 L58 68 L62 118 L28 120 Z" fill="url(#nisse-coat)" />
      <path d="M30 78 L58 76 L57 88 L32 90 Z" fill="#c45c28" opacity="0.9" />
      <path d="M36 82 L52 81 L51 86 L37 87 Z" fill="#7dffb3" opacity="0.35" />
      <path d="M18 74 L32 80 L30 96 L16 92 Z" fill="#2a2420" />
      <path d="M58 72 L78 64 L80 78 L60 88 Z" fill="#2a2420" />
      <path d="M76 52 L86 70 L80 78 L70 62 Z" fill="#8a9098" />
      <circle cx="82" cy="66" r="3" fill="#e8c07a" />
      <path d="M34 28 L54 26 L58 70 L30 72 Z" fill="#c4a088" />
      <path d="M32 22 L60 18 L62 32 L30 34 Z" fill="#1a1410" />
      <path d="M28 30 L64 28 L63 42 L30 43 Z" fill="#0e0c0b" />
      <rect x="34" y="32" width="10" height="6" rx="1" fill="#7dffb3" opacity="0.85" />
      <rect x="48" y="31" width="10" height="6" rx="1" fill="#7dffb3" opacity="0.7" />
      <path d="M38 48 L50 47 L49 52 L39 53 Z" fill="#5c3317" />
      <path d="M40 18 L48 8 L56 20" fill="none" stroke="#e8c07a" strokeWidth="1.4" />
    </svg>
  );
}

function heapStyle(find: NisseFind, i: number, side: "l" | "r"): CSSProperties {
  const rot = ((find.id.charCodeAt(0) + i * 17) % 52) - 26;
  const x = (i % 3) * 26 + (side === "l" ? 6 : 12);
  const y = Math.floor(i / 3) * 18 + (i % 2) * 8;
  const land = `translate(${x}px, ${-y}px) rotate(${rot}deg)`;
  return {
    ["--nisse-land" as string]: land,
    animationDelay: `${Math.min(i * 0.14, 1.6)}s`,
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
      <div className="mt-4 flex items-start gap-4 border border-line bg-black/30 p-4">
        <NisseFigure rummage={false} />
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ion">Skrot-Nisse · lugnt läge</p>
          <p className="display mt-2 text-xl leading-snug">{mutter}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {revealed.slice(0, 8).map((f) => (
              <li
                key={f.id}
                className={cn(
                  "border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]",
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
    <div className="nisse-field pointer-events-none absolute inset-0 z-10 overflow-visible">
      <div className={cn("nisse-walker", inPage ? "nisse-walker--in" : "nisse-walker--enter")}>
        <NisseFigure rummage={inPage} />
        <span className="sr-only">Skrot-Nisse rotar i sidans skrot.</span>
      </div>
      <p className="nisse-mutter display absolute left-[16%] top-3 max-w-[72%] text-lg leading-tight text-fg sm:text-2xl">
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
