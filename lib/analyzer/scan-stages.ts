export const SCAN_STAGES = [
  {
    id: "dns",
    label: "DNS / TLS",
    verb: "Löser namn, öppnar krypterad tunnel",
    from: 0,
    to: 18,
  },
  {
    id: "headers",
    label: "Svarshuvuden",
    verb: "Läser status, cache och säkerhetsheaders",
    from: 18,
    to: 36,
  },
  {
    id: "html",
    label: "HTML-dokument",
    verb: "Tolkar titel, landning, bilder och schema",
    from: 36,
    to: 58,
  },
  {
    id: "score",
    label: "Poängsättning",
    verb: "Väger säkerhet, prestanda, SEO, a11y, design",
    from: 58,
    to: 82,
  },
  {
    id: "report",
    label: "Rapport",
    verb: "Komponerar sammanfattning och prioriterad lista",
    from: 82,
    to: 100,
  },
] as const;

export type ScanStageId = (typeof SCAN_STAGES)[number]["id"];

export function stageFromPercent(percent: number) {
  const p = Math.max(0, Math.min(100, percent));
  return SCAN_STAGES.find((s) => p < s.to) ?? SCAN_STAGES[SCAN_STAGES.length - 1];
}

export const SCAN_LOG_LINES = [
  "resolver · A / AAAA",
  "tcp · 443 öppnas",
  "tls 1.3 · handskakning",
  "cert · kedja avläst",
  "GET / · väntar TTFB",
  "status · headers inkorg",
  "csp / hsts / xfo",
  "html · stream startar",
  "dom · titel + canonical",
  "img · alt-täckning",
  "json-ld · typer",
  "score · säkerhet",
  "score · prestanda",
  "score · seo / e-e-a-t",
  "score · a11y + design",
  "narrativ · svenska",
  "rapport · komposition",
] as const;
