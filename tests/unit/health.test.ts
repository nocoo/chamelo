import { describe, expect, it } from 'vitest';
import { assertLiveResponse } from '../../scripts/lib/health';

const version = '0.2.1';
const payload = { status: 'ok', name: 'chamelo', version };
const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };

describe('production health contract', () => {
  it('accepts the exact release version and uncached JSON', () => {
    expect(() =>
      assertLiveResponse(new Response(null, { headers }), payload, version),
    ).not.toThrow();
  });

  it('accepts case-insensitive content type and multiple cache directives', () => {
    const response = new Response(null, {
      headers: { 'Content-Type': 'Application/JSON', 'Cache-Control': 'max-age=0, No-Store' },
    });
    expect(() => assertLiveResponse(response, payload, version)).not.toThrow();
  });

  it('rejects unsuccessful HTTP responses', () => {
    expect(() =>
      assertLiveResponse(new Response(null, { status: 503, headers }), payload, version),
    ).toThrow('HTTP 200');
  });

  it.each(['text/html', 'application/jsonp', ''])('rejects incorrect content types: %s', (type) => {
    const response = new Response(null, { headers: { ...headers, 'Content-Type': type } });
    expect(() => assertLiveResponse(response, payload, version)).toThrow('application/json');
  });

  it('rejects a missing content type', () => {
    expect(() => assertLiveResponse(new Response(null), payload, version)).toThrow(
      'application/json',
    );
  });

  it.each(['max-age=3600', 'no-cache', ''])('rejects cacheable health responses: %s', (cache) => {
    const response = new Response(null, { headers: { ...headers, 'Cache-Control': cache } });
    expect(() => assertLiveResponse(response, payload, version)).toThrow('no-store');
  });

  it('rejects a missing cache policy', () => {
    const response = new Response(null, { headers: { 'Content-Type': 'application/json' } });
    expect(() => assertLiveResponse(response, payload, version)).toThrow('no-store');
  });

  it.each([null, [], 'ok', 1])('rejects non-object payloads: %s', (body) => {
    expect(() => assertLiveResponse(new Response(null, { headers }), body, version)).toThrow(
      'JSON object',
    );
  });

  it.each([
    {},
    { ...payload, status: 'error' },
    { ...payload, name: 'another-app' },
    { ...payload, version: '0.1.0' },
  ])('rejects incorrect product or version metadata: %j', (body) => {
    expect(() => assertLiveResponse(new Response(null, { headers }), body, version)).toThrow(
      'Chamelo v0.2.1',
    );
  });
});
