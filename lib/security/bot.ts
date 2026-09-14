/**
 * Heuristic bot/scraper gate. Not a claim of AI-model detection —
 * just cheap signals we can maintain: UA tokens, missing Accept-Language, etc.
 */

const SCRAPER_UA =
  /GPTBot|ChatGPT-User|CCBot|ClaudeBot|anthropic-ai|Bytespider|Amazonbot|meta-externalagent|FacebookBot|PetalBot|Scrapy|curl\/|python-requests|Go-http-client|Java\/|libwww|wget|ia_archiver|DataForSeo|SemrushBot|AhrefsBot|mj12bot|DotBot/i;

const BROWSERISH = /Mozilla\/|Chrome\/|Safari\/|Firefox\/|Edg\//;

export function looksLikeScraper(ua: string, acceptLanguage: string | null) {
  if (!ua) return true;
  if (SCRAPER_UA.test(ua)) return true;
  if (!BROWSERISH.test(ua) && ua.length < 40) return true;
  if (!acceptLanguage && /bot|spider|crawl/i.test(ua)) return true;
  return false;
}

export function honeypotFilled(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}
