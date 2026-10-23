import { describe, expect, it } from 'vitest';
import { nextVersion, parseVersion } from '../../scripts/lib/versioning';

const context = { elapsedDays: 1, changedLines: 100, breaking: false };

describe('authoritative X.Y.Z versions', () => {
  it('parses stable versions and rejects malformed or unsafe values', () => {
    expect(parseVersion('1.2.3')).toEqual([1, 2, 3]);
    for (const value of ['v1.2.3', '01.2.3', '1.2', '1.2.3-beta', '9007199254740992.0.0']) {
      expect(() => parseVersion(value)).toThrow();
    }
  });

  it.each([
    ['patch', '1.2.4'],
    ['minor', '1.3.0'],
    ['major', '2.0.0'],
    ['1.2.5', '1.2.5'],
    ['2.1.0', '2.1.0'],
  ])('honors %s', (request, expected) => {
    expect(nextVersion('1.2.3', request, context).version).toBe(expected);
  });

  it('uses the exact system0 default thresholds', () => {
    expect(
      nextVersion('1.2.3', 'auto', { ...context, elapsedDays: 3, changedLines: 500 }).version,
    ).toBe('1.2.4');
    expect(nextVersion('1.2.3', 'auto', { ...context, elapsedDays: 3.01 }).version).toBe('1.3.0');
    expect(nextVersion('1.2.3', 'auto', { ...context, changedLines: 501 }).version).toBe('1.3.0');
    expect(nextVersion('1.2.3', 'patch', { ...context, changedLines: 501 }).version).toBe('1.2.4');
  });

  it('requires a major version for declared breaking changes', () => {
    expect(nextVersion('1.2.3', 'auto', { ...context, breaking: true }).version).toBe('2.0.0');
    expect(() => nextVersion('1.2.3', 'minor', { ...context, breaking: true })).toThrow('major');
  });

  it('rejects same, lower, invalid, and overflowing versions', () => {
    for (const request of ['1.2.3', '1.2.2', '1.1.9', '0.9.9', 'unknown']) {
      expect(() => nextVersion('1.2.3', request, context)).toThrow();
    }
    expect(() => nextVersion('9007199254740991.0.0', 'major', context)).toThrow();
  });
});
