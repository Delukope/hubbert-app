import Link from "next/link";
import type { ScanJob, ScanIssue } from "@/lib/analyzer/types";
import { isDeep, isPaid, jobUnlock } from "@/lib/analyzer/access";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScoreRingWrap } from "@/components/ui/score-ring";
import { CategoryBars, CategoryRadar, PerfBars } from "@/components/report/charts";
import { UnlockCta } from "@/components/report/unlock-cta";
import { formatBytes, formatMs, scoreTone, cn } from "@/lib/utils";
import { costNote, demoUnlockAllowed, plans, stripeReady } from "@/lib/pricing";

const severityLabel: Record<ScanIssue["severity"], string> = {
  critical: "Kritiskt",
  high: "Högt",
  medium: "Medel",
  low: "Lågt",
  info: "Info",
};

export const catLabel: Record<ScanIssue["category"], string> = {
  security: "Säkerhet",
  performance: "Prestanda/svarstider",
  seo: "SEO/E-E-A-T",
  a11y: "Tillgänglighet",
  design: "Design/UX",
  "best-practice": "Best practices",
};

const CATEGORIES: ScanIssue["category"][] = [
  "security",
  "seo",
  "design",
  "performance",
  "a11y",
  "best-practice",
];

function toneClass(score: number) {
  const t = scoreTone(score);
  if (t === "mint") return "text-mint";
  if (t === "gold") return "text-gold";
  if (t === "warn") return "text-warn";
  return "text-bad";
}

