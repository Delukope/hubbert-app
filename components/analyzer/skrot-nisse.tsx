"use client";

import { useId, useMemo, type CSSProperties } from "react";
import { findsForProgress, nisseCatalog, type NisseFind } from "@/lib/analyzer/nisse";
import type { ScanStageId } from "@/lib/analyzer/scan-stages";
import { cn } from "@/lib/utils";

function NisseFigure({ rummage }: { rummage: boolean }) {
  const uid = `n${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg viewBox="0 0 168 248" className={cn("nisse-figure", rummage && "nisse-rummage")} aria-hidden>
      <defs>
        <linearGradient id={`${uid}-hat`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#3d342c" />
          <stop offset="100%" stopColor="#14110e" />
        </linearGradient>
        <linearGradient id={`${uid}-coat`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#4a4038" />
          <stop offset="55%" stopColor="#26201c" />
          <stop offset="100%" stopColor="#12100e" />
        </linearGradient>
        <linearGradient id={`${uid}-rust`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e07a3a" />
          <stop offset="100%" stopColor="#8c3514" />
        </linearGradient>
        <linearGradient id={`${uid}-skin`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0c4a2" />
          <stop offset="100%" stopColor="#b07a54" />
        </linearGradient>
        <linearGradient id={`${uid}-ion`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7dffb3" />
          <stop offset="100%" stopColor="#e8c07a" />
        </linearGradient>
        <linearGradient id={`${uid}-steel`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eef2f6" />
          <stop offset="100%" stopColor="#6a727c" />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="84" cy="238" rx="40" ry="7" fill="#000" opacity="0.4" />

      <path d="M52 176 L42 228 L66 230 L70 178 Z" fill="#1a1410" />
      <path d="M90 174 L94 228 L122 230 L112 176 Z" fill="#241c16" />
      <path d="M40 218 C42 232 66 234 68 220 Z" fill="#0b0908" />
      <path d="M92 216 C96 232 124 234 120 218 Z" fill="#0b0908" />
      <path d="M46 220 H62" stroke="#e8c07a" strokeWidth="1.4" opacity="0.7" />
      <path d="M100 218 H116" stroke="#e8c07a" strokeWidth="1.4" opacity="0.7" />

      <g className="nisse-arm nisse-arm--back">
        <path d="M52 96 C28 118 22 150 32 168 L48 162 C42 146 48 118 62 104 Z" fill="#2c2622" />
        <path d="M28 164 L18 180 L40 184 L48 166 Z" fill="#1a1614" />
        <circle cx="24" cy="176" r="3.4" fill="#e8c07a" />
      </g>

      <path d="M54 90 L118 82 L128 176 L46 182 Z" fill={`url(#${uid}-coat)`} />
      <path d="M64 96 L110 90 L114 140 L62 146 Z" fill="#1a1614" opacity="0.28" />
      <path d="M56 112 L124 104 L120 132 L54 140 Z" fill={`url(#${uid}-rust)`} />
      <path d="M68 118 L108 112 L106 122 L68 128 Z" fill="#7dffb3" opacity="0.2" />
      <circle cx="62" cy="104" r="2" fill="#e8c07a" />
      <circle cx="62" cy="128" r="2" fill="#e8c07a" />
      <circle cx="116" cy="100" r="2" fill="#e8c07a" />
      <circle cx="116" cy="124" r="2" fill="#e8c07a" />

      <path d="M48 148 L130 142 L128 160 L46 166 Z" fill="#0e0c0b" />
      <rect x="78" y="144" width="16" height="14" rx="2" fill="#e8c07a" />
      <path d="M52 164 L46 182 L56 182 L58 164 Z" fill="#c45c28" />
      <path d="M118 158 L128 178 L138 174 L126 156 Z" fill="#7dffb3" opacity="0.55" />

      <g className="nisse-arm nisse-arm--throw">
        <path d="M112 96 C138 86 154 104 158 128 L140 134 C138 114 124 104 112 108 Z" fill="#2c2622" />
        <path d="M146 124 L166 110 L172 124 L152 140 Z" fill="#1a1614" />
        <g filter={`url(#${uid}-glow)`}>
          <path
            d="M158 96 L180 134 L170 140 L160 122 L150 130 L144 120 Z"
            fill={`url(#${uid}-steel)`}
            stroke="#e8c07a"
            strokeWidth="1"
          />
          <circle cx="178" cy="136" r="5.2" fill="none" stroke={`url(#${uid}-ion)`} strokeWidth="2.4" />
        </g>
      </g>

      <path d="M70 78 L98 74 L102 94 L68 96 Z" fill={`url(#${uid}-skin)`} />
      <ellipse cx="84" cy="72" rx="26" ry="22" fill={`url(#${uid}-skin)`} />
      <path d="M84 4 L124 78 L44 78 Z" fill={`url(#${uid}-hat)`} />
      <path d="M84 10 L114 72 L54 72 Z" fill="#1c1814" opacity="0.35" />
      <path d="M42 74 L126 70 L128 84 L40 88 Z" fill="#0c0a09" />
      <path d="M50 78 L118 74" stroke="#e8c07a" strokeWidth="1.6" />
      <g filter={`url(#${uid}-glow)`}>
        <rect x="58" y="62" width="22" height="12" rx="6" fill="#061410" stroke={`url(#${uid}-ion)`} strokeWidth="1.6" />
        <rect x="88" y="61" width="22" height="12" rx="6" fill="#061410" stroke={`url(#${uid}-ion)`} strokeWidth="1.6" />
        <rect x="64" y="65" width="12" height="6" rx="3" fill={`url(#${uid}-ion)`} />
        <rect x="94" y="64" width="12" height="6" rx="3" fill={`url(#${uid}-ion)`} opacity="0.88" />
        <path d="M80 68 H88" stroke={`url(#${uid}-ion)`} strokeWidth="2" />
      </g>
      <path d="M72 82 L96 80 L94 88 L72 89 Z" fill="#6a3a1c" />
      <circle cx="84" cy="6" r="3.2" fill="#7dffb3" filter={`url(#${uid}-glow)`} />
    </svg>
  );
}

function heapStyle(find: NisseFind, i: number, side: "l" | "r"): CSSProperties {
  const h = find.id.charCodeAt(0) + find.id.charCodeAt(Math.min(4, find.id.length - 1)) + i * 23;
  const rot = (h % 78) - 39;
  const x = (i % 4) * 22 + (side === "l" ? 8 : 14) + (h % 18);
  const y = Math.floor(i / 3) * 16 + (i % 3) * 7 + (h % 12);
  const fromX = side === "l" ? 90 : -60;
  return {
    ["--nisse-land" as string]: `translate(${x}px, ${-y}px) rotate(${rot}deg)`,
    ["--nisse-from" as string]: `translate(${fromX}px, -70px) rotate(${rot > 0 ? -22 : 18}deg) scale(0.42)`,
    animationDelay: `${Math.min(i * 0.12, 1.7)}s`,
    zIndex: 4 + (i % 6),
    fontSize: `${10 + (i % 3)}px`,
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
  const inPage = active && percent > 8;
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
      <p className="nisse-mutter display absolute left-[14%] top-3 max-w-[72%] text-base leading-tight text-fg sm:text-xl">
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
