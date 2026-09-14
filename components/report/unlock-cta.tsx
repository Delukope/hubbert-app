"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatSek, type PricePlan, type UnlockTier } from "@/lib/pricing";

export function UnlockCta({
  jobId,
  current,
  plans,
  stripe,
  demo,
  costNote,
}: {
  jobId: string;
  current: UnlockTier;
  plans: PricePlan[];
  stripe: boolean;
  demo: boolean;
  costNote: string;
}) {
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function buy(tier: "snabb" | "djup" | "tung", asDemo = false) {
    setError(null);
    setPending(tier + (asDemo ? "-demo" : ""));
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jobId, tier, demo: asDemo }),
      });
      const data = (await res.json()) as { url?: string; demo?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error || "Kunde inte starta betalning.");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.demo) {
        window.location.reload();
        return;
      }
    } catch {
      setError("Nätverksfel.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((p) => {
          const owned = current === "tung" || current === p.id || (current === "djup" && p.id !== "tung");
          return (
            <div key={p.id} className="rounded-2xl border border-line bg-white/3 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-gold">{p.name}</p>
              <p className="mt-2 font-mono text-3xl">{formatSek(p.sek)}</p>
              <ul className="mt-3 space-y-1 text-sm text-muted">
                {p.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              {owned ? (
                <p className="mt-4 text-sm text-mint">Upplåst</p>
              ) : (
                <div className="mt-4 flex flex-col gap-2">
                  {stripe ? (
                    <Button size="sm" disabled={Boolean(pending)} onClick={() => buy(p.id)}>
                      {pending === p.id ? "Öppnar Checkout…" : `Lås upp · ${formatSek(p.sek)}`}
                    </Button>
                  ) : null}
                  {demo ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={Boolean(pending)}
                      onClick={() => buy(p.id, true)}
                    >
                      {pending === `${p.id}-demo` ? "Låser upp…" : "Demo-upplåsning (ingen betalning)"}
                    </Button>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!stripe && !demo ? (
        <p className="text-sm text-muted">
          Betalning är inte igång ännu. Teasern är gratis — full rapport öppnas när kassan är kopplad.
        </p>
      ) : null}
      <p className="text-xs text-muted">{costNote}</p>
      {error ? (
        <p className="text-sm text-bad" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
