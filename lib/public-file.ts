import { access } from "node:fs/promises";
import path from "node:path";

const COVER_EXTS = [".jpg", ".jpeg", ".png", ".webp"] as const;

export async function publicFileExists(src?: string) {
  if (!src) return false;
  try {
    await access(path.join(process.cwd(), "public", src.replace(/^\//, "")));
    return true;
  } catch {
    return false;
  }
}

/** Resolve a cover path, trying jpg/png/webp siblings so dropped files just work. */
export async function resolvePublicCover(src?: string) {
  if (!src) return undefined;
  if (await publicFileExists(src)) return src;
  const stem = src.replace(/\.[^.]+$/, "");
  for (const ext of COVER_EXTS) {
    const candidate = `${stem}${ext}`;
    if (candidate !== src && (await publicFileExists(candidate))) return candidate;
  }
  return undefined;
}
