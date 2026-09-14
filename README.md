# Hubbert

Produkt på **[hubberty.se](https://hubberty.se)** (två t + y). UI-namn: **Hubbert**.  
Ägare: **Konny Pettersson**.

Sajtanalys (gratis teaser → betald full rapport + PDF), hemsidor och appar. Inte WordPress. Inte Divi.

## Stack

- Next.js 16 App Router + TypeScript + Tailwind 4
- Recharts, Zod, Cheerio
- Stripe Checkout (valfritt)
- `@react-pdf/renderer` för betald PDF
- Filstore `.data/jobs`

## Kom igång

```bash
npm install
cp .env.example .env.local
# För att testa upplåsning utan kort:
# ALLOW_DEMO_UNLOCK=true
npm run dev
```

```bash
npm run build
npm start
```

## Priser (placeholder)

| Nivå | Default |
| --- | --- |
| Teaser | 0 kr |
| Snabb analys | 199 kr (`PRICE_SNABB_SEK`) |
| Djupanalys | 990 kr (`PRICE_DJUP_SEK`) |

Stripe: `STRIPE_SECRET_KEY` + `STRIPE_PRICE_SNABB` / `STRIPE_PRICE_DJUP`. Utan nycklar: ingen fejkad betalning. Demo-upplåsning bara om `ALLOW_DEMO_UNLOCK=true`.

## Routes

`/`, `/projekt`, `/projekt/[slug]`, `/analys`, `/analys/[jobId]`, `/tjanster`, `/priser`, `/om`, `/integritet`, `/villkor`

## Portfölj

Redigera `lib/projects.ts`. Live: Hubbert (hubberty.se), Akalasi. Före/efter-slotar: Värmlands Trädfällning, Filipsson Entreprenad. Appar: Hubberty, STAMPE. Tidigare: west2000, trallen, jodeko.

## Licens

Privat sajt för hubberty.se.
