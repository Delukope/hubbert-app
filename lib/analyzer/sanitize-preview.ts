import * as cheerio from "cheerio";

const MAX_PREVIEW = 280_000;

export function sanitizePreviewHtml(html: string, baseUrl: string): string {
  const $ = cheerio.load(html);
  $("script, iframe, object, embed, form, link[rel='import'], link[rel='preload'], link[rel='modulepreload']").remove();
  $("[onload], [onerror], [onclick], [onmouseover], [onfocus], [onsubmit]").each((_, el) => {
    const attribs = (el as unknown as { attribs?: Record<string, string> }).attribs ?? {};
    for (const key of Object.keys(attribs)) {
      if (key.toLowerCase().startsWith("on")) $(el).removeAttr(key);
    }
  });
  $("a[href], img[src], source[src], video[src], audio[src]").each((_, el) => {
    const tag = ($(el).prop("tagName") as string | undefined)?.toLowerCase() ?? "";
    const attr = tag === "a" ? "href" : "src";
    const raw = $(el).attr(attr);
    if (!raw) return;
    const trimmed = raw.trim();
    if (/^javascript:/i.test(trimmed) || /^data:text\/html/i.test(trimmed)) {
      $(el).removeAttr(attr);
      return;
    }
    try {
      const abs = new URL(trimmed, baseUrl);
      if (abs.protocol === "http:" || abs.protocol === "https:") $(el).attr(attr, abs.href);
      else $(el).removeAttr(attr);
    } catch {
      $(el).removeAttr(attr);
    }
  });
  $("base").remove();
  $("meta[http-equiv]").remove();
  $("body").prepend(
    `<div style="font:12px/1.4 ui-monospace,monospace;padding:8px;background:#111;color:#7dffb3">Hubberty-förhandsvisning · skript avstängda</div>`,
  );
  let out = $.html();
  if (out.length > MAX_PREVIEW) out = out.slice(0, MAX_PREVIEW);
  return out;
}