export function ReportDashboard({ job }: { job: ScanJob }) {
  const report = job.report;
  if (!report) return null;
  const paid = isPaid(job);
  const deep = isDeep(job);
  const host = (() => {
    try {
      return new URL(report.fetchedUrl || report.url).hostname;
    } catch {
      return report.url;
    }
  })();
  const teasers = report.issues.slice(0, 3);
  const counts = Object.fromEntries(
    CATEGORIES.map((c) => [c, report.issues.filter((i) => i.category === c).length]),
  ) as Record<ScanIssue["category"], number>;

  return (
    <div className="space-y-8">
      {report.isDemo ? (
        <p className="rounded-2xl border border-gold/30 bg-gold/8 px-4 py-3 text-sm text-gold">
          Demo-rapport: livehämtning blockerades eller misslyckades
          {report.demoReason ? ` (${report.demoReason})` : ""}.
        </p>
      ) : null}

      <section className="glass overflow-hidden rounded-[2rem] p-6 sm:p-10">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">
              {paid ? (deep ? "Djupanalys" : "Snabb analys") : "Gratis teaser"}
            </p>
            <h1 className="display mt-3 text-4xl tracking-tight sm:text-5xl">{host}</h1>
            <p className="mt-4 text-base leading-7 text-muted">
              {deep ? report.deepSummary : report.summary}
            </p>
            <p className="mt-4 font-mono text-xs text-muted">
              {new Date(report.scannedAt).toLocaleString("sv-SE")} · {report.fetchedUrl}
            </p>
          </div>
          <ScoreRingWrap score={report.overall} label="Helhet" size={180} />
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <MiniRing score={report.security.score} label="Säkerhet" grade={report.security.grade} />
          <MiniRing score={report.performance.score} label="Prestanda" />
          <MiniRing score={report.seo.score} label="SEO" />
          <MiniRing score={report.design.score} label="Design" />
          <MiniRing score={report.a11y.score} label="Tillgänglighet" />
        </div>
      </section>

      <section>
        <h2 className="display text-2xl">{paid ? "Vad du bör göra först" : "Avslöjanden"}</h2>
        <p className="mt-2 text-sm text-muted">
          {paid
            ? "Prioriterat ur den fulla skannen."
            : "Tre smakprov. Resten är låst — skannen är redan körd."}
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {teasers.length === 0 ? (
            <Card>
              <p className="text-sm text-muted">Inga allvarliga heuristiska fel i teasern.</p>
            </Card>
          ) : (
            teasers.map((issue, i) => (
              <Card key={issue.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gold">0{i + 1}</span>
                  <Badge>{severityLabel[issue.severity]}</Badge>
                </div>
                <h3 className="text-lg">{issue.title}</h3>
                <p className="text-sm leading-6 text-muted">
                  {paid ? issue.recommendation : issue.description}
                </p>
              </Card>
            ))
          )}
        </div>
      </section>

      {!paid ? (
        <section className="glass rounded-[2rem] p-6 sm:p-8">
          <h2 className="display text-2xl">Lås upp hela rapporten</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Full lista per kategori, grafer, headers, prioriterad plan och PDF. Skannen är redan körd.
          </p>
          <div className="mt-6">
            <UnlockCta
              jobId={job.id}
              current={jobUnlock(job)}
              plans={plans()}
              stripe={stripeReady()}
              demo={demoUnlockAllowed()}
              costNote={costNote}
            />
          </div>
        </section>
      ) : (
        <div className="flex flex-wrap gap-3">
          <a
            href={`/api/analys/${job.id}/pdf`}
            className="rounded-full bg-gold px-5 py-3 text-sm font-medium text-[#1a1408]"
          >
            Ladda ner PDF
          </a>
          {job.unlock === "snabb" ? (
            <p className="self-center text-sm text-muted">Vill du ha narrativ och E-E-A-T? Uppgradera till djupanalys.</p>
          ) : null}
        </div>
      )}

      {!paid ? (
        <section>
          <h2 className="display text-2xl">Låsta sektioner</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {CATEGORIES.map((c) => (
              <div key={c} className="relative overflow-hidden rounded-3xl border border-line">
                <div className="blur-sm pointer-events-none select-none p-5 opacity-40" aria-hidden>
                  <p className="display text-lg">{catLabel[c]}</p>
                  <p className="mt-2 text-sm">████████ ███ ████</p>
                  <p className="mt-1 text-sm">██████ █████████</p>
                  <p className="mt-1 text-sm">████ ██ ██████</p>
                </div>
                <div className="absolute inset-0 grid place-items-center bg-bg/55">
                  <p className="rounded-full border border-gold/40 bg-bg/80 px-4 py-2 text-sm">
                    {catLabel[c]} · {counts[c]} fynd
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <>
          <section className="grid gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="display text-xl">Kategorier</h2>
              <CategoryBars report={report} />
            </Card>
            <Card>
              <h2 className="display text-xl">Profil</h2>
              <CategoryRadar report={report} />
            </Card>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="display text-xl">Prestandaheuristik</h2>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <Stat k="TTFB" v={formatMs(report.performance.ttfbMs)} />
                <Stat k="HTML-storlek" v={formatBytes(report.performance.totalBytes)} />
                <Stat k="Komprimering" v={report.performance.compressed ? report.performance.encoding || "ja" : "nej"} />
                <Stat k="Omdirigeringar" v={String(report.performance.redirectCount)} />
              </dl>
              <PerfBars report={report} />
            </Card>
            <Card>
              <h2 className="display text-xl">Fakta</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <Row k="Title" v={report.facts.title} />
                <Row k="Description" v={report.facts.description} />
                <Row k="Språk" v={report.facts.lang} />
                <Row k="Viewport" v={report.facts.viewport} />
                <Row k="Canonical" v={report.facts.canonical} />
                <Row k="Generator" v={report.facts.generator} />
                <Row k="H1 / H2 / H3" v={`${report.facts.headings.h1} / ${report.facts.headings.h2} / ${report.facts.headings.h3}`} />
                <Row k="Bilder med alt" v={`${report.facts.images.withAlt}/${report.facts.images.total}`} />
                <Row k="JSON-LD" v={report.facts.jsonLdTypes.join(", ") || "—"} />
                <Row k="HTTPS" v={report.security.https ? "Ja" : "Nej"} />
              </dl>
            </Card>
          </section>

          {deep ? (
            <Card>
              <h2 className="display text-xl">E-E-A-T</h2>
              <p className="mt-1 font-mono text-2xl">{report.eeat.score}/100</p>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {report.eeat.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">
                Ett andra pass (ny skann efter åtgärder) bokas separat — vi lovar inte mer än vi kan leverera.
              </p>
            </Card>
          ) : null}

          <Card>
            <h2 className="display text-xl">Prioriterad plan</h2>
            <ol className="mt-4 space-y-3">
              {report.roadmap.map((item) => (
                <li key={item.order} className="border-b border-line/70 pb-3">
                  <p className="font-medium">
                    {item.order}. {item.title}
                  </p>
                  <p className="text-sm text-muted">{item.action}</p>
                </li>
              ))}
            </ol>
          </Card>

          <Card className="overflow-x-auto">
            <h2 className="display text-xl">Säkerhetsheaders</h2>
            <p className="mt-1 text-sm text-muted">
              Betyg {report.security.grade}. {report.security.tlsNote}
            </p>
            <table className="mt-4 w-full min-w-[36rem] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="pb-3 pr-4">Header</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Värde / anmärkning</th>
                </tr>
              </thead>
              <tbody>
                {report.security.headers.map((h) => (
                  <tr key={h.name} className="border-t border-line">
                    <td className="py-3 pr-4 font-mono text-xs">{h.name}</td>
                    <td className={cn("py-3 pr-4", h.ok ? "text-mint" : "text-bad")}>{h.ok ? "OK" : "Saknas"}</td>
                    <td className="py-3 text-muted">
                      {h.value ? <span className="block truncate font-mono text-xs text-fg/80">{h.value}</span> : null}
                      {h.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {CATEGORIES.map((c) => {
            const items = report.issues.filter((i) => i.category === c);
            if (items.length === 0) return null;
            return (
              <section key={c}>
                <h2 className="display text-2xl">{catLabel[c]}</h2>
                <ul className="mt-4 space-y-3">
                  {items.map((issue) => (
                    <li key={issue.id}>
                      <Card className="p-5">
                        <Badge
                          className={
                            issue.severity === "critical" || issue.severity === "high"
                              ? "border-bad/40 text-bad"
                              : issue.severity === "medium"
                                ? "border-warn/40 text-warn"
                                : ""
                          }
                        >
                          {severityLabel[issue.severity]}
                        </Badge>
                        <h3 className="mt-3 text-lg">{issue.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted">{issue.description}</p>
                        <p className="mt-2 text-sm text-fg">{issue.recommendation}</p>
                      </Card>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          {job.unlock === "snabb" ? (
            <section className="glass rounded-[2rem] p-6">
              <h2 className="display text-xl">Uppgradera till djupanalys</h2>
              <div className="mt-4">
                <UnlockCta
                  jobId={job.id}
                  current={jobUnlock(job)}
                  plans={plans().filter((p) => p.id === "djup")}
                  stripe={stripeReady()}
                  demo={demoUnlockAllowed()}
                  costNote={costNote}
                />
              </div>
            </section>
          ) : null}
        </>
      )}

      <p className="text-center text-sm text-muted">
        Ny scan?{" "}
        <Link href="/analys" className="text-gold hover:underline">
          Kör igen
        </Link>
        {" · "}
        <Link href="/tjanster" className="text-gold hover:underline">
          Be om åtgärdshjälp
        </Link>
      </p>
    </div>
  );
}

function MiniRing({ score, label, grade }: { score: number; label: string; grade?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white/3 px-3 py-4 text-center">
      <p className={cn("font-mono text-3xl", toneClass(score))}>{grade ?? Math.round(score)}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted">{label}</p>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.14em] text-muted">{k}</dt>
      <dd className="mt-1 font-mono text-lg">{v}</dd>
    </div>
  );
}

function Row({ k, v }: { k: string; v?: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line/60 py-2">
      <dt className="text-muted">{k}</dt>
      <dd className="max-w-[60%] truncate text-right">{v || "—"}</dd>
    </div>
  );
}
