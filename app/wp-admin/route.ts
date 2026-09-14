export async function GET() {
  await new Promise((r) => setTimeout(r, 800));
  return new Response("Index", {
    status: 200,
    headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex", "cache-control": "no-store" },
  });
}
