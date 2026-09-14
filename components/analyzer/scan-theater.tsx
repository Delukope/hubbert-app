"use client";

import { useEffect, useMemo, useState } from "react";
import { SCAN_LOG_LINES, SCAN_STAGES, stageFromPercent } from "@/lib/analyzer/scan-stages";
import { cn } from "@/lib/utils";

function hostOf(url?: string) {
  if (!url) return "väntar på mål";
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0] || url;
  }
}

function pad(n: number) {
  return String(Math.max(0, Math.min(99, Math.round(n)))).padStart(2, "0");
}

export function ScanTheater({
  url,
  percent = 6,
  step,
  status = "queued",
  error,
  onRetry,
  boot = false,
  jobId,
  previewReady = false,
}: {
  url?: string;
  percent?: number;
  step?: string;
  status?: "queued" | "running" | "complete" | "error" | "boot";
  error?: string | null;
  onRetry?: () => void;
  boot?: boolean;
  jobId?: string;
  previewReady?: boolean;
}) {
  const [tick, setTick] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced || status === "error") return;
    const id = window.setInterval(() => setTick((t) => t + 1), 180);
    return () => window.clearInterval(id);
  }, [reduced, status]);

  const visual = useMemo(() => {
    if (status === "complete") return 100;
    if (status === "error") return percent;
    const drift = reduced ? 0 : Math.min(14, tick * 0.35);
    const ceiling = status === "boot" || boot ? 22 : 94;
    return Math.min(ceiling, Math.max(percent, percent + drift * 0.15 + Math.min(tick * 0.08, 8)));
  }, [percent, status, tick, reduced, boot]);

  const stage = stageFromPercent(visual);
  const logCount = Math.min(SCAN_LOG_LINES.length, 4 + Math.floor(visual / 7) + (tick % 3 === 0 ? 1 : 0));
  const host = hostOf(url);

  return (
    <div
      className="scan-theater relative overflow-hidden rounded-[1.5rem] border border-line"
      aria-busy={status !== "error" && status !== "complete"}
      aria-live="polite"
    >
      <div className="scan-theater__grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="scan-theater__beam pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)] lg:p-10">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ion">
            {status === "error" ? "Avbrott" : boot || status === "boot" ? "Upplåsning" : "Live-scan"}
          </p>
          <h1 className="display mt-3 max-w-xl text-3xl leading-[1.05] sm:text-5xl">
            {status === "error" ? "Skanningen nådde inte fram." : stage.verb}
          </h1>
          <p className="mt-3 font-mono text-sm text-ion/90" aria-live="polite">
            {host}
          </p>
          {step && status !== "error" ? (
            <p className="mt-2 text-sm text-muted">{step}</p>
          ) : null}

          {status === "error" ? (
            <div className="mt-6 max-w-lg rounded-sm border border-warn/40 bg-warn/8 p-4">
              <p className="text-sm text-fg" role="alert">
                {error || "Tillfällig störning mot analysmotorn."}
              </p>
              {onRetry ? (
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-4 inline-flex h-11 items-center rounded-sm bg-ion px-5 text-sm font-medium text-ink hover:brightness-110"
                >
                  Försök igen
                </button>
              ) : null}
            </div>
          ) : (
            <ol className="mt-8 space-y-3" aria-label="Skanningssteg">
              {SCAN_STAGES.map((s, i) => {
                const done = visual >= s.to;
                const current = stage.id === s.id;
                return (
                  <li key={s.id} className="flex items-baseline gap-4">
                    <span
                      className={cn(
                        "font-mono text-[11px] tracking-[0.2em]",
                        current ? "text-ion" : done ? "text-muted" : "text-muted/50",
                      )}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={cn(
                        "display text-lg sm:text-xl",
                        current ? "text-fg" : done ? "text-muted line-through decoration-white/20" : "text-muted/55",
                      )}
                    >
                      {s.label}
                    </span>
                    {current ? (
                      <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-ion sm:inline">
                        aktiv
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div
            className="relative overflow-hidden border border-line bg-black/40"
            style={{ aspectRatio: "16 / 10" }}
          >
            {jobId ? (
              <iframe
                title={`Förhandsvisning av ${host}`}
                src={`/api/analys/${jobId}/preview`}
                sandbox=""
                referrerPolicy="no-referrer"
                className="h-full w-full bg-[#07050a]"
              />
            ) : (
              <div className="grid h-full place-items-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                Hämtar yta
              </div>
            )}
            <p className="pointer-events-none absolute bottom-2 left-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ion">
              {previewReady ? "Sandlåda · inget JS" : "Väntar på HTML"}
            </p>
          </div>
          <div className="relative mx-auto grid h-36 w-36 place-items-center">
            <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
              <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeOpacity="0.12" />
              <circle cx="60" cy="60" r="38" fill="none" stroke="currentColor" strokeOpacity="0.18" />
              <circle cx="60" cy="60" r="22" fill="none" stroke="currentColor" strokeOpacity="0.28" />
              <g className={reduced ? undefined : "scan-sweep"}>
                <path d="M60 60 L60 6 A54 54 0 0 1 98 22 Z" fill="url(#sweep)" opacity="0.85" />
              </g>
              <defs>
                <linearGradient id="sweep" x1="60" y1="6" x2="98" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7dffb3" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#7dffb3" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute text-center">
              <p className="font-mono text-4xl tabular-nums tracking-tight text-ion">{pad(visual)}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">pct</p>
            </div>
          </div>
          <ul className="w-full font-mono text-[11px] leading-5 text-muted" aria-hidden={status === "error"}>
            {SCAN_LOG_LINES.slice(0, status === "error" ? 0 : logCount)
              .slice(-6)
              .map((line, i, arr) => (
                <li key={`${line}-${i}`} className={i === arr.length - 1 ? "text-ion" : undefined}>
                  <span className="text-muted/50">› </span>
                  {line}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
