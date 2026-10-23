import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
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
      include: ['src/services/**/*.ts', 'src/viewmodels/**/*.ts'],
      reporter: ['text', 'json-summary'],
      thresholds: { statements: 95, branches: 95, functions: 95, lines: 95 },
    },
  },
});
