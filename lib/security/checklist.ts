/**
 * Hubbert hardening checklist (practical, not “AI magic”).
 * Review when shipping a security update — last pass: 2026-09-14.
 *
 * [ ] CSP / headers still applied in next.config + proxy
 * [ ] SSRF allowlist (80/443, no private IPs) in lib/analyzer/ssrf.ts
 * [ ] Mutations check Origin/Referer (lib/security/origin.ts)
 * [ ] /api/analys rate-limited per IP + daily cap
 * [ ] Unpaid jobs never return full issues, PDF, or deepSummary
 * [ ] OpenAI/PageSpeed only after paid djup/tung (lib/analyzer/enrich.ts)
 * [ ] Preview HTML served sandboxed, scripts stripped
 * [ ] Honeypot + trap routes still decoy, not 404 that teaches scrapers
 * [ ] robots.ts + ai.txt deny analys/api
 * [ ] ALLOW_DEMO_UNLOCK is false in production
 * [ ] Stripe webhook signature required
 */
export const SECURITY_REVIEW_DATE = "2026-09-14";
