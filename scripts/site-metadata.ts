import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Connect, Plugin } from 'vite';
import { parseVersion } from './lib/versioning.ts';

export function liveMiddleware(body: string): Connect.NextHandleFunction {
  return (request, response, next) => {
    if (request.url?.split('?')[0] !== '/api/live') return next();
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.statusCode = 405;
      response.setHeader('Allow', 'GET, HEAD');
      response.end(JSON.stringify({ status: 'error', error: 'method_not_allowed' }));
      return;
    }
    response.end(request.method === 'HEAD' ? undefined : body);
  };
}

export function siteMetadata(version: string): Plugin {
  parseVersion(version);
  const body = `${JSON.stringify({ status: 'ok', version, name: 'chamelo' })}\n`;
  return {
    name: 'chamelo-site-metadata',
    config: () => ({ define: { __APP_VERSION__: JSON.stringify(version) } }),
    configureServer(server) {
      server.middlewares.use(liveMiddleware(body));
    },
    configurePreviewServer(server) {
      const artifact = readFileSync(
        resolve(server.config.root, server.config.build.outDir, 'api/live'),
        'utf8',
      );
      server.middlewares.use(liveMiddleware(artifact));
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'api/live', source: body });
    },
  };
}
