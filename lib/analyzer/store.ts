import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import type { ScanJob } from "./types";

const DIR = path.join(process.cwd(), ".data", "jobs");

function fileFor(id: string) {
  if (!/^[a-zA-Z0-9_-]{8,32}$/.test(id)) {
    throw new Error("Ogiltigt jobb-id.");
  }
  return path.join(DIR, `${id}.json`);
}

export function newJobId() {
  return randomBytes(8).toString("hex");
}

async function ensureDir() {
  await mkdir(DIR, { recursive: true });
}

export async function writeJob(job: ScanJob) {
  await ensureDir();
  const target = fileFor(job.id);
  const tmp = `${target}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(job, null, 2), "utf8");
  await rename(tmp, target);
}

export async function readJob(id: string): Promise<ScanJob | null> {
  try {
    const raw = await readFile(fileFor(id), "utf8");
    return JSON.parse(raw) as ScanJob;
  } catch {
    return null;
  }
}

export async function createJob(url: string): Promise<ScanJob> {
  const now = new Date().toISOString();
  const job: ScanJob = {
    id: newJobId(),
    url,
    status: "queued",
    createdAt: now,
    updatedAt: now,
    progress: { step: "Köad", percent: 4 },
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
