/** F06/F07: a standalone engraved plate per discovery: the figure at that year, its structures inked, framed and numbered. */
import { corpus } from './content/load';
import { buildFogModel, layerOf } from './model';
import { stateAt, activeMisbeliefs, indexByStructure } from './state';
import { renderStandalone } from '../art/render';
import { LIGHT, tokenString } from '../styles/tokens';
import type { Layer } from '../art/figure';

const LAYER_ORDER: Layer[] = ['surface', 'muscles', 'viscera', 'skeleton'];
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function plateSvg(id: string, opts: { width?: number } = {}): string {
  const c = corpus();
  const d = c.discoveries.find((x) => x.id === id)!;
  const m = buildFogModel(c);
  const idx = indexByStructure(m);
  const states = Object.fromEntries(c.structures.map((s) => [s.id, d.structures.includes(s.id) || stateAt(s.id, d.yearStart, m, idx) !== 'unknown' ? stateAt(s.id, d.yearStart, m, idx) : 'unknown']));
  // highlight this plate's structures at their state just after the discovery
  for (const s of d.structures) states[s] = stateAt(s, d.yearStart, m, idx);
  const layer = layerOf(c, d.structures) as Layer;
  const layers = LAYER_ORDER.slice(LAYER_ORDER.indexOf(layer));
  const fig = d.structures.some((s) => c.structures.find((x) => x.id === s)?.sex === 'female') ? 'female' : 'male';
  const inner = renderStandalone({ fig, states, phases: activeMisbeliefs(d.yearStart, m), layers, tokens: tokenString(LIGHT), width: 400, height: 1000 })
    .replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const w = opts.width ?? 440;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 1100" width="${w}" height="${Math.round((w * 1100) / 440)}" role="img" aria-label="Tab. ${d.plate}: ${esc(d.title)}">` +
    `<rect width="440" height="1100" fill="${LIGHT.paper}"/>` +
    `<rect x="10" y="10" width="420" height="1080" fill="none" stroke="${LIGHT.ink}" stroke-width="1.5"/><rect x="16" y="16" width="408" height="1068" fill="none" stroke="${LIGHT.ink}" stroke-width=".6"/>` +
    `<svg x="20" y="30" width="400" height="1000" viewBox="0 0 400 1000" class="tabula-fig" data-fig="${fig}">${inner}</svg>` +
    `<text x="220" y="1062" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" letter-spacing="3" fill="${LIGHT.ink}">TAB. ${d.plate} · ${esc(d.displayDate)}</text>` +
    `</svg>`;
}
