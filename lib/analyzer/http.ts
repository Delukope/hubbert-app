export function analysHeaders(init?: HeadersInit): Headers {
  const headers = new Headers(init);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Accept");
  headers.set("Access-Control-Max-Age", "86400");
  headers.set("Cache-Control", "no-store");
  return headers;
}

export function corsPreflight() {
  return new Response(null, { status: 204, headers: analysHeaders() });
}

export function jsonOk(data: unknown, status = 200) {
  return Response.json(data, { status, headers: analysHeaders() });
}

export function jsonErr(error: string, status: number, code: string, extra?: Record<string, unknown>) {
  return Response.json({ error, code, retryable: status >= 500 || status === 429, ...extra }, { status, headers: analysHeaders() });
}
