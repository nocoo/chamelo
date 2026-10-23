export function assertLiveResponse(response: Response, payload: unknown, version: string): void {
  if (response.status !== 200) throw new Error('Health endpoint did not return HTTP 200.');
  if (!/^application\/json(?:\s*;|$)/i.test(response.headers.get('content-type') ?? '')) {
    throw new Error('Health endpoint did not return application/json.');
  }
  const directives = (response.headers.get('cache-control') ?? '')
    .toLowerCase()
    .split(',')
    .map((directive) => directive.trim());
  if (!directives.includes('no-store')) throw new Error('Health endpoint must use no-store.');
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new Error('Health payload must be a JSON object.');
  }
  const health = payload as Record<string, unknown>;
  if (health.status !== 'ok' || health.name !== 'chamelo' || health.version !== version) {
    throw new Error(`Health payload does not identify Chamelo v${version}.`);
  }
}
