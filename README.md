# Hubberty

Produkt på **[hubberty.se](https://hubberty.se)** (två t + y). Sajtnamn överallt i UI: **Hubberty**.  
Ägare: **Konny Pettersson**.

Internt (inte visat): npm-paketet heter `hubbert`, env-nyckeln `HUBBERT_SIGNING_SECRET` är oförändrad så befintlig drift inte går sönder.

Sajtanalys (gratis teaser på sajten → betald full rapport + PDF), hemsidor och appar. Inte WordPress. Inte Divi.

**Hubrix** (hubrix.se) är en kommande stämpelklocka för tid och projekt — en egen produkt, inte sajtnamnet här.

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

| Nivå | Default | När |
| --- | --- | --- |
| Teaser | 0 kr | På sajten. Ingen e-post med full rapport. |
| Snabb analys | 199 kr | Begränsat djup, PDF efter betalning. Ingen dyr AI. |
| Djupanalys | 990 kr | AI/PageSpeed **efter** betalning. |
| Tung / stor sajt | 2490 kr | Om HTML/bilder/länkar är tunga. Betala innan vidare pass. |

Stripe: `STRIPE_SECRET_KEY` + price ids. Utan nycklar: ingen fejkad betalning. Demo-upplåsning bara om `ALLOW_DEMO_UNLOCK=true`.

## Riskmodell (missbruk)

Konkurrenter och bots kan annars tömma kassan: varje “gratis full rapport” kostar hämtning + ev. AI.

- **Teaser** körs lokalt (heuristik). Ingen OpenAI. Rapporten redigeras i API:t; PDF är 403 tills `unlock` är betald.
- **Djup / tung** flaggas `deepPending` / `sizeClass=heavy`. AI-pass (`lib/analyzer/enrich.ts`) körs först efter Stripe/demo-unlock.
- **E-post:** ingen mailer är inkopplad. Policy i `lib/analyzer/notify.ts`: teaser + signerad betallänk, aldrig PDF/JSON.
- **Takt:** 8 teaser/timme och 20/dag per IP, honeypot-fält, origin-check på POST, blocklista, tarpit för kända scraper-UA. Inte “AI-detektion” — bara billiga heuristiker (`lib/security/`).
- Förhandsvisning av målsidan: sanerad HTML i sandlådad iframe (`sandbox=""`, inget JS i vår origin).

Checklista: `lib/security/checklist.ts`.

## Routes

`/`, `/projekt`, `/projekt/[slug]`, `/analys`, `/analys/[jobId]`, `/tjanster`, `/priser`, `/om`, `/integritet`, `/villkor`, `/ai.txt`

## Portfölj

Redigera `lib/projects.ts`. Live: Hubberty (hubberty.se), Akalasi. Före/efter-slotar: Värmlands Trädfällning, Filipsson Entreprenad. Appar: Hubberty (familjenav), Hubrix (stämpelklocka, hubrix.se). Tidigare: west2000, trallen, jodeko.

## Bilder

- Hubberty är sajtmarken, inte ett LIVE-kundcase på startsidan. Wordmark: `public/projects/hubberty-card.png` (samma som `public/brands/hubberty/logo-wordmark.png`) på mörk panel i `/projekt`. Header använder `icon-black.png`.
- Akalasi LIVE-kort: `public/projects/akalasi-showcase.png`. Detaljsida: stacked logo i `public/brands/akalasi/`.
- “En sajt/app från Hubberty”-märken: `public/brands/hubberty/en-*-fran.png` — sparsamt i portfölj/appar.
- Klient före/efter: `public/cases/...` — placeholders tills omskrivningen är klar.
- Hubrix-logotyper: `public/hubrix/` — bara på Hubrix-kortet.

## Licens

Privat sajt för hubberty.se.
