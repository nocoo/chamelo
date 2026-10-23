import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import manifest from './package.json' with { type: 'json' };
import { siteMetadata } from './scripts/site-metadata.ts';

export default defineConfig({
  plugins: [react(), siteMetadata(manifest.version)],
  server: {
    host: '127.0.0.1',
    port: 7061,
    strictPort: true,
    allowedHosts: ['chamelo.dev.hexly.ai'],
  },
  preview: {
    host: '127.0.0.1',
    port: 7061,
    strictPort: true,
    allowedHosts: ['chamelo.dev.hexly.ai'],
  },
  build: { target: 'es2022' },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/services/**/*.ts', 'src/viewmodels/**/*.ts', 'scripts/lib/**/*.ts'],
      reporter: ['text', 'json-summary'],
      thresholds: { statements: 95, branches: 95, functions: 95, lines: 95 },
    },
  },
});
