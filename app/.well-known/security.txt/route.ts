export function GET() {
  const body = `Contact: https://hubberty.se/om
Policy: https://hubberty.se/integritet
Preferred-Languages: sv, en
`;
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=86400" },
  });
}
