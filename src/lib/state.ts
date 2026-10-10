/** F02 fog engine: pure functions over a compact model (also shipped to the browser). */
export type InkState = 'unknown' | 'described' | 'understood';
export type MisbeliefPhase = 'hidden' | 'red' | 'partial' | 'erased';

export interface FogDiscovery { id: string; yearStart: number; kind: string; status: string; structures: string[] }
export interface FogMisbelief { id: string; yearStart: number; corrections: { year: number; scope: 'first' | 'mainstream' }[] }
export interface FogModel { discoveries: FogDiscovery[]; misbeliefs: FogMisbelief[]; present: number }

const UNDERSTANDING = new Set(['function', 'molecular']);

/** Index of structure → discoveries (non-revised), sorted by year. Build once, reuse per frame. */
export function indexByStructure(m: FogModel): Map<string, FogDiscovery[]> {
  const idx = new Map<string, FogDiscovery[]>();
  for (const d of m.discoveries) {
    if (d.status === 'revised') continue; // myths never ink anything in
    for (const s of d.structures) {
      if (!idx.has(s)) idx.set(s, []);
      idx.get(s)!.push(d);
    }
  }
  for (const list of idx.values()) list.sort((a, b) => a.yearStart - b.yearStart);
  return idx;
}

export function stateAt(structure: string, year: number, m: FogModel, idx = indexByStructure(m)): InkState {
  if (year >= m.present) return 'understood';
  const ds = idx.get(structure);
  if (!ds || ds.length === 0) return 'described'; // context organ without a story: outline throughout
  let state: InkState = 'unknown';
  for (const d of ds) {
    if (d.yearStart > year) break;
    if (UNDERSTANDING.has(d.kind)) return 'understood';
    state = 'described';
  }
  return state;
}

export function misbeliefPhase(mb: FogMisbelief, year: number): MisbeliefPhase {
  if (year < mb.yearStart) return 'hidden';
  const mainstream = mb.corrections.filter((c) => c.scope === 'mainstream').map((c) => c.year);
  const first = mb.corrections.filter((c) => c.scope === 'first').map((c) => c.year);
  if (mainstream.length && year >= Math.min(...mainstream)) return 'erased';
  if (first.length && year >= Math.min(...first)) return 'partial';
  return 'red';
}

export function activeMisbeliefs(year: number, m: FogModel): Record<string, MisbeliefPhase> {
  return Object.fromEntries(m.misbeliefs.map((mb) => [mb.id, misbeliefPhase(mb, year)]));
}

export function countKnown(structures: string[], year: number, m: FogModel, idx = indexByStructure(m)): number {
  return structures.filter((s) => idx.has(s) && stateAt(s, year, m, idx) !== 'unknown').length;
}
