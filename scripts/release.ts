import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { nextVersion, versionPattern } from './lib/versioning.ts';

const root = resolve(import.meta.dirname, '..');
process.chdir(root);

function run(command: string, args: string[], inherit = false): string {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: inherit ? 'inherit' : 'pipe',
    timeout: 180_000,
  });
  if (result.error || result.status !== 0) {
    throw new Error(
      result.error?.message || result.stderr?.trim() || `${command} ${args.join(' ')} failed`,
    );
  }
  return result.stdout?.trim() ?? '';
}

function main() {
  const args = process.argv.slice(2).filter((argument) => argument !== '--');
  if (args.includes('--help')) {
    console.log('用法：bun run release -- [patch|minor|major|X.Y.Z] [--dry-run]');
    console.log('仅准备本地版本与提交；不推送、不打标签、不发布或部署。');
    return;
  }
  const dryRun = args.includes('--dry-run');
  const selections = args.filter((argument) => argument !== '--dry-run');
  if (selections.length > 1) throw new Error('Specify only one version or increment.');
  const requested = selections[0] ?? 'auto';
  const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
  const baseline = run('git', [
    'log',
    '-1',
    '--format=%H',
    '-G',
    '^  "version":',
    '--',
    'package.json',
  ]);
  if (!baseline)
    throw new Error('Commit the initial authoritative version before preparing a release.');
  const baselineDate = run('git', ['show', '-s', '--format=%cI', baseline]);
  const changedLines = run('git', ['diff', '--numstat', baseline])
    .split('\n')
    .reduce((total, line) => {
      const [added, removed] = line.split('\t');
      return total + (Number(added) || 0) + (Number(removed) || 0);
    }, 0);
  const messages = run('git', ['log', `${baseline}..HEAD`, '--format=%B']);
  const plan = nextVersion(manifest.version, requested, {
    elapsedDays: (Date.now() - Date.parse(baselineDate)) / 86_400_000,
    changedLines,
    breaking: /^(?:\w+(?:\([^\n]+\))?!:|BREAKING[ -]CHANGE:)/m.test(messages),
  });
  const dirty = run('git', ['status', '--porcelain']);
  console.log(`版本：v${manifest.version} → v${plan.version}`);
  console.log(`比较基线：${baseline} (${baselineDate})`);
  console.log(`判定依据：${plan.reason}`);
  if (dryRun) {
    if (dirty) console.log('工作区尚有改动；未跟踪文件不计入行数，请提交后再次预演。');
    console.log('预演完成，未修改任何文件或执行外部发布。');
    return;
  }
  if (dirty) throw new Error('Release preparation requires a clean working tree and index.');
  if (run('git', ['branch', '--show-current']) !== 'main')
    throw new Error('Prepare releases on local main.');

  const tag = run('git', ['tag', '--merged', 'HEAD', '--sort=-version:refname'])
    .split('\n')
    .find((candidate) => candidate.startsWith('v') && versionPattern.test(candidate.slice(1)));
  const commits = run('git', ['log', tag ? `${tag}..HEAD` : 'HEAD', '--format=%h %s']);
  if (!commits) throw new Error('No new commits to release.');
  const previous = readFileSync('CHANGELOG.md', 'utf8')
    .replace(/^# Changelog\s*/, '')
    .split(/(?=^## )/m)
    .filter((section) => !section.startsWith('## Unreleased'))
    .join('')
    .trim();
  const entry = `## v${plan.version} - ${new Date().toISOString().slice(0, 10)}\n\n${commits
    .split('\n')
    .map((commit) => `- ${commit}`)
    .join('\n')}`;
  writeFileSync(
    'package.json',
    `${JSON.stringify({ ...manifest, version: plan.version }, null, 2)}\n`,
  );
  writeFileSync('CHANGELOG.md', `# Changelog\n\n${entry}\n${previous ? `\n${previous}\n` : ''}`);
  run('bun', ['install', '--offline', '--lockfile-only', '--ignore-scripts'], true);
  if (/", "https/.test(readFileSync('bun.lock', 'utf8'))) {
    throw new Error('Remove registry mirror resolution URLs from bun.lock before committing.');
  }
  run('bun', ['run', 'check'], true);
  run('bun', ['run', 'build'], true);
  run('git', ['add', '--', 'package.json', 'bun.lock', 'CHANGELOG.md'], true);
  run('git', ['commit', '-m', `chore: prepare v${plan.version} release`], true);
  console.log(`本地版本 v${plan.version} 已准备。未推送、打标签、发布或部署。`);
  console.log('继续发布时遵循 docs/releasing.md，核验准确提交的 CI 与线上版本。');
}

try {
  main();
} catch (error) {
  console.error(`版本准备停止：${error instanceof Error ? error.message : String(error)}`);
  console.error('未自动撤销文件；请保留现场并检查失败步骤。');
  process.exitCode = 1;
}
