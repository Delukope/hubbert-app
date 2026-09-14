import * as cheerio from "cheerio";
import type { ScanFacts } from "./types";

function absUrl(href: string | undefined, base: string): string | undefined {
  if (!href) return undefined;
  try {
    return new URL(href, base).href;
  } catch {
    return undefined;
  }
}

function jsonLdTypes(raw: string): string[] {
  try {
    const data = JSON.parse(raw) as unknown;
    const types: string[] = [];
    const walk = (node: unknown) => {
      if (!node) return;
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      if (typeof node === "object") {
        const rec = node as Record<string, unknown>;
        const t = rec["@type"];
        if (typeof t === "string") types.push(t);
        if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && types.push(x));
        if (rec["@graph"]) walk(rec["@graph"]);
      }
    };
    walk(data);
    return [...new Set(types)];
  } catch {
    return [];
  }
}

export function parseHtml(html: string, baseUrl: string): ScanFacts {
  const $ = cheerio.load(html);
  const attr = (sel: string) => $(sel).attr("content")?.trim() || undefined;
  const origin = (() => {
    try {
      return new URL(baseUrl).origin;
    } catch {
      return baseUrl;
    }
  })();

  let internal = 0;
  let external = 0;
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    try {
      const u = new URL(href, baseUrl);
      if (u.origin === origin) internal += 1;
      else if (u.protocol === "http:" || u.protocol === "https:") external += 1;
    } catch {
      /* ignore */
    }
  });

  let withAlt = 0;
  let withoutAlt = 0;
  $("img").each((_, el) => {
    const alt = $(el).attr("alt");
    if (typeof alt === "string" && alt.trim().length > 0) withAlt += 1;
    else withoutAlt += 1;
  });

  const types: string[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    types.push(...jsonLdTypes($(el).html() || ""));
  });

  const text = $("body").text().replace(/\s+/g, " ").trim();
  const charset =
    $('meta[charset]').attr("charset") ||
    attr('meta[http-equiv="content-type" i]') ||
    undefined;

  return {
    title: $("title").first().text().trim() || undefined,
    description: attr('meta[name="description" i]'),
    canonical: absUrl($('link[rel="canonical"]').attr("href"), baseUrl),
    lang: $("html").attr("lang")?.trim() || undefined,
    charset,
    viewport: attr('meta[name="viewport" i]'),
    robots: attr('meta[name="robots" i]'),
    ogTitle: attr('meta[property="og:title"]'),
    ogDescription: attr('meta[property="og:description"]'),
    ogImage: absUrl(attr('meta[property="og:image"]'), baseUrl),
    ogType: attr('meta[property="og:type"]'),
    twitterCard: attr('meta[name="twitter:card" i]'),
    generator: attr('meta[name="generator" i]'),
    headings: {
      h1: $("h1").length,
      h2: $("h2").length,
      h3: $("h3").length,
    },
    images: {
      total: withAlt + withoutAlt,
      withAlt,
      withoutAlt,
    },
    links: { internal, external },
    jsonLdTypes: [...new Set(types)],
    wordCount: text ? text.split(" ").filter(Boolean).length : 0,
    hasFavicon: $('link[rel*="icon" i]').length > 0,
  };
}
