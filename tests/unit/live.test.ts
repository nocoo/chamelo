import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { version } from '../../package.json';
import { liveMiddleware } from '../../scripts/site-metadata';

const payload = { status: 'ok', version, name: 'chamelo' };
const middleware = liveMiddleware(JSON.stringify(payload));
const server = createServer((request, response) =>
  middleware(request, response, () => {
    response.statusCode = 404;
    response.end();
  }),
);
let origin: string;

beforeAll(async () => {
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});

describe('local health middleware', () => {
  it('returns anonymous uncached JSON with the manifest version', async () => {
    const response = await fetch(`${origin}/api/live?probe=1`);
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(await response.json()).toEqual(payload);
  });
  it('supports HEAD without a body', async () => {
    const response = await fetch(`${origin}/api/live`, { method: 'HEAD' });
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('');
  });
  it('rejects writes and does not intercept other paths', async () => {
    const response = await fetch(`${origin}/api/live`, { method: 'POST' });
    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('GET, HEAD');
    expect((await response.json()).status).toBe('error');
    expect((await fetch(`${origin}/api/live-extra`)).status).toBe(404);
  });
});
