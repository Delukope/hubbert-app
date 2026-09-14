"use client";

import { useId, useMemo, type CSSProperties } from "react";
import { findsForProgress, nisseCatalog, type NisseFind } from "@/lib/analyzer/nisse";
import type { ScanStageId } from "@/lib/analyzer/scan-stages";
import { cn } from "@/lib/utils";

function NisseFigure({ rummage }: { rummage: boolean }) {
  const uid = `n${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg viewBox="0 0 140 228" className={cn("nisse-figure", rummage && "nisse-rummage")} aria-hidden>
      <defs>
        <linearGradient id={`${uid}-coat`} x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#4a4038" />
          <stop offset="42%" stopColor="#2a2420" />
          <stop offset="100%" stopColor="#14110f" />
        </linearGradient>
        <linearGradient id={`${uid}-rust`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d06a32" />
          <stop offset="100%" stopColor="#8a3418" />
        </linearGradient>
        <linearGradient id={`${uid}-skin`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e2b896" />
          <stop offset="100%" stopColor="#b07a58" />
        </linearGradient>
        <linearGradient id={`${uid}-visor`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7dffb3" />
          <stop offset="55%" stopColor="#c8ffe4" />
          <stop offset="100%" stopColor="#e8c07a" />
        </linearGradient>
        <linearGradient id={`${uid}-steel`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d8dde4" />
          <stop offset="100%" stopColor="#6a727c" />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="70" cy="218" rx="34" ry="6" fill="#000" opacity="0.38" />

      <path d="M42 168 L34 214 L54 216 L56 170 Z" fill="#1a1410" />
      <path d="M72 166 L74 214 L98 216 L90 168 Z" fill="#241c16" />
      <path d="M32 206 L34 216 L56 218 L54 206 Z" fill="#0c0a09" />
      <path d="M72 204 L74 216 L100 218 L96 204 Z" fill="#0c0a09" />
      <path d="M40 206 H52" stroke="#e8c07a" strokeWidth="1.2" opacity="0.55" />
      <path d="M80 204 H94" stroke="#e8c07a" strokeWidth="1.2" opacity="0.55" />

      <g className="nisse-arm nisse-arm--back">
        <path d="M40 88 C22 104 14 132 22 148 L34 146 C30 132 34 110 46 96 Z" fill="#2a2420" />
        <path d="M18 144 L10 158 L28 162 L34 148 Z" fill="#1c1816" />
        <circle cx="16" cy="156" r="3.2" fill="#e8c07a" />
      </g>

      <path d="M44 78 L92 72 L100 168 L38 172 Z" fill={`url(#${uid}-coat)`} />
      <path d="M52 80 L88 76 L90 128 L50 132 Z" fill="#1c1816" opacity="0.35" />
      <path d="M46 98 L96 92 L94 118 L44 124 Z" fill={`url(#${uid}-rust)`} />
      <path d="M54 104 L86 100 L85 108 L55 112 Z" fill="#7dffb3" opacity="0.22" />
      <path d="M48 82 L58 138" stroke="#e8c07a" strokeWidth="0.7" opacity="0.35" />
      <circle cx="50" cy="90" r="1.6" fill="#e8c07a" />
      <circle cx="50" cy="112" r="1.6" fill="#e8c07a" />
      <circle cx="92" cy="88" r="1.6" fill="#e8c07a" />
      <circle cx="92" cy="110" r="1.6" fill="#e8c07a" />

      <path d="M40 138 L102 134 L100 150 L38 154 Z" fill="#12100e" />
      <rect x="64" y="136" width="14" height="12" rx="1.5" fill="#e8c07a" />
      <path d="M42 152 L38 168 L46 168 L48 152" fill="#c45c28" />
      <path d="M96 148 L104 166 L112 164 L102 146" fill="#7dffb3" opacity="0.55" />
      <rect x="54" y="150" width="8" height="14" rx="1" fill="#2a2420" stroke="#e8c07a" strokeWidth="0.6" />

      <g className="nisse-arm nisse-arm--throw">
        <path d="M88 86 C108 78 124 92 128 112 L114 118 C112 102 100 94 88 98 Z" fill="#2a2420" />
        <path d="M118 108 L136 96 L140 108 L124 122 Z" fill="#1c1816" />
        <g filter={`url(#${uid}-glow)`}>
          <path
            d="M128 86 L148 118 L140 124 L132 110 L124 116 L120 108 Z"
            fill={`url(#${uid}-steel)`}
            stroke="#e8c07a"
            strokeWidth="0.8"
          />
          <circle cx="146" cy="120" r="4.2" fill="none" stroke={`url(#${uid}-visor)`} strokeWidth="2.2" />
        </g>
      </g>

      <path d="M54 70 L80 66 L84 86 L52 88 Z" fill={`url(#${uid}-skin)`} />
      <path d="M48 28 L86 20 L94 78 L46 82 Z" fill={`url(#${uid}-skin)`} />
      <path d="M46 18 C62 6 90 8 96 28 L98 48 L44 54 Z" fill="#161210" />
      <path d="M50 24 L90 18 L92 42 L48 46 Z" fill="#0c0a09" />
      <path
        d="M52 34 L90 30 L89 48 L53 50 Z"
        fill="#061410"
        stroke={`url(#${uid}-visor)`}
        strokeWidth="1.4"
        filter={`url(#${uid}-glow)`}
      />
      <rect x="56" y="36" width="12" height="9" rx="1.2" fill={`url(#${uid}-visor)`} />
      <rect x="72" y="35" width="12" height="9" rx="1.2" fill={`url(#${uid}-visor)`} opacity="0.85" />
      <path d="M58 56 L80 54 L78 62 L58 63 Z" fill="#5c3317" />
      <path d="M62 14 L72 2 L80 16" fill="none" stroke="#e8c07a" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="72" cy="2" r="2.4" fill="#7dffb3" filter={`url(#${uid}-glow)`} />
    </svg>
  );
}

function heapStyle(find: NisseFind, i: number, side: "l" | "r"): CSSProperties {
  const h = find.id.charCodeAt(0) + find.id.charCodeAt(Math.min(4, find.id.length - 1)) + i * 23;
  const rot = (h % 78) - 39;
  const x = (i % 4) * 20 + (side === "l" ? 2 : 8) + (h % 19);
  const y = Math.floor(i / 3) * 15 + (i % 3) * 8 + (h % 13);
  const fromX = side === "l" ? 110 : -70;
  return {
    ["--nisse-land" as string]: `translate(${x}px, ${-y}px) rotate(${rot}deg)`,
    ["--nisse-from" as string]: `translate(${fromX}px, -92px) rotate(${rot > 0 ? -22 : 18}deg) scale(0.42)`,
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
      <p className="nisse-mutter display absolute left-[18%] top-3 max-w-[70%] text-lg leading-tight text-fg sm:text-2xl">
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
