import Link from "next/link";
import type { ScanJob, ScanIssue } from "@/lib/analyzer/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScoreRingWrap } from "@/components/ui/score-ring";
import { CategoryBars, CategoryRadar, PerfBars } from "@/components/report/charts";
import { formatBytes, formatMs, scoreTone, cn } from "@/lib/utils";

const severityLabel: Record<ScanIssue["severity"], string> = {
  critical: "Kritiskt",
  high: "Högt",
  medium: "Medel",
  low: "Lågt",
  info: "Info",
};

const catLabel: Record<ScanIssue["category"], string> = {
  security: "Säkerhet",
  performance: "Prestanda",
  seo: "SEO",
  a11y: "Tillgänglighet",
  "best-practice": "Praxis",
};

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
  const host = (() => {
    try {
      return new URL(report.fetchedUrl || report.url).hostname;
    } catch {
      return report.url;
    }
  })();
  const first = report.issues.slice(0, 3);

  return (
    <div className="space-y-8">
      {report.isDemo ? (
        <p className="rounded-2xl border border-gold/30 bg-gold/8 px-4 py-3 text-sm text-gold">
          Demo-rapport: livehämtning blockerades eller misslyckades
          {report.demoReason ? ` (${report.demoReason})` : ""}. Siffrorna är kompletta och delbara, men inte
          en färsk mätning av origin-servern.
        </p>
      ) : null}

      <section className="glass overflow-hidden rounded-[2rem] p-6 sm:p-10">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Rapport</p>
            <h1 className="display mt-3 text-4xl tracking-tight sm:text-5xl">{host}</h1>
            <p className="mt-4 text-base leading-7 text-muted">{report.summary}</p>
            <p className="mt-4 font-mono text-xs text-muted">
              {new Date(report.scannedAt).toLocaleString("sv-SE")} · {report.fetchedUrl}
            </p>
          </div>
          <ScoreRingWrap score={report.overall} label="Helhet" size={180} />
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MiniRing score={report.security.score} label="Säkerhet" grade={report.security.grade} />
          <MiniRing score={report.performance.score} label="Prestanda" />
          <MiniRing score={report.seo.score} label="SEO" />
          <MiniRing score={report.a11y.score} label="Tillgänglighet" />
        </div>
      </section>

      <section>
        <h2 className="display text-2xl">Vad du bör göra först</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {first.length === 0 ? (
            <Card>
              <p className="text-sm text-muted">Inga allvarliga heuristiska fel. Finputs och mät igen efter nästa deploy.</p>
            </Card>
          ) : (
            first.map((issue, i) => (
              <Card key={issue.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gold">0{i + 1}</span>
                  <Badge>{severityLabel[issue.severity]}</Badge>
                </div>
                <h3 className="text-lg">{issue.title}</h3>
                <p className="text-sm leading-6 text-muted">{issue.recommendation}</p>
              </Card>
            ))
          )}
        </div>
      </section>

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
            <Row k="Robots" v={report.facts.robots} />
            <Row k="H1 / H2 / H3" v={`${report.facts.headings.h1} / ${report.facts.headings.h2} / ${report.facts.headings.h3}`} />
            <Row
              k="Bilder med alt"
              v={`${report.facts.images.withAlt}/${report.facts.images.total}`}
            />
            <Row k="JSON-LD" v={report.facts.jsonLdTypes.join(", ") || "—"} />
            <Row k="HTTPS" v={report.security.https ? "Ja" : "Nej"} />
          </dl>
        </Card>
      </section>

      {report.pagespeed ? (
        <Card>
          <h2 className="display text-xl">PageSpeed Insights</h2>
          <p className="mt-1 text-sm text-muted">Berikning via Google API.</p>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat k="Performance" v={fmtOpt(report.pagespeed.performance)} />
            <Stat k="SEO" v={fmtOpt(report.pagespeed.seo)} />
            <Stat k="A11y" v={fmtOpt(report.pagespeed.accessibility)} />
            <Stat k="Best practices" v={fmtOpt(report.pagespeed.bestPractices)} />
          </div>
        </Card>
      ) : null}

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

      <section>
        <h2 className="display text-2xl">Alla fynd</h2>
        <ul className="mt-4 space-y-3">
          {report.issues.map((issue) => (
            <li key={issue.id}>
              <Card className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{catLabel[issue.category]}</Badge>
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
                </div>
                <h3 className="mt-3 text-lg">{issue.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{issue.description}</p>
                <p className="mt-2 text-sm text-fg">{issue.recommendation}</p>
                {issue.evidence ? (
                  <p className="mt-2 truncate font-mono text-xs text-muted">{issue.evidence}</p>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-center text-sm text-muted">
        Dela den här URL:en. Ny scan?{" "}
        <Link href="/analys" className="text-gold hover:underline">
          Kör igen
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

function fmtOpt(n?: number) {
  return typeof n === "number" ? String(n) : "–";
}
