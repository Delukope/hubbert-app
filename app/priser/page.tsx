import type { Metadata } from "next";
import Link from "next/link";
import { costNote, formatSek, packageDetail, plans, tungPlan } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Priser",
  description: "Gratis analys, snabb rapport och djupare genomgång.",
};

export default function PricesPage() {
  const [snabb, djup] = plans();
  const tung = tungPlan();
  const free = packageDetail("free");
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="display text-4xl">Vad det kostar</h1>
      <p className="mt-4 text-muted">{costNote}</p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="glass p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ion">{free.name}</p>
          <p className="mt-2 font-mono text-3xl">0 kr</p>
          <p className="mt-3 text-sm text-muted">{free.gets}</p>
          <p className="mt-2 text-sm text-muted">Ingår inte: {free.notIncluded.join(", ").toLowerCase()}.</p>
        </div>
        <div className="glass p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ion">{snabb.name}</p>
          <p className="mt-2 font-mono text-3xl">{formatSek(snabb.sek)}</p>
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {snabb.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">{packageDetail("snabb").payWhen}</p>
        </div>
        <div className="glass p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ion">{djup.name}</p>
          <p className="mt-2 font-mono text-3xl">{formatSek(djup.sek)}</p>
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {djup.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">{packageDetail("djup").payWhen}</p>
        </div>
        <div className="glass p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ion">{tung.name}</p>
          <p className="mt-2 font-mono text-3xl">{formatSek(tung.sek)}</p>
          <p className="mt-3 text-sm text-muted">
            För större eller tyngre sajter (betalas innan analysen körs). Samma djupare genomgång som Djup — ingen
            extra produkt utöver det.
          </p>
        </div>
      </div>
      <p className="mt-8 text-sm text-muted">
        Snabb kostar {formatSek(snabb.sek)}. Djupare genomgång betalas innan den körs. Se{" "}
        <Link href="/tjanster" className="text-ion hover:underline">
          tjänster
        </Link>
        .
      </p>
      <Link href="/analys" className="mt-8 inline-flex bg-ion px-5 py-3 text-sm font-medium text-ink">
        Börja med en gratis analys
      </Link>
    </article>
  );
}
