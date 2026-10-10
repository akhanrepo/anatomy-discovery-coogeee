import { structures, misbeliefArt, silhouette, ribs, limbBones, surfaceDetails, LAYERS, type Figure, type Layer } from './figure';
import type { InkState, MisbeliefPhase } from '../lib/state';

export const VIEWBOX = '0 0 400 1000';
export const PIGMENTS = ['madder', 'rose', 'indigo', 'orpiment', 'verdigris', 'ochre', 'bone', 'umber'] as const;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/** Hatch patterns (one per pigment, plus cross-hatch) and the skin shading mask. IDs are global in the document. */
export function defs(): string {
  const hatch = PIGMENTS.map(
    (p) => `<pattern id="h-${p}" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><line x1="0" y1="0" x2="0" y2="4" class="hl" style="stroke:var(--${p})"/></pattern>` +
      `<pattern id="x-${p}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-52)"><line x1="0" y1="0" x2="0" y2="5" class="hl" style="stroke:var(--${p})"/></pattern>`,
  ).join('');
  return `<defs>${hatch}
<pattern id="h-ink" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(32)"><line x1="0" y1="0" x2="0" y2="3.2" class="hl" style="stroke:var(--ink)"/></pattern>
<linearGradient id="g-shade" x1="0" x2="1"><stop offset="0" stop-color="#fff"/><stop offset=".18" stop-color="#000"/><stop offset=".82" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>
<mask id="m-shade-male"><rect width="400" height="1000" fill="url(#g-shade)"/></mask>
<clipPath id="c-male"><path d="${silhouette.male}"/></clipPath><clipPath id="c-female"><path d="${silhouette.female}"/></clipPath>
</defs>`;
}

/** Engraving styles; shared by the page and by standalone plates. Colours come from tokens set on .tabula-fig. */
export const FIGURE_CSS = `
.tabula-fig .hl{stroke-width:.7}
.tabula-fig .sil{fill:var(--paper-shade);stroke:var(--ink);stroke-width:1.3}
.tabula-fig .shade{fill:url(#h-ink);opacity:.22}
.tabula-fig .decor{fill:none;stroke:var(--ink-soft);stroke-width:.8;opacity:.55}
.tabula-fig .st .ghost{fill:none;stroke:var(--ghost);stroke-width:1;stroke-dasharray:2 3;opacity:0}
.tabula-fig .st .ink{fill:none;stroke:var(--ink);stroke-width:1.1;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:0}
.tabula-fig .st .wash{stroke:none;opacity:0}
.tabula-fig .st .hatch{stroke:none;opacity:0}
.tabula-fig .st .lnwash{fill:none;stroke-width:3.2;stroke-linecap:round;opacity:0}
.tabula-fig .st .hit{fill:transparent;stroke:transparent;stroke-width:7;pointer-events:all}
.tabula-fig .mb{pointer-events:none}
.tabula-fig .st[data-state=unknown] .ink{stroke-dashoffset:1;opacity:0}
.tabula-fig .st[data-state=unknown] .ghost{opacity:.85}
.tabula-fig .st[data-state=understood] .wash{opacity:.5}
.tabula-fig .st[data-state=understood] .hatch{opacity:.85}
.tabula-fig .st[data-state=understood] .lnwash{opacity:.85}
.tabula-fig .st[data-state=understood] .ink{stroke-width:1.2}
.tabula-fig .st[data-id=skin][data-state=understood] .wash{opacity:.14}
.tabula-fig .st[data-id=skin][data-state=understood] .hatch{opacity:.18}
.tabula-fig .st[data-id=skin] .hit{pointer-events:none}
.tabula-fig .mb path{fill:none;stroke:var(--vermilion);stroke-width:1.6;stroke-linecap:round;opacity:0}
.tabula-fig .mb[data-phase=red] path{opacity:.95}
.tabula-fig .mb[data-phase=partial] path{opacity:.45;stroke-dasharray:3 3}
.tabula-fig .mb[data-phase=erased] path{opacity:.1;stroke-dasharray:1 4}
.tabula-fig [data-sex]{display:none}
.tabula-fig[data-fig=male] [data-sex=male],.tabula-fig[data-fig=female] [data-sex=female]{display:inline}
.tabula-fig .sil-female{display:none}.tabula-fig[data-fig=female] .sil-female{display:inline}.tabula-fig[data-fig=female] .sil-male{display:none}
`;

export interface RenderOpts {
  fig: Figure;
  states: Record<string, InkState>;
  phases: Record<string, MisbeliefPhase>;
  names?: Record<string, string>;
  /** layers to draw; default all */
  layers?: Layer[];
  interactive?: boolean;
}

