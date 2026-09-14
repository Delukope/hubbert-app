export function tarpitMs(aggressive: boolean) {
  if (!aggressive) return 0;
  return 900 + Math.floor(Math.random() * 1600);
}

export async function maybeTarpit(aggressive: boolean) {
  const ms = tarpitMs(aggressive);
  if (ms <= 0) return;
  await new Promise((r) => setTimeout(r, ms));
}
