import { assertPublicHttpUrl, SsrfError } from "./ssrf";

const MAX_BYTES = 1_500_000;
const MAX_REDIRECTS = 5;
const TIMEOUT_MS = 8_000;
const UA =
  "Mozilla/5.0 (compatible; HubbertAnalyzer/1.0; +https://hubberty.se) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export type FetchedPage = {
  finalUrl: string;
  status: number;
  headers: Record<string, string>;
  html: string;
  bytes: number;
  ttfbMs: number;
  redirectCount: number;
  compressed: boolean;
  encoding?: string;
};

function headerMap(headers: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  headers.forEach((value, key) => {
    out[key.toLowerCase()] = value;
  });
  return out;
}

function fetchMessage(err: unknown): string {
  if (err instanceof SsrfError) return err.message;
  if (err instanceof Error) {
    const name = err.name;
    if (name === "TimeoutError" || name === "AbortError") return "Tidsgränsen för hämtning gick ut.";
    const msg = err.message.toLowerCase();
    if (msg.includes("certificate") || msg.includes("ssl") || msg.includes("tls")) {
      return "TLS/certifikatfel vid hämtning.";
    }
    if (msg.includes("fetch") || msg.includes("network") || msg.includes("econn") || msg.includes("enotfound")) {
      return "Kunde inte nå sajten.";
    }
    return err.message;
  }
  return "Kunde inte nå sajten.";
}

async function readLimited(res: Response): Promise<{ text: string; bytes: number }> {
  if (!res.body) {
    const text = await res.text();
    return { text, bytes: new TextEncoder().encode(text).length };
  }
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_BYTES) {
      try {
        await reader.cancel();
      } catch {
        /* ignore */
      }
      throw new Error("Svaret är för stort att analysera.");
    }
    chunks.push(value);
  }
  const buf = new Uint8Array(bytes);
  let offset = 0;
  for (const c of chunks) {
    buf.set(c, offset);
    offset += c.byteLength;
  }
  return { text: new TextDecoder("utf-8", { fatal: false }).decode(buf), bytes };
}

async function fetchOnce(rawUrl: string): Promise<FetchedPage> {
  let current = await assertPublicHttpUrl(rawUrl);
  let redirectCount = 0;
  let ttfbMs = 0;
  const seen = new Set<string>();

  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    if (seen.has(current.href)) {
      throw new SsrfError("Omdirigeringsloop.");
    }
    seen.add(current.href);
    current = await assertPublicHttpUrl(current.href);

    const started = performance.now();
    let res: Response;
    try {
      res = await fetch(current.href, {
        method: "GET",
        redirect: "manual",
        headers: {
          accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
          "accept-encoding": "gzip, deflate, br",
          "user-agent": UA,
          "accept-language": "sv-SE,sv;q=0.9,en;q=0.8",
        },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (err) {
      throw new Error(fetchMessage(err));
    }
    ttfbMs = performance.now() - started;

    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) throw new Error(`Omdirigering utan Location (${res.status}).`);
      current = new URL(loc, current);
      redirectCount += 1;
      continue;
    }

    if (res.status >= 400) {
      throw new Error(`Sajten svarade med ${res.status}.`);
    }

    const headers = headerMap(res.headers);
    const encoding = headers["content-encoding"];
    const { text, bytes } = await readLimited(res);

    return {
      finalUrl: current.href,
      status: res.status,
      headers,
      html: text,
      bytes,
      ttfbMs,
      redirectCount,
      compressed: Boolean(encoding && encoding !== "identity"),
      encoding,
    };
  }

  throw new Error("För många omdirigeringar.");
}

export async function fetchPublicPage(rawUrl: string): Promise<FetchedPage> {
  try {
    return await fetchOnce(rawUrl);
  } catch (err) {
    if (err instanceof SsrfError) throw err;
    await new Promise((r) => setTimeout(r, 350));
    return fetchOnce(rawUrl);
  }
}
