import { isIP, isIPv4 } from "node:net";
import { promises as dns } from "node:dns";

const BLOCKED_HOSTS = new Set([
  "localhost",
  "localhost.localdomain",
  "metadata.google.internal",
  "metadata.goog",
  "metadata",
  "instance-data",
  "internal",
]);

const BLOCKED_SUFFIXES = [".localhost", ".local", ".internal", ".lan", ".home", ".corp", ".private"];

export class SsrfError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SsrfError";
  }
}

function ipv4ToInt(ip: string): number {
  return ip.split(".").reduce((acc, oct) => (acc << 8) + Number(oct), 0) >>> 0;
}

function inCidr(ip: number, base: number, maskBits: number) {
  const mask = maskBits === 0 ? 0 : (0xffffffff << (32 - maskBits)) >>> 0;
  return (ip & mask) === (base & mask);
}

export function isPrivateIPv4(ip: string): boolean {
  const n = ipv4ToInt(ip);
  return (
    inCidr(n, 0x00000000, 8) || // 0.0.0.0/8
    inCidr(n, 0x0a000000, 8) || // 10.0.0.0/8
    inCidr(n, 0x7f000000, 8) || // 127.0.0.0/8
    inCidr(n, 0xa9fe0000, 16) || // 169.254.0.0/16
    inCidr(n, 0xac100000, 12) || // 172.16.0.0/12
    inCidr(n, 0xc0a80000, 16) || // 192.168.0.0/16
    inCidr(n, 0x64400000, 10) || // 100.64.0.0/10 CGNAT
    inCidr(n, 0xc0000000, 24) || // 192.0.0.0/24
    inCidr(n, 0xc0000200, 24) || // 192.0.2.0/24
    inCidr(n, 0xc6120000, 15) || // 198.18.0.0/15
    inCidr(n, 0xc6336400, 24) || // 198.51.100.0/24
    inCidr(n, 0xcb007100, 24) || // 203.0.113.0/24
    inCidr(n, 0xe0000000, 4) || // 224.0.0.0/4
    inCidr(n, 0xf0000000, 4) // 240.0.0.0/4
  );
}

export function isPrivateIPv6(ip: string): boolean {
  const n = ip.toLowerCase();
  if (n === "::" || n === "::1") return true;
  if (n.startsWith("::ffff:")) {
    const mapped = n.slice("::ffff:".length);
    if (isIPv4(mapped)) return isPrivateIPv4(mapped);
  }
  if (n.startsWith("fe80:") || n.startsWith("fe8") || n.startsWith("fe9") || n.startsWith("fea") || n.startsWith("feb")) {
    return true;
  }
  if (n.startsWith("fc") || n.startsWith("fd")) return true;
  if (n.startsWith("ff")) return true;
  if (n.startsWith("2001:db8:")) return true;
  return false;
}

export function isPrivateIp(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4) return isPrivateIPv4(ip);
  if (version === 6) return isPrivateIPv6(ip);
  return true;
}

function hostnameBlocked(hostname: string): boolean {
  const host = hostname.replace(/\.$/, "").toLowerCase();
  if (BLOCKED_HOSTS.has(host)) return true;
  if (BLOCKED_SUFFIXES.some((s) => host.endsWith(s))) return true;
  if (host.endsWith(".nip.io") || host.endsWith(".sslip.io")) return true;
  return false;
}

export async function assertPublicHttpUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new SsrfError("Ogiltig URL.");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new SsrfError("Endast http och https tillåts.");
  }
  if (url.username || url.password) {
    throw new SsrfError("URL med inloggningsuppgifter tillåts inte.");
  }
  if (url.href.length > 2048) {
    throw new SsrfError("URL:en är för lång.");
  }

  const port = url.port ? Number(url.port) : url.protocol === "https:" ? 443 : 80;
  if (port !== 80 && port !== 443) {
    throw new SsrfError("Endast port 80 och 443 tillåts.");
  }

  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (hostnameBlocked(host)) {
    throw new SsrfError("Den här värden är blockerad.");
  }

  if (isIP(host)) {
    if (isPrivateIp(host)) {
      throw new SsrfError("Privata och lokala IP-adresser är blockerade.");
    }
    return url;
  }

  let records: { address: string; family: number }[] = [];
  try {
    records = await dns.lookup(host, { all: true, verbatim: true });
  } catch {
    throw new SsrfError("Kunde inte slå upp värdnamnet.");
  }
  if (records.length === 0) {
    throw new SsrfError("Kunde inte slå upp värdnamnet.");
  }
  for (const rec of records) {
    if (isPrivateIp(rec.address)) {
      throw new SsrfError("Värdnamnet pekar mot en privat eller lokal adress.");
    }
  }

  return url;
}
