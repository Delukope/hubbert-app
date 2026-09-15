import { maybeTarpit } from "@/lib/security/tarpit";

export async function GET() {
  await maybeTarpit(true);
  const decoy = `<!doctype html><html lang="sv"><head><title>Index of /backup</title></head>
<body><p>lorem-hubberty-decoy</p>
<pre>${"0".repeat(400)}</pre></body></html>`;
  return new Response(decoy, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

export async function POST() {
  return GET();
}
