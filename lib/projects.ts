export type ProjectStatus = "live" | "wip";

export type Project = {
  slug: string;
  name: string;
  domain: string;
  url: string;
  year: string;
  role: string;
  tags: string[];
  featured: boolean;
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
    slug: "akalacity",
    name: "Akalacity",
    domain: "akalacity.se",
    url: "https://akalacity.se",
    year: "2024–",
    role: "Webb, innehållsarkitektur, tillväxt",
    tags: ["Innehåll", "SEO", "Trafik"],
    featured: true,
    status: "live",
    summary:
      "Hem för Sverigesfördomar och Ekonomiserdomar — två spår som växer i sök och delningar. En sajt byggd för att bära opinionsmaterial utan att kännas som en bloggmall.",
    problem:
      "Opinionsinnehåll drunknar lätt i generiska teman. Rubriker, struktur och internlänkar måste bära både räckvidd och trovärdighet — utan att sajten ser ut som alla andra.",
    approach:
      "Tydlig informationsarkitektur för två redaktionella linjer, snabbare mallar, mätbar SEO-hygien och en visuell identitet som tål att delas. Fokus på titel, ingress och relaterade spår istället för prydnadswidgets.",
    outcome:
      "Trafiken växer. Sajten är byggd för att skalas med fler texter utan att navigeras sönder — och för att kunna granskas med samma analysmotor som Hubbert själv använder.",
    accent: "#e8c07a",
    accentTo: "#ff8a5b",
    pattern: "orbit",
  },
  {
    slug: "falontradgard",
    name: "Falon Trädgård",
    domain: "falontradgard.se",
    url: "https://falontradgard.se",
    year: "2023–",
    role: "Webb, varumärke, flerspråk",
    tags: ["Företag", "Lokal SEO", "EN/SV"],
    featured: true,
    status: "wip",
    summary:
      "Trädgård och utemiljö med lokal förankring. Sajten fungerar, men ska poleras: starkare visuell linje och mer engelska för besökare som inte tar svenskan för given.",
    problem:
      "Många lokala hantverks- och trädgårdssajter ser ut som kataloger från 2014. De saknar tydligt erbjudande, bevis och en väg in för engelsktalande kunder.",
    approach:
      "Rensa strukturen kring tjänster och kontakt, höj kontrast och fotoanvändning, och lägg en ärlig engelsk yta ovanpå den svenska — inte en maskinöversatt kopia.",
    outcome:
      "Pågående polish. Målet är en sajt som känns lika omsorgsfull som en välskött rabatt, och som Hubbert-analysen kan peka ut nästa steg på.",
    accent: "#7ee0c6",
    accentTo: "#3dd68c",
    pattern: "wave",
  },
  {
    slug: "philipsen-grammat",
    name: "Philipsen Grammat",
    domain: "philipsen.grammat.se",
    url: "https://philipsen.grammat.se",
    year: "2025",
    role: "Webb, typografi, mikroprodukt",
    tags: ["Typografi", "Nisch"],
    featured: false,
    status: "live",
    summary:
      "Ett nischat grammat-spår under grammat.se. Litet till ytan, högt i precision — en sajt som ska kännas skriven, inte genererad.",
    problem:
      "Språkverktyg och nischsajter blir snabbt antingen akademiska eller barnsliga. Den här skulle kännas vuxen, snabb och tydlig.",
    approach:
      "Minimal yta, stark typografi, noll theme-jakt. Innehåll och struktur först, därefter mätning av läsbarhet, metadata och tillgänglighet.",
    outcome:
      "En liten sajt med tydlig röst. Bra testfall för Hubberts analyser: lite HTML, höga krav på detaljer.",
    accent: "#9b8cff",
    accentTo: "#6ea8ff",
    pattern: "grid",
  },
  {
    slug: "best2000",
    name: "Best 2000",
    domain: "best2000.se",
    url: "https://best2000.se",
    year: "2022–",
    role: "Webb, arkivkänsla, prestanda",
    tags: ["Varumärke", "Nostalgi"],
    featured: true,
    status: "live",
    summary:
      "Ett varumärke med millennieskiftets energi — men en sajt som ska ladda som 2026, inte som ett Flash-minne.",
    problem:
      "Nostalgi får gärna bli tung: stora bilder, otydlig CTA, svag mobil. Best 2000 behöver känslan utan släpankaret.",
    approach:
      "Behåll karaktären, skär bort det som inte bär. Kompression, cache, tydliga landningssidor och en struktur som Google faktiskt kan läsa.",
    outcome:
      "En sajt som får leka med 2000-talet i ytan, men som mäts med moderna betyg i Hubbert-rapporten.",
    accent: "#ff6b9d",
    accentTo: "#ffc14d",
    pattern: "bars",
  },
  {
    slug: "prallen",
    name: "Prallen",
    domain: "prallen.se",
    url: "https://prallen.se",
    year: "2021–",
    role: "Drift, hosting, infrastruktur",
    tags: ["Ops", "Hosting", "Tillgänglighet"],
    featured: false,
    status: "live",
    summary:
      "Ops- och hostingrelaterat — den osynliga delen av webben. Prallen handlar om att sajter är uppe, snabba och inte läcker mer än de måste.",
    problem:
      "Hosting och drift syns bara när det går fel. Kunder behöver en yta som förklarar vad som faktiskt körs, utan att bli en servermanual.",
    approach:
      "Tydlig statuskänsla, ärliga headers, HTTPS som default och en sajt som själv är ett bevis: cache, kompression, HSTS.",
    outcome:
      "Ett nav för driftnära arbete. Precis den typ av sajt Hubberts säkerhetsbetyg är byggd för att granska.",
    accent: "#5ee0ff",
    accentTo: "#7ee0c6",
    pattern: "hex",
  },
  {
    slug: "presset",
    name: "Presset",
    domain: "presset.se",
    url: "https://presset.se",
    year: "2023–",
    role: "Webb, publicering, tempo",
    tags: ["Publicering", "Redaktion"],
    featured: false,
    status: "live",
    summary:
      "En publiceringsyta med kort väg från utkast till live. Presset ska kännas som en redaktion — inte som ett CMS-tema.",
    problem:
      "Press- och publiceringssajter drunknar i plugins. Rubrik, datum och delning ska bära, inte sidofältet.",
    approach:
      "Snabb artikelmall, rena Open Graph-taggar, kanoniska URL:er och en startsida som visar det senaste utan att skrika.",
    outcome:
      "En stram publiceringsyta. Bra exempel på hur SEO-hygien och delningsytor hänger ihop.",
    accent: "#f4c16e",
    accentTo: "#ff7a59",
    pattern: "pulse",
  },
  {
    slug: "huberty",
    name: "Hubbert",
    domain: "huberty.se",
    url: "https://huberty.se",
    year: "2026",
    role: "Produkt, design, analysmotor",
    tags: ["Produkt", "Analys", "Portfolio"],
    featured: true,
    status: "live",
    summary:
      "Det här navet. Portfolio och sajtanalys i samma produkt — byggt för att iterera snabbt, utan WordPress och utan temajakt.",
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
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function featuredProjects() {
  return projects.filter((p) => p.featured);
}
