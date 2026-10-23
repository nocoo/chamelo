export const versionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export function parseVersion(version: string): [number, number, number] {
  if (!versionPattern.test(version)) throw new Error(`Invalid X.Y.Z version: ${version}`);
  const parts = version.split('.').map(Number);
  if (!parts.every(Number.isSafeInteger)) throw new Error('Version exceeds safe integer limits.');
  return parts as [number, number, number];
}

export function nextVersion(
  current: string,
  requested: string,
  context: { elapsedDays: number; changedLines: number; breaking: boolean },
): { version: string; reason: string } {
  const [major, minor, patch] = parseVersion(current);
  let increment = requested;
  let reason = `explicit ${requested}`;
  if (requested === 'auto') {
    increment = context.breaking
      ? 'major'
      : context.elapsedDays > 3 || context.changedLines > 500
        ? 'minor'
        : 'patch';
    reason = context.breaking
      ? 'breaking change'
      : `${context.elapsedDays.toFixed(2)} days, ${context.changedLines} changed lines`;
  }

  let next: [number, number, number];
  switch (increment) {
    case 'major':
      next = [major + 1, 0, 0];
      break;
    case 'minor':
      next = [major, minor + 1, 0];
      break;
    case 'patch':
      next = [major, minor, patch + 1];
      break;
    default:
      next = parseVersion(increment);
  }
  const version = next.join('.');
  parseVersion(version);
  const newer =
    next[0] > major ||
    (next[0] === major && (next[1] > minor || (next[1] === minor && next[2] > patch)));
  if (!newer) throw new Error('The next version must be greater than the current version.');
  if (context.breaking && next[0] <= major)
    throw new Error('Breaking changes require a major version.');
  return { version, reason };
}
