import type { ScanStageId } from "./scan-stages";

export type NisseFind = {
  id: string;
  label: string;
  stage: ScanStageId;
  decoy: boolean;
};

const REAL: Record<ScanStageId, string[]> = {
  dns: ["A/AAAA", "TLS 1.3", "cert-kedja", "port 443", "SNI"],
  headers: ["HSTS", "CSP", "X-Frame-Options", "Set-Cookie", "Cache-Control", "Server"],
  html: ["<script>", "img utan alt", "canonical", "JSON-LD", "generator", "og:image"],
  score: ["säkerhetsbetyg", "kontrast", "H1-svärm", "TTFB", "a11y-hål"],
  report: ["sammanfattning", "åtgärd #1", "PDF-lås", "roadmap-skiss"],
};

const DECOY: Record<ScanStageId, string[]> = {
  dns: ["gammal modemsladd", "en fax i DNS", "nisse.local"],
  headers: ["hemlig lunta -98", "X-Nisse-Was-Here", "password=1234 på en lapp"],
  html: ["<marquee> tre stycken", "Divi-spöke", "gästbok från 2004", "en diskmaskin i footer"],
  score: ["tre lösa skruvar", "ikea-CSS", "hamsterhjul-spinner", "Flash Player 9"],
  report: ["en korv med mos", "ost i JSON-LD", "mailto:skrot@nisse"],
};

export const NISSE_MUTTERS = [
  "Någon har gömt cookies i soffan.",
  "Det här skriptet luktar loppmarknad.",
  "HSTS? Nä, bara en lös skruv.",
  "Vem slängde en iframe i vedlådan?",
  "Certifikatet är nyare än kaffekokaren.",
  "En tracker. Den får stå i högen.",
  "Alt-text saknas. Typiskt.",
  "JSON-LD… eller ost?",
  "Jag tar den. Du behöver den inte.",
  "Huller om buller, precis som det ska va.",
  "WordPress-längtan i källkoden.",
  "En canonical som pekar åt skogen.",
  "Lugnt. Jag bara rotar.",
  "Det här var inte meningen att ligga här.",
  "Skruva loss, släng på högen.",
  "Snygg yta. Under? Skrot.",
  "Den här funktionen har bott i en backe.",
  "Två headers och en mutter. Klassiskt.",
  "Jag ser en Divi. Den åker ut.",
];

function hash32(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(list: T[], n: number, rand: () => number): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy.slice(0, Math.min(n, copy.length));
}

export function nisseCatalog(seedKey: string): { finds: NisseFind[]; mutters: string[] } {
  const rand = rng(hash32(seedKey || "hubbert"));
  const finds: NisseFind[] = [];
  (["dns", "headers", "html", "score", "report"] as ScanStageId[]).forEach((stage) => {
    const reals = pick(REAL[stage], 2 + (rand() > 0.5 ? 1 : 0), rand);
    const decoys = pick(DECOY[stage], rand() > 0.35 ? 1 : 0, rand);
    reals.forEach((label, i) => finds.push({ id: `${stage}-r-${i}`, label, stage, decoy: false }));
    decoys.forEach((label, i) => finds.push({ id: `${stage}-d-${i}`, label, stage, decoy: true }));
  });
  const shuffled = pick(finds, finds.length, rand);
  const mutters = pick(NISSE_MUTTERS, NISSE_MUTTERS.length, rand);
  return { finds: shuffled, mutters };
}

export function findsForProgress(finds: NisseFind[], percent: number, stage: ScanStageId) {
  const order: ScanStageId[] = ["dns", "headers", "html", "score", "report"];
  const maxIdx = order.indexOf(stage);
  const eligible = finds.filter((f) => order.indexOf(f.stage) <= maxIdx);
  const cap = Math.max(0, Math.floor(percent / 8));
  return eligible.slice(0, cap);
}