function structureGroup(id: string, o: RenderOpts): string {
  const art = structures.find((s) => s.id === id)!;
  const state = o.states[id] ?? 'unknown';
  const shapes = art.id === 'skin'
    ? [{ d: silhouette.male, kind: 'area' as const, cls: 'sil-male' }, { d: silhouette.female, kind: 'area' as const, cls: 'sil-female' }]
    : art.shapes.map((s) => ({ ...s, cls: '' }));
  const body = shapes.map(({ d, kind, cls }) => {
    if (!d) return '';
    const c = cls ? ` class="${cls}"` : '';
    if (kind === 'area') {
      return `<g${c}><path class="ghost" d="${d}"/><path class="wash" d="${d}" style="fill:var(--${art.pigment})"/><path class="hatch" d="${d}" style="fill:url(#x-${art.pigment})"/><path class="ink" pathLength="1" d="${d}"/>${o.interactive ? `<path class="hit" d="${d}"/>` : ''}</g>`;
    }
    return `<g${c}><path class="ghost" d="${d}"/><path class="lnwash" d="${d}" style="stroke:var(--${art.pigment})"/><path class="ink" pathLength="1" d="${d}"/>${o.interactive ? `<path class="hit" d="${d}"/>` : ''}</g>`;
  }).join('');
  const name = o.names?.[id] ?? id;
  const a11y = o.interactive ? ` tabindex="-1" role="button" aria-label="${esc(name)}"` : '';
  const sex = art.sex ? ` data-sex="${art.sex}"` : '';
  return `<g class="st" data-id="${id}" data-state="${state}" data-layer="${art.layer}"${sex}${a11y}><title>${esc(name)}</title>${body}</g>`;
}

function misbeliefGroup(id: string, o: RenderOpts): string {
  const art = misbeliefArt.find((m) => m.id === id)!;
  const phase = o.phases[id] ?? 'hidden';
  return `<g class="mb" data-mb="${id}" data-phase="${phase}" aria-hidden="true">${art.paths.map((d) => `<path d="${d}"/>`).join('')}</g>`;
}

export function layerContent(layer: Layer, o: RenderOpts): string {
  const decor =
    layer === 'skeleton' ? `<g class="decor">${[...ribs, ...limbBones].map((d) => `<path d="${d}"/>`).join('')}</g>`
    : layer === 'surface' ? `<g class="decor">${surfaceDetails.map((d) => `<path d="${d}"/>`).join('')}</g>`
    : '';
  const size = (id: string) => structures.find((s) => s.id === id)!.shapes.reduce((n, sh) => n + sh.d.length, 0);
  const inLayer = structures.filter((s) => s.layer === layer);
  const lines = inLayer.filter((s) => s.shapes.every((sh) => sh.kind === 'line'));
  const areas = inLayer.filter((s) => !lines.includes(s)).sort((a, b) => (a.id === 'skin' ? -1 : b.id === 'skin' ? 1 : size(b.id) - size(a.id)));
  const sts = [...lines, ...areas].map((s) => structureGroup(s.id, o)).join('');
  const mbs = misbeliefArt.filter((m) => m.layer === layer).map((m) => misbeliefGroup(m.id, o)).join('');
  return `${decor}${sts}${mbs}`;
}

/** The silhouette base: paper-toned body with engraved edge shading. */
export function baseContent(): string {
  return `<g class="sil-male"><path class="sil" d="${silhouette.male}"/><path class="shade" d="${silhouette.male}" mask="url(#m-shade-male)"/></g>` +
    `<g class="sil-female"><path class="sil" d="${silhouette.female}"/><path class="shade" d="${silhouette.female}" mask="url(#m-shade-male)"/></g>`;
}

/** One self-contained SVG (used for standalone plates and OG images). */
export function renderStandalone(o: RenderOpts & { width?: number; height?: number; title?: string; tokens: string }): string {
  const layers = o.layers ?? LAYERS;
  const order = [...layers].reverse(); // deepest first
  return `<svg xmlns="http://www.w3.org/2000/svg" class="tabula-fig" data-fig="${o.fig}" viewBox="${VIEWBOX}" width="${o.width ?? 400}" height="${o.height ?? 1000}" role="img"${o.title ? ` aria-label="${esc(o.title)}"` : ''}>` +
    `<style>.tabula-fig{${o.tokens}}${FIGURE_CSS}</style>${defs()}<rect width="400" height="1000" style="fill:var(--paper)"/>${baseContent()}` +
    order.map((l, i) => `<g class="lyr" style="opacity:${i === order.length - 1 ? 1 : 0.28}">${layerContent(l, o)}</g>`).join('') +
    `</svg>`;
}
