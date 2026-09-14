import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";
import type { ScanJob } from "./types";

const mem = new Map<string, ScanJob>();

function dirs(): string[] {
  return [path.join(process.cwd(), ".data", "jobs"), path.join(os.tmpdir(), "hubbert-jobs")];
}

function fileFor(dir: string, id: string) {
  return path.join(dir, `${id}.json`);
}

function assertId(id: string) {
  if (!/^[a-zA-Z0-9_-]{8,32}$/.test(id)) {
    throw new Error("Ogiltigt jobb-id.");
  }
}

export function newJobId() {
  return randomBytes(8).toString("hex");
}

export async function writeJob(job: ScanJob) {
  mem.set(job.id, job);
  assertId(job.id);
  const payload = JSON.stringify(job);
  let lastErr: unknown;
  for (const dir of dirs()) {
    try {
      await mkdir(dir, { recursive: true });
      const target = fileFor(dir, job.id);
      const tmp = `${target}.${process.pid}.${randomBytes(3).toString("hex")}.tmp`;
      await writeFile(tmp, payload, "utf8");
      await rename(tmp, target);
      return;
    } catch (err) {
      lastErr = err;
    }
  }
  if (!mem.has(job.id)) throw lastErr instanceof Error ? lastErr : new Error("Kunde inte spara jobbet.");
}

export async function readJob(id: string): Promise<ScanJob | null> {
  try {
    assertId(id);
  } catch {
    return null;
  }
  const cached = mem.get(id);
  if (cached) return cached;
  for (const dir of dirs()) {
    try {
      const raw = await readFile(fileFor(dir, id), "utf8");
      const job = JSON.parse(raw) as ScanJob;
      mem.set(id, job);
      return job;
    } catch {
      /* try next */
    }
  }
  return null;
}

export async function createJob(url: string): Promise<ScanJob> {
  const now = new Date().toISOString();
  const job: ScanJob = {
    id: newJobId(),
    url,
    status: "queued",
    createdAt: now,
    updatedAt: now,
    progress: { step: "DNS / TLS", percent: 6 },
    unlock: "free",
  };
  await writeJob(job);
  return job;
}

export async function patchJob(id: string, patch: Partial<ScanJob>) {
  const current = await readJob(id);
  if (!current) throw new Error("Jobbet finns inte.");
  const next: ScanJob = {
    ...current,
    ...patch,
    id: current.id,
    updatedAt: new Date().toISOString(),
  };
  await writeJob(next);
  return next;
}
