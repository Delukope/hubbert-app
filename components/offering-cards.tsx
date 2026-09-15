import Link from "next/link";

const cards = [
  {
    href: "/projekt#sajter",
    title: "Sajt",
    lead: "Hemsidor och omskrivningar.",
    cta: "Se webbprojekt",
    motif: "browser" as const,
  },
  {
    href: "/projekt#appar",
    title: "App",
    lead: "Appbyggen. Hubrix är ett exempel — inte lanserad än.",
    cta: "Se appar",
    motif: "phone" as const,
  },
  {
    href: "/analys",
    title: "Analys",
    lead: "Betyg och vad du bör börja med.",
    cta: "Testa din sajt",
    motif: "bars" as const,
  },
];

function Motif({ kind }: { kind: "browser" | "phone" | "bars" }) {
  const stroke = "currentColor";
  if (kind === "browser") {
    return (
      <svg viewBox="0 0 48 36" className="h-9 w-12 text-ion" aria-hidden>
        <rect x="1.5" y="1.5" width="45" height="33" rx="3" fill="none" stroke={stroke} strokeWidth="1.4" />
        <path d="M1.5 10.5h45" stroke={stroke} strokeWidth="1.4" />
        <circle cx="8" cy="6" r="1.2" fill={stroke} />
        <circle cx="13" cy="6" r="1.2" fill={stroke} />
        <circle cx="18" cy="6" r="1.2" fill={stroke} />
      </svg>
    );
  }
  if (kind === "phone") {
    return (
      <svg viewBox="0 0 28 44" className="h-10 w-7 text-ion" aria-hidden>
        <rect x="1.5" y="1.5" width="25" height="41" rx="4" fill="none" stroke={stroke} strokeWidth="1.4" />
        <rect x="10" y="5" width="8" height="2" rx="1" fill={stroke} />
        <rect x="11" y="37" width="6" height="2.5" rx="1.2" fill="none" stroke={stroke} strokeWidth="1.2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 36" className="h-9 w-12 text-ion" aria-hidden>
      {[10, 18, 26, 22, 14].map((h, i) => (
        <rect key={i} x={6 + i * 8} y={32 - h} width="5" height={h} fill={stroke} opacity={0.45 + i * 0.12} />
      ))}
    </svg>
  );
}

export function OfferingCards() {
  return (
    <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="group bg-bg p-6 motion-safe:transition-[border-color,background-color] hover:bg-white/3 hover:outline hover:outline-1 hover:outline-ion/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ion"
        >
          <Motif kind={card.motif} />
          <h2 className="display mt-4 text-2xl">{card.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{card.lead}</p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ion">{card.cta}</p>
        </Link>
      ))}
    </div>
  );
}
