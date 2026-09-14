const extra = (process.env.ABUSE_IP_BLOCKLIST || "")
  .split(/[\s,]+/)
  .map((s) => s.trim())
  .filter(Boolean);

const STATIC = new Set(["0.0.0.0", "255.255.255.255", ...extra]);

export function isBlockedIp(ip: string) {
  if (STATIC.has(ip)) return true;
  if (ip.startsWith("10.") || ip.startsWith("127.")) return false;
  return false;
}
