import { corsHeadersFor } from "@/lib/security/origin";

export function analysHeaders(request?: Request, init?: HeadersInit): Headers {
  const headers = new Headers(init);
  const extra = corsHeadersFor(request?.headers.get("origin") ?? null);
  for (const [k, v] of Object.entries(extra)) headers.set(k, v);
  return headers;
}

export function corsPreflight(request: Request) {
  return new Response(null, { status: 204, headers: analysHeaders(request) });
}

export function jsonOk(data: unknown, status = 200, request?: Request) {
  return Response.json(data, { status, headers: analysHeaders(request) });
}

export function jsonErr(
  error: string,
  status: number,
  code: string,
  extra?: Record<string, unknown>,
  request?: Request,
) {
  return Response.json(
    { error, code, retryable: status >= 500 || status === 429, ...extra },
    { status, headers: analysHeaders(request) },
  );
}
