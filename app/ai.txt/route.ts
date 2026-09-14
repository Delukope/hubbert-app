export function GET() {
  const body = `# ai.txt — hubberty.se
# Heuristic policy for automated agents. Not a detector of any particular model.
User-Agent: *
Disallow: /analys
Disallow: /api
Disallow: /trap
Disallow: /wp-admin
`;
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=86400" },
  });
}
