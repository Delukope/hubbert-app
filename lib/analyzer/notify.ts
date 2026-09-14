/**
 * Outbound notify policy. There is no mailer wired yet on purpose.
 * If/when email exists: teaser + signed pay link only. Never PDF, never full JSON.
 */
import { isPaid } from "@/lib/analyzer/access";
import type { ScanJob } from "@/lib/analyzer/types";
import { teaserPayLink } from "@/lib/security/signed-link";
import { siteUrl } from "@/lib/utils";

export function canEmailFullReport(job: ScanJob) {
  return isPaid(job);
}

export function teaserNotifyPayload(job: ScanJob) {
  const host = (() => {
    try {
      return new URL(job.url).hostname;
    } catch {
      return job.url;
    }
  })();
  const score = job.report?.overall;
  return {
    subject: `Hubbert-teaser: ${host}`,
    text: [
      `Teaser för ${host}${typeof score === "number" ? ` · ${score}/100` : ""}.`,
      "Full rapport och PDF skickas inte förrän betalning är registrerad.",
      teaserPayLink(siteUrl(), job.id, job.sizeClass === "heavy" ? "tung" : "snabb"),
    ].join("\n"),
  };
}
