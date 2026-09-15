"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PackageChooser } from "@/components/package-chooser";
import { formatSek, type PackageId, type PricePlan, type UnlockTier } from "@/lib/pricing";

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
  const ids = plans.map((p) => p.id) as PackageId[];
  const [selected, setSelected] = useState<PackageId>(ids[0] ?? "snabb");
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const plan = plans.find((p) => p.id === selected) ?? plans[0];
  const owned =
    plan &&
    (current === "tung" || current === plan.id || (current === "djup" && plan.id !== "tung"));

  async function pay(asDemo = false) {
    if (!plan) return;
    setError(null);
    setPending(plan.id + (asDemo ? "-demo" : ""));
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jobId, tier: plan.id, demo: asDemo }),
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
      }
    } catch {
      setError("Nätverksfel.");
    } finally {
      setPending(null);
    }
  }

  if (!plan) return null;

  return (
    <div className="space-y-4">
      <PackageChooser value={selected} onChange={setSelected} options={ids} />
      {owned ? (
        <p className="text-sm text-mint">Det här paketet är redan upplåst.</p>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          {stripe ? (
            <Button size="sm" disabled={Boolean(pending)} onClick={() => pay()}>
              {pending === plan.id ? "Öppnar betalning…" : `Betala ${formatSek(plan.sek)} och lås upp`}
            </Button>
          ) : null}
          {demo ? (
            <Button size="sm" variant="ghost" disabled={Boolean(pending)} onClick={() => pay(true)}>
              {pending === `${plan.id}-demo` ? "Låser upp…" : "Demo-upplåsning (ingen betalning)"}
            </Button>
          ) : null}
        </div>
      )}
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
