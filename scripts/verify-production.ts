import { readFile } from 'node:fs/promises';
import manifest from '../package.json' with { type: 'json' };
import { assertLiveResponse } from './lib/health.ts';

const origin = 'https://chamelo.hexly.ai';

function request(pathname: string): Promise<Response> {
  return fetch(new URL(pathname, origin), {
    headers: { 'Cache-Control': 'no-cache' },
    redirect: 'error',
    signal: AbortSignal.timeout(15_000),
  });
}

async function main() {
  const expectedIndex = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  const [live, page] = await Promise.all([request('/api/live'), request('/')]);
  assertLiveResponse(live, await live.json(), manifest.version);
  if (page.status !== 200 || !page.headers.get('content-type')?.includes('text/html')) {
    throw new Error('The production page did not return HTML with HTTP 200.');
  }
  if ((await page.text()).trim() !== expectedIndex.trim()) {
    throw new Error('The deployed page differs from the proven local build.');
  }
  const entry = expectedIndex.match(/src="(\/assets\/[^"<>]+\.js)"/)?.[1];
  if (!entry) throw new Error('The build has no same-origin JavaScript entry.');
  const asset = await request(entry);
  if (asset.status !== 200) throw new Error('The production JavaScript entry is unavailable.');
  const expectedScript = await readFile(new URL(`../dist${entry}`, import.meta.url));
  if (!expectedScript.equals(Buffer.from(await asset.arrayBuffer()))) {
    throw new Error('The deployed JavaScript differs from the proven local build.');
  }
  console.log(`线上核验通过：Chamelo v${manifest.version}，健康接口、页面与脚本均匹配本次构建。`);
}

try {
  await main();
} catch (error) {
  console.error(`线上核验失败：${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
