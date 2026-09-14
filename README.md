# Huberty

Portfolio + sajtanalys för [huberty.se](https://huberty.se).  
Ägare: **Konny Pettersson**.

Mörkt produkt-UI på Next.js App Router. Inte WordPress. Inte Divi. En kodyta som går att iterera på och en rapport som går att dela.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4 + shadcn-liknande primitives
- Framer Motion (respekterar `prefers-reduced-motion`)
- Recharts
- Zod
- Cheerio för HTML-parse
- Filbaserad jobbstore (`.data/jobs`)

## Kom igång

```bash
npm install
cp .env.example .env.local
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Miljövariabler

Se `.env.example`.

| Nyckel | Syfte |
| --- | --- |
| `PAGESPEED_API_KEY` | Valfri PageSpeed Insights-berikning |
| `OPENAI_API_KEY` | Valfri svensk executive summary |
| `OPENAI_MODEL` | Default `gpt-4o-mini` |
| `NEXT_PUBLIC_SITE_URL` | Canonical bas-URL |

Utan nycklar fungerar analysen ändå: heuristiska betyg + mallad svensk sammanfattning. Om livehämtning blockeras (brandvägg, timeout) skrivs en **komplett demo-rapport** med tydlig märkning.

## Routes

| Path | Innehåll |
| --- | --- |
| `/` | Hero-analys + utvalda projekt |
| `/projekt` | Portföljgrid |
| `/projekt/[slug]` | Fallstudie |
| `/analys` | URL-formulär |
| `/analys/[jobId]` | Progress + rapportdashboard |
| `/om` `/integritet` `/villkor` | Stubbar |

## Analysmotor

1. Normaliserar URL (lägger till `https://` vid behov).
2. SSRF-skydd: bara `http`/`https`, port 80/443, inga credentials. Blockerar localhost, `.local`/`.internal`, länk-lokala och privata IPv4/IPv6, CGNAT, metadata-värdar. DNS slås upp och varje IP granskas. Redirects valideras om.
3. Hämtar HTML + headers (timeout, max storlek).
4. Parsar title/meta/OG/canonical/robots/headings/lang/viewport/JSON-LD/alt-täckning.
5. Security headers A+…F (HSTS, CSP, XCTO, XFO, Referrer-Policy, Permissions-Policy) + HTTPS.
6. Prestandaheuristik (TTFB, storlek, komprimering, cache, redirects).
7. SEO- och a11y-poäng 0–100, helhet, prioriterade åtgärder.
8. Sparar jobbet. Rapport-URL är delbar.

Projektlistan ligger i `lib/projects.ts` — redigera där.

## Säkerhet

Inga hemligheter i git. `.env*` ignoreras (`.env.example` committas). Jobbfiler ligger i `.data/` och ignoreras.

## Licens

Privat sajt för huberty.se.
