import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const vitestReport = resolve(root, 'coverage/vitest-l1.json');
const summaryPath = resolve(root, 'coverage/coverage-summary.json');
const metrics = ['lines', 'statements', 'functions', 'branches'] as const;
const minimum = 95;

function runVitest(): void {
  const result = spawnSync(
    'bun',
    [
      'vitest',
      'run',
      '--coverage',
      '--reporter=default',
      '--reporter=json',
      `--outputFile=${vitestReport}`,
    ],
    { cwd: root, stdio: 'inherit' },
  );
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function assertReport(): void {
  if (!existsSync(vitestReport)) {
    console.error('Missing vitest JSON report after coverage run.');
    process.exit(1);
  }
  const report = JSON.parse(readFileSync(vitestReport, 'utf8')) as {
    success?: boolean;
    numTotalTests?: number;
    numPendingTests?: number;
  };
  if (!report.success) {
    process.exit(1);
  }
  if (!report.numTotalTests) {
    console.error('Refusing empty unit test suite.');
    process.exit(1);
  }
  if ((report.numPendingTests ?? 0) > 0) {
    console.error(`Refusing skipped or pending tests (${report.numPendingTests}).`);
    process.exit(1);
  }
}

function assertCoverage(): void {
  if (!existsSync(summaryPath)) {
    console.error('Missing coverage/coverage-summary.json.');
    process.exit(1);
  }
  const total = JSON.parse(readFileSync(summaryPath, 'utf8')).total as Record<
    string,
    { pct?: number }
  >;
  for (const metric of metrics) {
    const pct = total[metric]?.pct;
    if (typeof pct !== 'number' || pct < minimum) {
      console.error(`Coverage ${metric} ${pct ?? 'missing'}% is below ${minimum}%.`);
      process.exit(1);
    }
  }
}

try {
  runVitest();
  assertReport();
  assertCoverage();
} finally {
  rmSync(vitestReport, { force: true });
}
