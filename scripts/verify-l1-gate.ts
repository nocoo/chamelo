import { execFileSync, spawnSync } from 'node:child_process';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const repo = resolve(import.meta.dirname, '..');
const owned = mkdtempSync(join(tmpdir(), 'chamelo-l1-verify-'));
let failed = 0;

const sampleSource = `export function negate(value: number): number {
  return value < 0 ? -value : value;
}
`;
const passingTest = `import { expect, it } from 'vitest';
import { negate } from './sample';

it('negates negative numbers', () => {
  expect(negate(-2)).toBe(2);
  expect(negate(0)).toBe(0);
  expect(negate(3)).toBe(3);
});
`;
const vitestConfig = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['sample.test.ts'],
    allowOnly: false,
    coverage: {
      provider: 'v8',
      include: ['sample.ts'],
      reporter: ['text', 'json-summary'],
      thresholds: { statements: 95, branches: 95, functions: 95, lines: 95 },
    },
  },
});
`;

function check(name: string, ok: boolean, detail = ''): void {
  const text = detail.replace(/\s+/g, ' ').trim().slice(0, 240);
  console.log(`${ok ? 'ok' : 'FAIL'} ${name}${text ? `: ${text}` : ''}`);
  if (!ok) failed = 1;
}

function runGit(args: string[], cwd: string): string {
  return execFileSync('git', args, { cwd, encoding: 'utf8' });
}

function snapshotPrefix(scratch: string): boolean {
  return readdirSync(scratch).some((name) => name.startsWith('chamelo-index.'));
}

type FixtureExtra = {
  vitestConfig?: string;
  source?: string;
  uncovered?: string;
  test?: string;
  skipTest?: boolean;
  weakenedCheck?: boolean;
};

function fixture(name: string, extra: FixtureExtra = {}): string {
  const dir = join(owned, name);
  mkdirSync(join(dir, 'scripts'), { recursive: true });
  mkdirSync(join(dir, '.husky'), { recursive: true });
  runGit(['init', '-q', '-b', 'main'], dir);
  writeFileSync(join(dir, '.husky/pre-commit'), readFileSync(join(repo, '.husky/pre-commit')));
  chmodSync(join(dir, '.husky/pre-commit'), 0o755);
  writeFileSync(
    join(dir, 'scripts/unit-coverage-gate.ts'),
    readFileSync(join(repo, 'scripts/unit-coverage-gate.ts')),
  );
  writeFileSync(
    join(dir, 'package.json'),
    `${JSON.stringify(
      {
        type: 'module',
        scripts: {
          lint: 'biome check --error-on-warnings .',
          typecheck: 'tsc --noEmit',
          'test:coverage': 'bun scripts/unit-coverage-gate.ts',
          check:
            extra.weakenedCheck === true
              ? 'biome check --error-on-warnings .'
              : 'bun run lint && bun run typecheck && bun run test:coverage',
        },
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    join(dir, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          strict: true,
          noEmit: true,
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          skipLibCheck: true,
        },
        include: ['sample.ts', 'sample.test.ts'],
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    join(dir, 'biome.json'),
    `${JSON.stringify(
      {
        files: { includes: ['sample.ts', 'sample.test.ts'] },
        formatter: { enabled: false },
        assist: { enabled: false },
        linter: {
          enabled: true,
          rules: { preset: 'recommended', suspicious: { noDebugger: 'error' } },
        },
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(join(dir, 'vite.config.ts'), extra.vitestConfig ?? vitestConfig);
  writeFileSync(join(dir, 'sample.ts'), extra.source ?? sampleSource);
  if (extra.uncovered) {
    writeFileSync(join(dir, 'gap.ts'), extra.uncovered);
  }
  if (!extra.skipTest) {
    writeFileSync(join(dir, 'sample.test.ts'), extra.test ?? passingTest);
  }
  writeFileSync(join(dir, '.gitignore'), 'node_modules\ncoverage\n');
  symlinkSync(join(repo, 'node_modules'), join(dir, 'node_modules'));
  runGit(
    [
      'add',
      '--',
      '.gitignore',
      'package.json',
      'biome.json',
      'tsconfig.json',
      'vite.config.ts',
      'sample.ts',
      'scripts',
      '.husky',
      ...(extra.uncovered ? ['gap.ts'] : []),
      ...(extra.skipTest ? [] : ['sample.test.ts']),
    ],
    dir,
  );
  return dir;
}

function scratchOf(dir: string): string {
  const scratch = join(dir, '.tmp');
  mkdirSync(scratch, { recursive: true });
  return scratch;
}

function runHook(
  dir: string,
  env: NodeJS.ProcessEnv = process.env,
): {
  status: number | null;
  output: string;
  snapshotLeftover: boolean;
} {
  const scratch = scratchOf(dir);
  const result = spawnSync('sh', ['.husky/pre-commit'], {
    cwd: dir,
    env: { ...process.env, TMPDIR: scratch, ...env },
    encoding: 'utf8',
    timeout: 180_000,
  });
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  return {
    status: result.status,
    output,
    snapshotLeftover: existsSync(scratch) && snapshotPrefix(scratch),
  };
}

function stage(dir: string, ...paths: string[]): void {
  runGit(['add', '--', ...paths], dir);
}

try {
  const healthy = runHook(fixture('healthy'));
  check('healthy pre-commit exits 0', healthy.status === 0, healthy.output);
  check('healthy snapshot removed', !healthy.snapshotLeftover, String(healthy.snapshotLeftover));

  const utDir = fixture('ut-failure');
  const failingTest = passingTest.replace('toBe(2)', 'toBe(9)');
  writeFileSync(join(utDir, 'sample.test.ts'), failingTest);
  stage(utDir, 'sample.test.ts');
  writeFileSync(join(utDir, 'sample.test.ts'), passingTest);
  const ut = runHook(utDir);
  check(
    'staged UT failure rejects',
    ut.status !== 0 && /FAIL|AssertionError|expected/i.test(ut.output),
    ut.output,
  );
  check(
    'UT keeps unstaged fix on disk',
    readFileSync(join(utDir, 'sample.test.ts'), 'utf8') === passingTest,
  );

  const coverageDir = fixture('coverage-shortfall', {
    uncovered: `export function orphan(): number {
  return 41;
}
`,
    vitestConfig: vitestConfig.replace(
      "include: ['sample.ts']",
      "include: ['sample.ts', 'gap.ts']",
    ),
  });
  const coverage = runHook(coverageDir);
  check(
    'coverage shortfall rejects',
    coverage.status !== 0 && /threshold|below|Coverage/i.test(coverage.output),
    coverage.output,
  );

  for (const metric of ['statements', 'branches', 'functions', 'lines'] as const) {
    const metricDir = fixture(`coverage-${metric}`, {
      vitestConfig: vitestConfig.replace(`${metric}: 95`, `${metric}: 101`),
    });
    const metricResult = runHook(metricDir);
    check(
      `coverage metric ${metric} rejects`,
      metricResult.status !== 0 && /threshold|Coverage/i.test(metricResult.output),
      metricResult.output,
    );
  }

  const lintDir = fixture('lint-error');
  writeFileSync(join(lintDir, 'sample.ts'), `${sampleSource}debugger;\n`);
  stage(lintDir, 'sample.ts');
  const lint = runHook(lintDir);
  check('lint error rejects', lint.status !== 0 && lint.output.includes('noDebugger'), lint.output);

  const warnDir = fixture('lint-warning');
  writeFileSync(
    join(warnDir, 'biome.json'),
    readFileSync(join(warnDir, 'biome.json'), 'utf8').replace('"error"', '"warn"'),
  );
  writeFileSync(join(warnDir, 'sample.ts'), `${sampleSource}debugger;\n`);
  stage(warnDir, 'sample.ts', 'biome.json');
  const warn = runHook(warnDir);
  check(
    'lint warning rejects with --error-on-warnings',
    warn.status !== 0 && warn.output.includes('noDebugger'),
    warn.output,
  );

  const typeDir = fixture('type-error');
  writeFileSync(join(typeDir, 'sample.ts'), `${sampleSource}export const broken: string = 1;\n`);
  stage(typeDir, 'sample.ts');
  const type = runHook(typeDir);
  check(
    'type error rejects',
    type.status !== 0 && /TS\d+|error TS/i.test(type.output),
    type.output,
  );

  const onlyDir = fixture('test-only');
  writeFileSync(join(onlyDir, 'sample.test.ts'), passingTest.replace('it(', 'it.only('));
  stage(onlyDir, 'sample.test.ts');
  const only = runHook(onlyDir);
  check(
    'test.only rejects',
    only.status !== 0 && /forbidden|only|FAIL/i.test(only.output),
    only.output,
  );

  const skipDir = fixture('test-skip');
  writeFileSync(join(skipDir, 'sample.test.ts'), passingTest.replace('it(', 'it.skip('));
  stage(skipDir, 'sample.test.ts');
  const skip = runHook(skipDir);
  check(
    'test.skip rejects',
    skip.status !== 0 && /skipped|pending|Refusing/i.test(skip.output),
    skip.output,
  );

  const stagedDir = fixture('staged-bad-unstaged-good');
  writeFileSync(join(stagedDir, 'sample.test.ts'), passingTest.replace('toBe(2)', 'toBe(9)'));
  stage(stagedDir, 'sample.test.ts');
  writeFileSync(join(stagedDir, 'sample.test.ts'), passingTest);
  const staged = runHook(stagedDir);
  check('staged failure with unstaged fix rejects', staged.status !== 0, staged.output);

  const timeoutDir = fixture('timeout');
  writeFileSync(
    join(timeoutDir, 'package.json'),
    readFileSync(join(timeoutDir, 'package.json'), 'utf8').replace(
      'biome check --error-on-warnings .',
      'node -e "setInterval(() => {}, 250)"',
    ),
  );
  stage(timeoutDir, 'package.json');
  const timed = runHook(timeoutDir);
  check('timeout rejects', timed.status === 124 || timed.status === 1, `status=${timed.status}`);
  check('timeout cleans snapshot', !timed.snapshotLeftover, String(timed.snapshotLeftover));

  const missingBin = join(owned, 'minimal-path');
  mkdirSync(missingBin, { recursive: true });
  symlinkSync(process.execPath, join(missingBin, 'node'));
  symlinkSync(execFileSync('which', ['git'], { encoding: 'utf8' }).trim(), join(missingBin, 'git'));
  const missingDir = fixture('missing-bun');
  const missing = runHook(missingDir, { PATH: `${missingBin}:/usr/bin:/bin` });
  check('missing bun rejects', missing.status === 127, `status=${missing.status ?? 'null'}`);
  check(
    'missing tool cleans snapshot',
    !missing.snapshotLeftover,
    String(missing.snapshotLeftover),
  );

  const reportDir = fixture('missing-coverage-report', {
    vitestConfig: vitestConfig.replace("'text', 'json-summary'", "'text'"),
  });
  const report = runHook(reportDir);
  check(
    'missing coverage summary rejects',
    report.status !== 0 && /Missing coverage/i.test(report.output),
    report.output,
  );

  const bypassDir = fixture('check-bypass', { weakenedCheck: true });
  const bypass = runHook(bypassDir);
  check('hook ignores weakened package check script', bypass.status === 0, bypass.output);
} finally {
  rmSync(owned, { recursive: true, force: true });
}

if (failed) {
  process.exit(failed);
}
console.log('L1 pre-commit gate proof passed');
