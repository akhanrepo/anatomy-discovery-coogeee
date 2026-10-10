import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Every acceptance criterion in docs/features must be named in at least one test title.
const FEATURES = 'docs/features';
const TEST_DIRS = ['tests/unit', 'tests/e2e', 'tests/perf'];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const acIds = readdirSync(FEATURES)
  .filter((f) => /^F\d\d-.*\.md$/.test(f))
  .flatMap((f) => [...readFileSync(join(FEATURES, f), 'utf8').matchAll(/\*\*(F\d\d-AC\d+)\*\*/g)].map((m) => m[1]));

// Features become strict once docs/PLAN.md marks their step as in progress (🔨) or done (✅).
const plan = readFileSync('docs/PLAN.md', 'utf8');
const activeFeatures = new Set(
  plan
    .split('\n')
    .filter((l) => /^\|\s*\d+\s*\|/.test(l) && /(✅|🔨)/.test(l))
    .flatMap((l) => [...l.matchAll(/\bF\d\d\b/g)].map((m) => m[0])),
);

const testSource = TEST_DIRS.flatMap(walk)
  .filter((f) => /\.(test|spec)\.ts$/.test(f) && !f.endsWith('traceability.test.ts'))
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n');

describe('acceptance-criteria traceability', () => {
  it('finds acceptance criteria in the briefs', () => {
    expect(acIds.length).toBeGreaterThan(60);
  });

  it('maps every acceptance criterion of active features to at least one test', () => {
    const missing = acIds.filter((id) => activeFeatures.has(id.slice(0, 3))).filter((id) => !new RegExp(`['"\`]${id}\\b`).test(testSource));
    expect(missing, `criteria without a test: ${missing.join(', ')}`).toEqual([]);
  });

  it('has no skipped tests that cover acceptance criteria', () => {
    const skipped = [...testSource.matchAll(/\b(?:it|test|describe)\.(?:skip|todo)\(\s*['"`](F\d\d-AC\d+)/g)].map((m) => m[1]);
    expect(skipped).toEqual([]);
  });
});
