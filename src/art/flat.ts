/** Flat (CSS-free) rendering of the figure: every colour/opacity resolved to attributes.
 *  Used for standalone plates and OG images, which must render in any viewer (resvg has no CSS variables). */
import { structures, misbeliefArt, silhouette, ribs, limbBones, surfaceDetails, type Figure, type Layer } from './figure';
import type { InkState, MisbeliefPhase } from '../lib/state';
import { PIGMENTS } from './render';

type Tokens = Record<string, string>;
const ORDER: Layer[] = ['surface', 'muscles', 'viscera', 'skeleton'];

function defs(t: Tokens): string {
  return `<defs>${PIGMENTS.map((p) => `<pattern id="fx-${p}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-52)"><line x1="0" y1="0" x2="0" y2="5" stroke="${t[p]}" stroke-width=".7"/></pattern>`).join('')}</defs>`;
}

export function flatFigure(o: { fig: Figure; states: Record<string, InkState>; phases: Record<string, MisbeliefPhase>; layers: Layer[]; tokens: Tokens; mono?: boolean }): string {
  const t = o.tokens;
  const ink = t.ink;
  const deepestFirst = [...o.layers].sort((a, b) => ORDER.indexOf(b) - ORDER.indexOf(a));
  const top = deepestFirst[deepestFirst.length - 1];
  const parts: string[] = [defs(t), `<path d="${silhouette[o.fig]}" fill="${o.mono ? t.white : t['paper-shade']}" stroke="${ink}" stroke-width="1.3"/>`];
  for (const layer of deepestFirst) {
    const op = layer === top ? 1 : 0.28;
    const g: string[] = [];
    if (layer === 'skeleton') g.push(...[...ribs, ...limbBones].map((d) => `<path d="${d}" fill="none" stroke="${t['ink-soft']}" stroke-width=".8" opacity=".55"/>`));
    if (layer === 'surface') g.push(...surfaceDetails.map((d) => `<path d="${d}" fill="none" stroke="${t['ink-soft']}" stroke-width=".8" opacity=".55"/>`));
    for (const s of structures.filter((x) => x.layer === layer && (!x.sex || x.sex === o.fig))) {
      const st = o.states[s.id] ?? 'unknown';
      const shapes = s.id === 'skin' ? [{ d: silhouette[o.fig], kind: 'area' as const }] : s.shapes;
      for (const sh of shapes) {
        if (st === 'unknown') { g.push(`<path d="${sh.d}" fill="none" stroke="${t.ghost}" stroke-width="1" stroke-dasharray="2 3" opacity=".85"/>`); continue; }
        if (st === 'understood' && !o.mono) {
          const skin = s.id === 'skin';
          if (sh.kind === 'area') g.push(`<path d="${sh.d}" fill="${t[s.pigment]}" opacity="${skin ? 0.14 : 0.5}"/><path d="${sh.d}" fill="url(#fx-${s.pigment})" opacity="${skin ? 0.18 : 0.85}"/>`);
          else g.push(`<path d="${sh.d}" fill="none" stroke="${t[s.pigment]}" stroke-width="3.2" stroke-linecap="round" opacity=".85"/>`);
        }
        g.push(`<path d="${sh.d}" fill="none" stroke="${ink}" stroke-width="${st === 'understood' ? 1.2 : 1.1}" stroke-linecap="round" stroke-linejoin="round"/>`);
      }
    }
    if (!o.mono) for (const m of misbeliefArt.filter((x) => x.layer === layer)) {
      const ph = o.phases[m.id] ?? 'hidden';
      if (ph === 'hidden') continue;
      const op2 = ph === 'red' ? 0.95 : ph === 'partial' ? 0.45 : 0.1;
      const dash = ph === 'red' ? '' : ph === 'partial' ? ' stroke-dasharray="3 3"' : ' stroke-dasharray="1 4"';
      g.push(...m.paths.map((d) => `<path d="${d}" fill="none" stroke="${t.vermilion}" stroke-width="1.6" stroke-linecap="round" opacity="${op2}"${dash}/>`)); // misbelief ink
    }
    parts.push(`<g opacity="${op}">${g.join('')}</g>`);
  }
  return parts.join('');
}
