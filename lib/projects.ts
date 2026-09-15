export type ProjectKind = "site" | "app" | "archive";
export type ProjectStatus = "live" | "wip" | "archive";

export type CaseStudySlot = {
  label: string;
  beforeSrc?: string;
  afterSrc?: string;
};

export type Project = {
  slug: string;
  name: string;
  domain?: string;
  url?: string;
  year: string;
  role: string;
  tags: string[];
  featured: boolean;
  kind: ProjectKind;
  status: ProjectStatus;
  callout?: string;
  caseStudy?: CaseStudySlot;
  /** Primary cover path under `public/`. */
  image?: string;
  coverSrc?: string;
  coverSrcCompact?: string;
  coverFit?: "cover" | "contain";
  heroSrc?: string;
  summary: string;
  problem: string;
  approach: string;
  outcome: string;
  accent: string;
  accentTo: string;
  pattern: "orbit" | "grid" | "wave" | "bars" | "hex" | "pulse" | "hub";
};

export const projects: Project[] = [
  {
    slug: "hubberty",
    name: "Hubberty",
    domain: "hubberty.se",
    url: "https://hubberty.se",
    year: "2026",
    role: "Produkt, design, analysmotor",
    tags: ["Produkt", "Analys", "Portfolio"],
    featured: false,
    kind: "site",
    status: "live",
    callout: "Den här sajten",
    image: "/projects/hubberty-card.png",
    coverSrc: "/projects/hubberty-card.png",
    coverSrcCompact: "/brands/hubberty/icon-black.png",
    coverFit: "contain",
    summary:
      "Den här sajten: portfolio och sajtanalys på hubberty.se. Byggd i Next.js så den går att ändra snabbt, utan WordPress.",
    problem:
      "WordPress och Divi funkar ett tag, sen blir det trögt. Jag ville ha en sajt jag kan ändra i kod och visa live.",
    approach:
      "Next.js, typad projektdata och sajtanalys på servern. Svenska betyg och åtgärder. Mörkt gränssnitt.",
    outcome:
      "En sajt som både visar arbetet och granskar andras. Dela en rapport-URL. Ändra i kod, inte i temabutiken.",
    accent: "#e8c07a",
    accentTo: "#7ee0c6",
    pattern: "hub",
  },
  {
    slug: "akalasi",
    name: "Akalasi",
    domain: "akalasi.se",
    url: "https://akalasi.se",
    year: "2024–",
    role: "Probono, innehåll, drift",
    tags: ["Probono", "Kunskap", "Hjälp"],
    featured: true,
    kind: "site",
    status: "live",
    image: "/projects/akalasi-showcase.png",
    coverSrc: "/projects/akalasi-showcase.png",
    heroSrc: "/brands/akalasi/logo-stacked.png",
    summary:
      "Kunskaps- och hjälpsajt på akalasi.se. Probono: först täcka kostnaderna, därefter överskott till människor som behöver det.",
    problem:
      "Hjälp och kunskap på nätet drunknar i reklamytor och temamallar. Akalasi ska kännas som en resurs, inte som en butik.",
    approach:
      "Tydlig struktur för artiklar och hjälpvägar, mätbar SEO-hygien och en sajt som Konny styr och förbättrar löpande.",
    outcome:
      "Ett levande uppdrag. Målet är att sajten bär sig, och att det som blir över går till människor i nöd.",
    accent: "#2ec4b6",
    accentTo: "#7ff5ea",
    pattern: "orbit",
  },
  {
    slug: "fallatrad",
    name: "Värmlands Trädfällning",
    domain: "fallatrad.se",
    url: "https://fallatrad.se",
    year: "2023–",
    role: "Webb, probono polish",
    tags: ["Före & efter", "Lokal", "Modernisering"],
    featured: false,
    kind: "site",
    status: "wip",
    callout: "Före & efter på gång",
    caseStudy: {
      label: "Före & efter på gång",
      beforeSrc: "/cases/fallatrad/before.webp",
      afterSrc: "/cases/fallatrad/after.webp",
    },
    summary:
      "Värmlands Trädfällning AB på fallatrad.se. Enkel sajt som ska byggas om — probono. Före och efter är på gång.",
    problem:
      "Företagssajten gör jobbet men känns som en mall. Tjänster, förtroende och kontakt ska bära — inte sidofältet.",
    approach:
      "Behåll det som är sant: trädfällning i Värmland, tydlig väg till offert. Skär bort det tunga och gör sajten lätt att hålla uppdaterad.",
    outcome: "Omskrivningen är på gång. Före och efter läggs upp när den nya sajten är redo.",
    accent: "#7ee0c6",
    accentTo: "#3dd68c",
    pattern: "wave",
  },
  {
    slug: "filipsson-entreprenad",
    name: "Filipsson Entreprenad",
    domain: "filipssonentreprenad.se",
    url: "https://filipssonentreprenad.se",
    year: "2023–",
    role: "Webb, modernisering",
    tags: ["Före & efter", "Entreprenad", "Modernisering"],
    featured: false,
    kind: "site",
    status: "wip",
    callout: "Före & efter på gång",
    caseStudy: {
      label: "Före & efter på gång",
      beforeSrc: "/cases/filipsson-entreprenad/before.webp",
      afterSrc: "/cases/filipsson-entreprenad/after.webp",
    },
    summary:
      "Filipsson Entreprenad på filipssonentreprenad.se. Enkel sajt som ska moderniseras. Före och efter är på gång.",
    problem:
      "Entreprenadsajter blir snabbt kataloger. Besökaren behöver förstå vad som görs, var, och hur man tar nästa steg.",
    approach:
      "Rensa strukturen kring tjänster och kontakt. Snabbare sajt, tydligare nästa steg, lättare att hålla uppdaterad.",
    outcome: "Omskrivningen är på gång. Före och efter läggs upp när den nya sajten är redo.",
    accent: "#f0a35e",
    accentTo: "#e8c07a",
    pattern: "hex",
  },
  {
    slug: "hubberty-app",
    name: "Hubberty",
    year: "2026",
    role: "Produkt, familjeapp",
    tags: ["App", "Familj"],
    featured: false,
    kind: "app",
    status: "wip",
    callout: "Under utveckling",
    summary:
      "Familjenav under utveckling. Unika QR-id:n som knyter ihop Edlevo, Haldor, SportAdmin, Svenskalag med mera — plus kalender, sysslor, veckoplan, semester och jobb.",
    problem:
      "Familjens vecka är utspridd i skolplattformar, lagappar och kalendrar som inte pratar med varandra. Någon håller allt i huvudet.",
    approach:
      "Ett nav per familj. QR som identitet, inte ännu ett lösenord. Kalender och planering i mitten, kopplingar ut mot de system som redan används.",
    outcome: "Byggs nu. Inte lanserad än.",
    accent: "#9b8cff",
    accentTo: "#6ea8ff",
    pattern: "grid",
  },
  {
    slug: "hubrix",
    name: "Hubrix",
    domain: "hubrix.se",
    year: "2026",
    role: "Produkt, tid & projekt",
    tags: ["App", "Stämpelklocka"],
    featured: false,
    kind: "app",
    status: "wip",
    callout: "Kommande stämpelklocka",
    coverSrc: "/hubrix/logo-vit.png",
    coverFit: "contain",
    summary:
      "Stämpelklocka för tid och projekt, på hubrix.se. Inte lanserad än — mer att visa när den har ett tydligt läge.",
    problem:
      "Tid och projekt hamnar i klocka, kalkylark och chatt. Det ska gå att stämpla och följa arbete på ett ställe.",
    approach: "En egen produkt för stämpling, tid och projekt. Byggs separat från den här sajten.",
    outcome: "På gång. Ingen publik sajt än.",
    accent: "#e45416",
    accentTo: "#c43c0c",
    pattern: "pulse",
  },
  {
    slug: "west2000",
    name: "West 2000",
    domain: "west2000.se",
    url: "https://west2000.se",
    year: "tidigare",
    role: "Tidigare administration",
    tags: ["Arkiv"],
    featured: false,
    kind: "archive",
    status: "archive",
    summary: "west2000.se — en sajt Konny administrerat tidigare. Inget mer arbete planeras.",
    problem: "Uppdraget är avslutat.",
    approach: "Ingen vidareutveckling. Länken finns för spårbarhet.",
    outcome: "Arkiverad.",
    accent: "#9b9588",
    accentTo: "#6a655c",
    pattern: "bars",
  },
  {
    slug: "trallen",
    name: "Trallen",
    domain: "trallen.se",
    url: "https://trallen.se",
    year: "tidigare",
    role: "Tidigare administration",
    tags: ["Arkiv"],
    featured: false,
    kind: "archive",
    status: "archive",
    summary: "trallen.se — tidigare administrerad. Inget mer arbete planeras.",
    problem: "Uppdraget är avslutat.",
    approach: "Lämnad som den är.",
    outcome: "Arkiverad.",
    accent: "#9b9588",
    accentTo: "#5ee0ff",
    pattern: "hex",
  },
  {
    slug: "jodeko",
    name: "Jodeko",
    domain: "jodeko.se",
    url: "https://jodeko.se",
    year: "tidigare",
    role: "Webshop, begränsad lansering",
    tags: ["Arkiv", "Webshop"],
    featured: false,
    kind: "archive",
    status: "archive",
    summary: "jodeko.se — en webshop som knappt hann lanseras. Finns kvar som historik, inte som aktiv satsning.",
    problem: "Webshoppen hann knappt ut.",
    approach: "Kort notis. Ingen polish planerad.",
    outcome: "Arkiverad.",
    accent: "#ff6b9d",
    accentTo: "#9b9588",
    pattern: "pulse",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function featuredProjects() {
  return projects.filter((p) => p.featured);
}

export function liveSiteProjects() {
  return projects.filter((p) => p.kind === "site" && !p.caseStudy);
}

/** Homepage LIVE grid — never the Hubberty self-site. */
export function homeLiveProjects() {
  return liveSiteProjects().filter((p) => p.featured && p.slug !== "hubberty");
}

export function caseStudyProjects() {
  return projects.filter((p) => Boolean(p.caseStudy));
}

export function showcaseProjects() {
  return projects.filter((p) => p.kind === "site");
}

export function appProjects() {
  return projects.filter((p) => p.kind === "app");
}

export function archiveProjects() {
  return projects.filter((p) => p.kind === "archive");
}

export function statusLabel(status: ProjectStatus, project?: Project) {
  if (project?.caseStudy) return project.caseStudy.label;
  if (status === "wip") return "Under utveckling";
  if (status === "archive") return "Tidigare";
  return "Live";
}
