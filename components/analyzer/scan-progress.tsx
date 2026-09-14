"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ScanJob } from "@/lib/analyzer/types";

const STEPS = [
  "Köad",
  "Hämtar sidan",
  "Tolkar HTML och metadata",
  "Säkerhetsheaders",
  "Prestanda, SEO och tillgänglighet",
  "Sammanfattning",
];

export function ScanProgress({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [job, setJob] = useState<ScanJob | null>(null);
  const started = useRef(false);

  useEffect(() => {
    let stop = false;
    async function tick() {
      const res = await fetch(`/api/analys/${jobId}`, { cache: "no-store" });
      if (!res.ok) {
        if (res.status === 404) return;
        return;
      }
      const data = (await res.json()) as ScanJob;
      if (stop) return;
      setJob(data);
      if (data.status === "complete" || data.status === "error") {
        router.refresh();
      }
    }
    void tick();
    const id = setInterval(() => void tick(), 700);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [jobId, router]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void fetch(`/api/analys/${jobId}`, { method: "POST" });
  }, [jobId]);

  const percent = job?.progress.percent ?? 8;
  const step = job?.progress.step ?? "Startar analys…";

  if (job?.status === "error") {
    return (
      <div className="glass mx-auto max-w-lg rounded-3xl p-8 text-center">
        <p className="display text-2xl">Kunde inte analysera</p>
        <p className="mt-3 text-sm text-muted">{job.error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-xs uppercase tracking-[0.2em] text-gold">Analys pågår</p>
      <h1 className="display mt-3 text-3xl sm:text-4xl">Vi läser sajten rakt av.</h1>
      <p className="mt-3 font-mono text-sm text-muted">{job?.url}</p>
      <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full bg-linear-to-r from-gold to-mint transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-fg">{step}</p>
      <ol className="mt-8 space-y-2">
        {STEPS.map((s) => {
          const done = (job?.progress.percent ?? 0) > 20 && STEPS.indexOf(s) < STEPS.indexOf(step);
          const current = s === step;
          return (
            <li
              key={s}
              className={
                current ? "text-gold" : done ? "text-muted line-through decoration-white/20" : "text-muted/60"
              }
            >
              {s}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
