import { describe, it, expect } from 'vitest';
import { loadCorpus } from '../../src/lib/content/load';
import { runGates, sourceIdOf, locatorOf } from '../../src/lib/content/gates';
import { LICENCES } from '../../src/lib/content/schema';

const c = loadCorpus();
const src = new Map(c.sources.map((s) => [s.id, s]));

describe('F10 traditions lens', () => {
  it('F10-AC1 each lens has ≥ 6 concepts, every claim with a scholarly source and a locator, all verified', () => {
    for (const t of c.traditions) {
      expect(t.concepts.length, t.id).toBeGreaterThanOrEqual(6);
      for (const k of t.concepts) for (const cl of Object.values(k.claims))
        expect(cl.citations.some((r) => src.get(sourceIdOf(r))?.scholarly && locatorOf(r)), `${k.id}: ${cl.text}`).toBe(true);
    }
    expect(runGates(c).filter((e) => /lens|verification/.test(e.gate))).toEqual([]);
  });
  it('F10-AC2 every concept states its relation to modern anatomy (including "none")', () => {
    for (const k of c.traditions.flatMap((t) => t.concepts)) {
      expect(k.relatesTo.length, k.id).toBeGreaterThan(0);
      for (const r of k.relatesTo) expect(['corresponds', 'partially', 'none']).toContain(r.relation);
    }
  });
  it('F10-AC3 no lens displays an original plate unless its licence is verified and allowed', () => {
    for (const t of c.traditions) {
      const plate = c.assets.find((a) => a.id === t.plateAsset)!;
      expect(plate.kind, t.id).toBe('generated'); // what is always shown is our own schematic
      const orig = t.originalAsset ? c.assets.find((a) => a.id === t.originalAsset) : undefined;
      if (orig?.file) {
        expect(orig.licenceVerified, `${orig.id} has a file but no verified licence`).toBe(true);
        expect((LICENCES as readonly string[]).includes(orig.licence)).toBe(true);
      }
    }
  });
});
