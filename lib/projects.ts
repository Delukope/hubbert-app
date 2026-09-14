export type ProjectKind = "site" | "app" | "archive";
export type ProjectStatus = "live" | "wip" | "archive";

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
    slug: "hubbert",
    name: "Hubbert",
    domain: "hubberty.se",
    url: "https://hubberty.se",
    year: "2026",
    role: "Produkt, design, analysmotor",
    tags: ["Produkt", "Analys", "Portfolio"],
    featured: true,
    kind: "site",
    status: "live",
    summary:
      "Det här navet. Portfolio och sajtanalys i samma produkt — Hubbert på hubberty.se. Byggt för att iterera snabbt, utan WordPress och utan temajakt.",
    problem:
      "Övriga sajter körs på WordPress + One.com + Divi. Det funkar, men det begränsar. Hubbert skulle vara motsatsen: modern, snabb att ändra, imponerande live.",
    approach:
      "Next.js App Router, typad projektdata, server-side analys med SSRF-skydd, betyg och prioriterade åtgärder. Svenskt gränssnitt, mörk produkt-UI.",
    outcome:
      "En sajt som både visar arbetet och granskar andras. Dela en rapport-URL. Iterera i kod, inte i temabutiken.",
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
    summary:
      "Kunskaps- och hjälpsajt på akalasi.se. Probono: först täcka kostnaderna, därefter överskott till människor som behöver det.",
    problem:
      "Hjälp och kunskap på nätet drunknar i reklamytor och temamallar. Akalasi ska kännas som en resurs, inte som en butik.",
    approach:
      "Tydlig struktur för artiklar och hjälpvägar, mätbar SEO-hygien och en sajt som Konny styr och förbättrar löpande — utan plugin-berg.",
    outcome:
      "Ett levande uppdrag. Målet är att sajten bär sig, och att det som blir över går till människor i nöd.",
    accent: "#e8c07a",
    accentTo: "#ff8a5b",
    pattern: "orbit",
  },
  {
    slug: "fallatrad",
    name: "Värmlands Trädfällning",
    domain: "fallatrad.se",
    url: "https://fallatrad.se",
    year: "2023–",
    role: "Webb, probono polish",
    tags: ["Företag", "Lokal", "Modernisering"],
    featured: true,
    kind: "site",
    status: "wip",
    summary:
      "Värmlands Trädfällning AB på fallatrad.se. En enkel sajt som ska byggas om med modern stack — probono polish, inte temajakt.",
    problem:
      "Företagssajten gör jobbet men känns som en mall. Tjänster, förtroende och kontakt ska bära — inte sidofältet.",
    approach:
      "Behåll det som är sant (trädfällning i Värmland, tydlig väg till offert), skär bort det tunga och flytta till en stack som går att iterera på.",
    outcome:
      "Pågående. Hubberts linje: enkel yta, stark kontrast, en sajt som tål att visas för kunden på telefonen.",
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
    tags: ["Företag", "Entreprenad", "Modernisering"],
    featured: true,
    kind: "site",
    status: "wip",
    summary:
      "Filipsson Entreprenad på filipssonentreprenad.se. Samma uppdrag som fallatrad: en enkel sajt som ska moderniseras, inte sminkas med ett nytt tema.",
    problem:
      "Entreprenadsajter blir snabbt kataloger. Besökaren behöver förstå vad som görs, var, och hur man tar nästa steg.",
    approach:
      "Rensa strukturen kring tjänster och kontakt. Modern stack, bättre prestanda och en yta som Konny kan förbättra utan One.com-begränsningar.",
    outcome:
      "Pågående modernisering. Samma ribba som övriga aktiva sajter i portföljen.",
    accent: "#f0a35e",
    accentTo: "#e8c07a",
    pattern: "hex",
  },
  {
    slug: "hubberty-app",
    name: "Hubberty",
    year: "2026",
    role: "Produktvision, familjeapp",
    tags: ["App", "Familj", "Vision"],
    featured: false,
    kind: "app",
    status: "wip",
    summary:
      "Familjenav under arbetsnamnet HUBBERTY (byts). Unika QR-id:n som knyter ihop Edlevo, Haldor, SportAdmin, Svenskalag med mera — plus kalender, sysslor, veckoplan, semester och jobb.",
    problem:
      "Familjens vecka är utspridd i skolplattformar, lagappar och kalendrar som inte pratar med varandra. Någon håller allt i huvudet.",
    approach:
      "Ett nav per familj. QR som identitet, inte ännu ett lösenord. Kalender och planering i mitten, kopplingar ut mot de system som redan används.",
    outcome:
      "Under utveckling / vision. Arbetsnamnet HUBBERTY kommer att bytas. Inte en livesajt ännu.",
    accent: "#9b8cff",
    accentTo: "#6ea8ff",
    pattern: "grid",
  },
  {
    slug: "stampe",
    name: "STAMPE",
    year: "2026",
    role: "Produktvision",
    tags: ["App", "Vision"],
    featured: false,
    kind: "app",
    status: "wip",
    summary:
      "STAMPE är ett arbetsnamn för en kommande app. Mer form och riktning kommer — just nu en plats i portföljen så visionen syns.",
    problem:
      "Idén ska inte försvinna i en slask. Den ska ha en yta i Hubbert medan den tar form.",
    approach:
      "Kort placeholder tills produktbeskrivningen är klar. Samma krav som övriga appar: tydligt namn, ärlig status, ingen fejkad live-demo.",
    outcome:
      "Under utveckling. Arbetsnamn, ingen publik sajt ännu.",
    accent: "#5ee0ff",
    accentTo: "#7ee0c6",
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
    summary:
      "west2000.se — en sajt Konny administrerat tidigare. Inget mer arbete planeras.",
    problem:
      "Uppdraget är avslutat. Portföljen ska vara ärlig om vad som är aktivt och vad som ligger kvar som historik.",
    approach:
      "Ingen vidareutveckling. Länken finns för spårbarhet, inte som säljcase.",
    outcome:
      "Arkiverad. Inte en del av den aktiva linjen.",
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
    summary:
      "trallen.se — tidigare administrerad. Inget mer arbete planeras.",
    problem:
      "Samma som west2000: historik, inte backlog.",
    approach:
      "Lämnad som den är. Hubbert visar den i en mindre sektion så inventeringen stämmer.",
    outcome:
      "Arkiverad.",
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
    summary:
      "jodeko.se — en webshop som knappt hann lanseras. Finns kvar som historik, inte som aktiv satsning.",
    problem:
      "En butik som aldrig fick riktig fart ska inte säljas som case.",
    approach:
      "Kort notis i portföljen. Ingen vidare polish planerad här.",
    outcome:
      "Arkiverad. Lärdomen sitter i Hubbert, inte i fler temabyten på shoppen.",
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

export function showcaseProjects() {
  return projects.filter((p) => p.kind === "site");
}

export function appProjects() {
  return projects.filter((p) => p.kind === "app");
}

export function archiveProjects() {
  return projects.filter((p) => p.kind === "archive");
}

export function statusLabel(status: ProjectStatus) {
  if (status === "wip") return "Under utveckling";
  if (status === "archive") return "Tidigare";
  return "Live";
}
