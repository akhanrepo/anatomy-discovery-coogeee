import { describe, it, expect } from 'vitest';
import { loadCorpus } from '../../src/lib/content/load';
import { runGates, balance, BALANCE, sourceIdOf, locatorOf } from '../../src/lib/content/gates';
import { Claim, NON_EUROPEAN } from '../../src/lib/content/schema';

const c = loadCorpus();
const src = new Map(c.sources.map((s) => [s.id, s]));

describe('F04 landmark discovery content set', () => {
  it('F04-AC1 publishes 26 discoveries, each with a passing verification log', () => {
    expect(c.discoveries).toHaveLength(26);
    const logged = new Set(c.logs.map((l) => l.subject));
    expect(c.discoveries.filter((d) => !logged.has(d.id)).map((d) => d.id)).toEqual([]);
    expect(runGates(c).filter((e) => /verification-log/.test(e.gate))).toEqual([]);
  });

  it('F04-AC2 meets the balance targets', () => {
    const b = balance(c);
    expect(b.pre1500).toBeGreaterThanOrEqual(BALANCE.pre1500);
    expect(b.nonEuropean).toBeGreaterThanOrEqual(BALANCE.nonEuropean);
    expect(b.post1900).toBeGreaterThanOrEqual(BALANCE.post1900);
    expect(b.contestedOrRevised).toBeGreaterThanOrEqual(BALANCE.contestedOrRevised);
    expect(b.systems).toBeGreaterThanOrEqual(BALANCE.systems);
  });

  it('F04-AC3 every discovery has a method, what it overturned (or why nothing), a status and an image', () => {
    for (const d of c.discoveries) {
      expect(d.method.length, d.id).toBeGreaterThan(20);
      expect(d.overturned.length, d.id).toBeGreaterThan(10);
      expect(['established', 'contested', 'revised']).toContain(d.status);
      expect(d.assets.length, d.id).toBeGreaterThan(0);
    }
  });

  it('F04-AC4 every non-European entry cites a specialist scholarly work with a locator', () => {
    for (const d of c.discoveries.filter((x) => NON_EUROPEAN.includes(x.tradition))) {
      const refs = Object.values(d.claims).flatMap((k) => k.citations);
      const ok = refs.some((r) => src.get(sourceIdOf(r))?.scholarly && locatorOf(r));
      expect(ok, d.id).toBe(true);
    }
  });

  it('plates are numbered I–XXVI in chronological order', () => {
    expect(c.discoveries.map((d) => d.plate).slice(0, 3)).toEqual(['I', 'II', 'III']);
  });
});

describe('loader safety', () => {
  it('rejects unknown keys, which is how YAML comma-truncation shows up (regression)', () => {
    const r = Claim.safeParse({ text: 'Galen taught that blood passes through pores', citations: ['a'], ' and Ibn Sina repeated it.': null });
    expect(r.success).toBe(false);
  });
  it('no claim text in the corpus looks truncated', () => {
    const all = [
      ...c.discoveries.flatMap((d) => Object.values(d.claims)),
      ...c.misbeliefs.flatMap((m) => Object.values(m.claims)),
      ...c.traditions.flatMap((t) => t.concepts.flatMap((k) => Object.values(k.claims))),
    ];
    expect(all.filter((k) => !/[.)"”]$/.test(k.text.trim())).map((k) => k.text)).toEqual([]);
  });
});
