"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ScanJob } from "@/lib/analyzer/types";
import { ScanTheater } from "@/components/analyzer/scan-theater";
import { ReportDashboard, type ReportBilling } from "@/components/report/report-dashboard";

type JobPayload = ScanJob & { billing?: ReportBilling; error?: string };

export function ScanProgress({ jobId, url }: { jobId: string; url?: string }) {
  const router = useRouter();
  const [job, setJob] = useState<JobPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [misses, setMisses] = useState(0);
  const kicked = useRef(false);

  useEffect(() => {
    let stop = false;
    let fails = 0;

    async function tick() {
      try {
        const res = await fetch(`/api/analys/${jobId}`, {
          cache: "no-store",
          headers: { accept: "application/json" },
        });
        const text = await res.text();
        let data: JobPayload | null = null;
        try {
          data = JSON.parse(text) as JobPayload;
        } catch {
          fails += 1;
          if (fails >= 8) setError("Analysmotorn svarade inte med data. Försök igen.");
          return;
        }
        if (stop) return;
        if (res.status === 404) {
          setMisses((m) => m + 1);
          return;
        }
        if (!res.ok) {
          fails += 1;
          if (fails >= 6) setError(data.error || "Kunde inte läsa analysjobbet.");
          return;
        }
        fails = 0;
        setMisses(0);
        setError(null);
        setJob(data);
      } catch {
        fails += 1;
        if (fails >= 8) setError("Tillfällig nätverksstörning mot rapporten. Försök igen.");
      }
    }

    void tick();
    const id = window.setInterval(() => void tick(), 650);
    return () => {
      stop = true;
      window.clearInterval(id);
    };
  }, [jobId]);

  useEffect(() => {
    if (kicked.current) return;
    kicked.current = true;
    void fetch(`/api/analys/${jobId}`, { method: "POST", headers: { accept: "application/json" } }).catch(
      () => undefined,
    );
  }, [jobId]);

  const stalled = misses >= 10;
  const showError = job?.status === "error" || Boolean(error) || stalled;

  async function retry() {
    if (stalled) {
      const target = job?.url ?? url;
      router.push(target ? `/analys?url=${encodeURIComponent(target)}` : "/analys");
      return;
    }
    setError(null);
    setMisses(0);
    try {
      await fetch(`/api/analys/${jobId}`, { method: "POST", headers: { accept: "application/json" } });
    } catch {
      setError("Fortfarande ingen kontakt. Kontrollera nätet och försök igen.");
    }
  }

  if (job?.status === "complete" && job.report) {
    return <ReportDashboard job={job} billing={job.billing} />;
  }

  return (
    <ScanTheater
      url={job?.url ?? url}
      percent={job?.progress.percent ?? 8}
      step={job?.progress.step}
      status={showError ? "error" : (job?.status ?? "running")}
      error={
        job?.status === "error"
          ? job.error
          : stalled
            ? "Jobbet hittades inte på den här instansen. Starta om skanningen."
            : error
      }
      onRetry={showError ? retry : undefined}
    />
  );
}
