"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScanTheater } from "@/components/analyzer/scan-theater";
import { PackageChooser } from "@/components/package-chooser";
import { copy } from "@/lib/copy";
import { formatSek, snabbSek, type PackageId } from "@/lib/pricing";

type StartResult =
  | { ok: true; id: string; url: string }
  | { ok: false; error: string; code: string; retryable: boolean };

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function classify(status: number, code?: string): { retryable: boolean; fallback: string } {
  if (code === "blocked") return { retryable: false, fallback: "URL:en tillåts inte (privat, lokal eller metadata)." };
  if (code === "csrf") return { retryable: false, fallback: "Begäran kom från fel origin." };
  if (code === "rate_limited") return { retryable: true, fallback: "För många skanningar. Vänta och försök igen." };
  if (code === "invalid_url" || code === "invalid_json") return { retryable: false, fallback: "Ogiltig URL." };
  if (status === 404) return { retryable: true, fallback: "Analysjobbet hittades inte. Försök igen." };
  if (status === 429 || status >= 500) return { retryable: true, fallback: "Motorn är upptagen. Vi kan försöka igen." };
  return { retryable: status >= 500, fallback: "Kunde inte starta analysen." };
}

async function startScan(url: string, intent: "teaser" | "snabb" | "djup"): Promise<StartResult> {
  let last: StartResult = {
    ok: false,
    error: "Tillfällig nätverksstörning. Försök igen.",
    code: "network",
    retryable: true,
  };

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch("/api/analys", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ url, intent, fax_number: "" }),
        signal: AbortSignal.timeout(18_000),
      });
      const text = await res.text();
      let data: { id?: string; url?: string; error?: string; code?: string; retryable?: boolean } = {};
      try {
        data = JSON.parse(text) as typeof data;
      } catch {
        last = {
          ok: false,
          error: res.ok ? "Oväntat svar från motorn." : "Analysmotorn svarade inte med JSON.",
          code: "bad_response",
          retryable: true,
        };
        if (attempt < 2 && (!res.ok || res.status >= 500)) {
          await sleep(400 * 2 ** attempt);
          continue;
        }
        return last;
      }

      if (res.ok && data.id) {
        return { ok: true, id: data.id, url: data.url ?? url };
      }

      const mapped = classify(res.status, data.code);
      last = {
        ok: false,
        error: data.error || mapped.fallback,
        code: data.code || "start_failed",
        retryable: data.retryable ?? mapped.retryable,
      };
      if (last.retryable && attempt < 2) {
        await sleep(400 * 2 ** attempt);
        continue;
      }
      return last;
    } catch (err) {
      const timeout = err instanceof DOMException && err.name === "TimeoutError";
      last = {
        ok: false,
        error: timeout
          ? "Svaret tog för lång tid. Vi kan köra om — skanningen sker på servern."
          : "Tillfällig nätverksstörning. Inte din sajt — vår motor. Försök igen.",
        code: timeout ? "timeout" : "network",
        retryable: true,
      };
      if (attempt < 2) await sleep(500 * 2 ** attempt);
    }
  }
  return last;
}

export function UrlForm({
  size = "lg",
  initialUrl = "",
  hero = false,
}: {
  size?: "lg" | "md";
  initialUrl?: string;
  hero?: boolean;
}) {
  const router = useRouter();
  const [url, setUrl] = useState(initialUrl);
  const [intent, setIntent] = useState<PackageId>("free");
  const [error, setError] = useState<string | null>(null);
  const [retryable, setRetryable] = useState(false);
  const [pending, setPending] = useState(false);

  async function run(target = url) {
    setError(null);
    setRetryable(false);
    setPending(true);
    const scanIntent = intent === "djup" ? "djup" : intent === "snabb" ? "snabb" : "teaser";
    const result = await startScan(target, scanIntent);
    if (result.ok) {
      router.push(`/analys/${result.id}?nisse=1`);
      return;
    }
    setError(result.error);
    setRetryable(result.retryable);
    setPending(false);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await run();
  }

  if (pending) {
    return (
      <div className="w-full">
        <ScanTheater url={url.startsWith("http") ? url : `https://${url}`} status="boot" boot percent={10} />
        <p className="mt-3 font-mono text-xs text-muted">Skapar jobb på hubberty.se — lämna inte sidan.</p>
      </div>
    );
  }

  return (
    <>
      {hero ? (
        <div className="mx-auto max-w-3xl">
          <h1 className="display text-4xl sm:text-6xl">Vad behöver din sajt?</h1>
          <p className="mt-4 max-w-xl text-muted">{copy.hero.hint}</p>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Full rapport från {formatSek(snabbSek())}. Djupare genomgång betalas innan den körs.
          </p>
        </div>
      ) : null}
      <form onSubmit={onSubmit} className={hero ? "relative mx-auto mt-10 w-full max-w-3xl" : "relative w-full"}>
        <input
          tabIndex={-1}
          autoComplete="off"
          name="fax_number"
          aria-hidden
          className="absolute h-0 w-0 overflow-hidden opacity-0"
        />
        <PackageChooser value={intent} onChange={setIntent} options={["free", "snabb", "djup"]} />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <label className="sr-only" htmlFor="url">
          Webbplatsens URL
        </label>
        <Input
          id="url"
          name="url"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="https://din-sajt.se"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className={size === "lg" ? "h-14" : "h-12"}
        />
        <Button type="submit" size={size === "lg" ? "lg" : "md"} disabled={pending} className="shrink-0 sm:min-w-44">
          Analysera
        </Button>
      </div>
      {error ? (
        <div className="mt-4 rounded-sm border border-warn/35 bg-warn/8 px-4 py-3" role="alert">
          <p className="text-sm text-fg">{error}</p>
          {retryable ? (
            <button
              type="button"
              onClick={() => void run()}
              className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ion hover:underline"
            >
              Kör igen
            </button>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted">{copy.hero.hint} Privata och lokala adresser släpps inte in.</p>
      )}
    </form>
    </>
  );
}
