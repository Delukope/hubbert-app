export const copy = {
  brand: {
    name: "Hubberty",
    domain: "hubberty.se",
    owner: "Konny Pettersson",
    tagline: "Sajtanalys, hemsidor och appar.",
  },
  nav: {
    home: "Hem",
    projects: "Projekt",
    analyze: "Analys",
    services: "Tjänster",
    prices: "Priser",
    about: "Om",
  },
  hero: {
    kicker: "Hubberty · hubberty.se",
    title: "Hur mår sajten?",
    lead: "Klistra in en URL. Du får betyg på säkerhet, prestanda, SEO och tillgänglighet — och vad som är värt att göra först.",
    placeholder: "https://din-sajt.se",
    cta: "Analysera",
    hint: "Gratis teaser, utan inloggning. Vi hämtar bara det som är publikt.",
  },
} as const;

export type Copy = typeof copy;
