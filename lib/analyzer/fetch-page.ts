import { assertPublicHttpUrl, SsrfError } from "./ssrf";

const MAX_BYTES = 1_500_000;
const MAX_REDIRECTS = 5;
const TIMEOUT_MS = 12_000;
const UA = "HubertyAnalyzer/1.0 (+https://huberty.se)";

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

export async function fetchPublicPage(rawUrl: string): Promise<FetchedPage> {
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
    const res = await fetch(current.href, {
      method: "GET",
      redirect: "manual",
      headers: {
        accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "accept-encoding": "gzip, deflate, br",
        "user-agent": UA,
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
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
