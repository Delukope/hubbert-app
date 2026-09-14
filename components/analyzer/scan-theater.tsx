"use client";

import { useEffect, useMemo, useState } from "react";
import { SCAN_STAGES, stageFromPercent } from "@/lib/analyzer/scan-stages";
import { SkrotNisse } from "@/components/analyzer/skrot-nisse";
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
  const host = hostOf(url);
  const seed = jobId || url || "boot";

  return (
    <div
      className="scan-theater relative overflow-visible rounded-[1.5rem] border border-line"
      aria-busy={status !== "error" && status !== "complete"}
      aria-live="polite"
    >
      <div className="scan-theater__grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="scan-theater__beam pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ion">
              {status === "error" ? "Avbrott" : boot || status === "boot" ? "Nisse knyter kängorna" : "Skrot-Nisse"}
            </p>
            <h1 className="display mt-1 max-w-xl text-2xl leading-[1.08] sm:text-4xl">
              {status === "error" ? "Skanningen nådde inte fram." : stage.verb}
            </h1>
            <p className="mt-1 font-mono text-sm text-ion/90">{host}</p>
            {step && status !== "error" ? <p className="mt-1 text-sm text-muted">{step}</p> : null}
          </div>
          <div className="text-right">
            <p className="font-mono text-3xl tabular-nums tracking-tight text-ion sm:text-4xl">{pad(visual)}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">pct</p>
          </div>
        </div>

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
          <>
            <div className="nisse-stage relative mt-5 overflow-visible pb-8">
              <div className="relative h-[min(22rem,46vh)] overflow-visible border border-line bg-black/40">
                <div className="absolute inset-0 overflow-hidden">
                  {jobId ? (
                    <iframe
                      key={previewReady ? "preview-ready" : "preview-wait"}
                      title={`Förhandsvisning av ${host}`}
                      src={`/api/analys/${jobId}/preview`}
                      sandbox=""
                      referrerPolicy="no-referrer"
                      className="h-full w-full bg-[#07050a]"
                    />
                  ) : (
                    <div className="grid h-full place-items-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                      Hämtar yta åt Nisse
                    </div>
                  )}
                </div>
                <p className="pointer-events-none absolute bottom-2 left-2 z-20 font-mono text-[10px] uppercase tracking-[0.16em] text-ion">
                  {previewReady ? "Sandlåda · inget JS" : "Väntar på HTML"}
                </p>
                <SkrotNisse
                  seed={seed}
                  percent={visual}
                  stage={stage.id}
                  reduced={reduced}
                  active
                />
              </div>
            </div>

            <ol className="mt-4 flex flex-wrap gap-x-6 gap-y-2" aria-label="Skanningssteg">
              {SCAN_STAGES.map((s, i) => {
                const done = visual >= s.to;
                const current = stage.id === s.id;
                return (
                  <li
                    key={s.id}
                    className={cn(
                      "font-mono text-[11px] uppercase tracking-[0.14em]",
                      current ? "text-ion" : done ? "text-muted" : "text-muted/50",
                    )}
                  >
                    0{i + 1} {s.label}
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </div>
    </div>
  );
}
