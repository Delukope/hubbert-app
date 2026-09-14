import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

function dirs() {
  return [path.join(process.cwd(), ".data", "jobs"), path.join(os.tmpdir(), "hubbert-jobs")];
}

function assertId(id: string) {
  if (!/^[a-zA-Z0-9_-]{8,32}$/.test(id)) throw new Error("Ogiltigt jobb-id.");
}

export async function writePreviewHtml(id: string, html: string) {
  assertId(id);
  for (const dir of dirs()) {
    try {
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, `${id}.preview.html`), html, "utf8");
      return;
    } catch {
      /* next */
    }
  }
}

export async function readPreviewHtml(id: string): Promise<string | null> {
  try {
    assertId(id);
  } catch {
    return null;
  }
  for (const dir of dirs()) {
    try {
      return await readFile(path.join(dir, `${id}.preview.html`), "utf8");
    } catch {
      /* next */
    }
  }
  return null;
}
