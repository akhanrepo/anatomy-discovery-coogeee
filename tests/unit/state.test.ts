import { describe, it, expect } from 'vitest';
import { loadCorpus } from '../../src/lib/content/load';
import { stateAt, misbeliefPhase, activeMisbeliefs, indexByStructure, countKnown, type FogModel } from '../../src/lib/state';
import { buildFogModel } from '../../src/lib/model';

const c = loadCorpus();
const m: FogModel = buildFogModel(c);
const idx = indexByStructure(m);
const anchors = c.eras.map((e) => e.yearStart);

describe('F02 fog engine', () => {
  it('F02-AC1 stateAt is pure: same inputs, same output, no mutation', () => {
    const frozen = JSON.stringify(m);
    const a = stateAt('lungs', 1300, m, idx);
    const b = stateAt('lungs', 1300, m, idx);
    expect(a).toBe(b);
    expect(JSON.stringify(m)).toBe(frozen);
  });

  it('F02-AC1 hand-checked states at the anchor years', () => {
    const at = (s: string, y: number) => stateAt(s, y, m, idx);
    // c. 1600 BCE: the Edwin Smith Papyrus describes the brain and meninges
    expect(at('brain', -1600)).toBe('described');
    expect(at('meninges', -1600)).toBe('described');
    expect(at('lungs', -1600)).toBe('unknown');
    // c. 200: Galen understood arteries hold blood; the brain is seat of understanding (Alcmaeon)
    expect(at('arteries', 200)).toBe('understood');
    expect(at('brain', 200)).toBe('understood');
    expect(at('heart', 200)).toBe('unknown'); // Tab. IV is revised: myths never ink in
    // c. 1242: Ibn al-Nafis
    expect(at('lungs', 1242)).toBe('understood');
    expect(at('lungs', 1241)).toBe('unknown');
    // 1543: Vesalius describes the mandible
    expect(at('mandible', 1543)).toBe('described');
    // 1628: Harvey
    expect(at('heart', 1628)).toBe('understood');
    expect(at('venous-valves', 1627)).toBe('described'); // Fabricius 1603
    expect(at('venous-valves', 1628)).toBe('understood');
    // seen ≠ understood: pancreas
    expect(at('pancreas', 1869)).toBe('described');
    expect(at('pancreas', 1920)).toBe('described');
    expect(at('pancreas', 1921)).toBe('understood');
    // 1950: muscle described (Suśruta, Bichat) but not yet understood (1954)
    expect(at('skeletal-muscle', 1950)).toBe('described');
    expect(at('skeletal-muscle', 1954)).toBe('understood');
    // context organs without stories are outlined throughout
    expect(at('liver', -1600)).toBe('described');
    // Today = modern reference, fully inked
    for (const s of c.structures) expect(at(s.id, m.present)).toBe('understood');
  });

  it('F02-AC1 full matrix of every structure at every anchor (snapshot)', () => {
    const matrix = Object.fromEntries(c.structures.map((s) => [s.id, anchors.map((y) => ({ unknown: '·', described: 'd', understood: 'U' })[stateAt(s.id, y, m, idx)]).join('')]));
    expect(matrix).toMatchSnapshot();
  });

  it('counts known structures for the slider counter', () => {
    const storied = c.structures.filter((s) => idx.has(s.id)).map((s) => s.id);
    expect(countKnown(storied, -1600, m, idx)).toBeLessThan(countKnown(storied, 1700, m, idx));
  });
});

describe('F09 misbelief phases', () => {
  const sp = m.misbeliefs.find((x) => x.id === 'septal-pores')!;
  it('F09-AC2 erasure triggers exactly at each correction year (partial, then full)', () => {
    expect(misbeliefPhase(sp, 169)).toBe('hidden');
    expect(misbeliefPhase(sp, 170)).toBe('red');
    expect(misbeliefPhase(sp, 1241)).toBe('red');
    expect(misbeliefPhase(sp, 1242)).toBe('partial');
    expect(misbeliefPhase(sp, 1627)).toBe('partial');
    expect(misbeliefPhase(sp, 1628)).toBe('erased');
  });
  it('F09-AC2 every misbelief is fully erased by today', () => {
    const phases = activeMisbeliefs(m.present, m);
    expect(Object.values(phases).every((p) => p === 'erased')).toBe(true);
  });
});
