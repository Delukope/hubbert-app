export const copy = {
  brand: {
    name: "Hubbert",
    domain: "huberty.se",
    owner: "Konny Pettersson",
    tagline: "Sajter som tål att visas. Analyser som tål att delas.",
  },
  nav: {
    home: "Hem",
    projects: "Projekt",
    analyze: "Analys",
    about: "Om",
  },
  hero: {
    kicker: "Portfolio + sajtanalys",
    title: "Se din sajt som den verkligen är.",
    lead: "Klistra in en URL. Få ett tydligt betyg på säkerhet, prestanda, SEO och tillgänglighet — plus vad du ska göra först.",
    placeholder: "https://din-sajt.se",
    cta: "Analysera",
    hint: "Gratis, utan inloggning. Vi hämtar bara det som är publikt.",
  },
} as const;

export type Copy = typeof copy;
