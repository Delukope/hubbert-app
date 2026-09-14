import { cn, scoreTone } from "@/lib/utils";

const stroke: Record<ReturnType<typeof scoreTone>, string> = {
  mint: "stroke-mint",
  gold: "stroke-gold",
  warn: "stroke-warn",
  bad: "stroke-bad",
};

const text: Record<ReturnType<typeof scoreTone>, string> = {
  mint: "text-mint",
  gold: "text-gold",
  warn: "text-warn",
  bad: "text-bad",
};

export function ScoreRing({
  score,
  label,
  size = 148,
  grade,
}: {
  score: number;
  label?: string;
  size?: number;
  grade?: string;
}) {
  const tone = scoreTone(score);
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, score)) / 100) * c;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r={r}
          className="stroke-white/8"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          className={cn(stroke[tone])}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="pointer-events-none absolute flex flex-col items-center">
        <span className={cn("font-mono text-3xl tracking-tight", text[tone])}>
          {grade ?? Math.round(score)}
        </span>
      </div>
      {label ? (
        <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
      ) : null}
    </div>
  );
}

export function ScoreRingWrap(props: Parameters<typeof ScoreRing>[0]) {
  return (
    <div className="relative flex items-center justify-center">
      <ScoreRing {...props} />
    </div>
  );
}
