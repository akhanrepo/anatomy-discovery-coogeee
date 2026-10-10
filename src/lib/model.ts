import type { Corpus } from './content/schema';
import type { FogModel } from './state';

/** The present year for the "Today" anchor: the later of the content's Today era and the build date. */
export function presentYear(c: Corpus): number {
  const today = c.eras.find((e) => e.id === 'today')?.yearStart ?? new Date().getFullYear();
  return Math.max(today, new Date().getFullYear());
}

/** Minimal model for the fog engine; shipped to the browser as JSON. */
export function buildFogModel(c: Corpus): FogModel {
  return {
    present: presentYear(c),
    discoveries: c.discoveries.map((d) => ({ id: d.id, yearStart: d.yearStart, kind: d.kind, status: d.status, structures: d.structures })),
    misbeliefs: c.misbeliefs.map((m) => ({ id: m.id, yearStart: m.yearStart, corrections: m.corrections.map((k) => ({ year: k.year, scope: k.scope })) })),
  };
}

/** Everything the browser controller needs beyond the server-rendered DOM. Kept small on purpose. */
export function buildClientModel(c: Corpus) {
  const fog = buildFogModel(c);
  const anchors = c.eras.map((e) => (e.id === 'today' ? fog.present : e.yearStart));
  return {
    fog,
    anchors,
    eras: c.eras.map((e) => ({ id: e.id, yearStart: e.id === 'today' ? fog.present : e.yearStart, label: e.label, caption: e.caption, paper: e.paper, script: e.script })),
    structures: c.structures.map((s) => ({ id: s.id, name: s.name, layer: s.layer, sex: s.sex })),
    discoveries: c.discoveries.map((d) => ({ id: d.id, plate: d.plate, title: d.title, yearStart: d.yearStart, displayDate: d.displayDate, structures: d.structures, layer: layerOf(c, d.structures) })),
    misbeliefs: c.misbeliefs.map((m) => ({ id: m.id, title: m.title, structures: m.structures, layer: layerOf(c, m.structures) })),
    threads: c.threads.map((t) => ({ id: t.id, title: t.title, discoveries: t.discoveries })),
  };
}
export type ClientModel = ReturnType<typeof buildClientModel>;

const LAYER_ORDER = ['surface', 'muscles', 'viscera', 'skeleton'];
/** The flap layer a story opens on (F13): the shallowest layer among its structures. */
export function layerOf(c: Corpus, structures: string[]): string {
  const layers = structures.map((s) => c.structures.find((x) => x.id === s)?.layer ?? 'surface');
  return layers.sort((a, b) => LAYER_ORDER.indexOf(a) - LAYER_ORDER.indexOf(b))[0];
}
