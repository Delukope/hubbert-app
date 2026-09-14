import type { ScanFacts } from "./types";

export type SizeClass = "normal" | "heavy";

export function classifySize(facts: ScanFacts, bytes: number): { sizeClass: SizeClass; reasons: string[] } {
  const reasons: string[] = [];
  if (bytes >= 400_000) reasons.push(`HTML ${bytes} B`);
  if (facts.images.total >= 60) reasons.push(`${facts.images.total} bilder`);
  if (facts.wordCount >= 6000) reasons.push(`${facts.wordCount} ord`);
  if (facts.links.internal >= 120) reasons.push(`${facts.links.internal} interna länkar`);
  return { sizeClass: reasons.length >= 1 ? "heavy" : "normal", reasons };
}
