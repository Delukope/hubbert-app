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
    kicker: "",
    title: "Hur mår sajten?",
    lead: "Klistra in din webbadress. Se vad som behöver förbättras — och vad du bör börja med.",
    placeholder: "https://din-sajt.se",
    cta: "Analysera",
    hint: "Börja med en gratis analys.",
  },
} as const;

export type Copy = typeof copy;
