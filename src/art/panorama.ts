/** F02/F16: the engraved panorama under the slider: places where the body was understood, left to right in time. */
import { smooth, line } from './geometry';
type G = { x: number; label: string; draw: (x: number, base: number) => string };
const base = 54;
const tri = (x: number, w: number, h: number) => `M${x - w},${base} L${x},${base - h} L${x + w},${base} Z`;
const rect = (x: number, y: number, w: number, h: number) => `M${x},${y} h${w} v${h} h${-w} Z`;
const dome = (x: number, r: number, y = base - 14) => `M${x - r},${y} A${r},${r} 0 0,1 ${x + r},${y} Z ${rect(x - r, y, 2 * r, base - y)}`;
export const GLYPHS: G[] = [
  { x: 18, label: 'Thebes', draw: (x) => `${tri(x, 16, 24)} ${rect(x + 22, base - 26, 4, 26)} ${tri(x + 24, 2, 4).replace(`${base}`, `${base - 26}`)}` },
  { x: 58, label: 'Croton', draw: (x) => `${rect(x - 14, base - 22, 28, 3)} ${[0, 1, 2, 3].map((i) => rect(x - 12 + i * 8, base - 19, 2.5, 19)).join(' ')} ${tri(x, 16, 6).replace(new RegExp(`${base}`, 'g'), `${base - 22}`)}` },
  { x: 92, label: 'Alexandria', draw: (x) => `${rect(x - 5, base - 20, 10, 20)} ${rect(x - 3.5, base - 32, 7, 12)} ${rect(x - 2, base - 40, 4, 8)}` },
  { x: 116, label: 'Han China', draw: (x) => `${rect(x - 3, base - 26, 6, 26)} ${line([x - 9, base - 26], [x + 9, base - 26], [x + 6, base - 30], [x - 6, base - 30], [x - 9, base - 26])}` },
  { x: 134, label: 'Kashi', draw: (x) => `${smooth([[x - 7, base], [x - 6, base - 18], [x, base - 30], [x + 6, base - 18], [x + 7, base]])} ${line([x - 14, base], [x - 10, base - 4], [x + 10, base - 4], [x + 14, base])}` },
  { x: 160, label: 'Rome', draw: (x) => `${smooth([[x - 22, base], [x - 22, base - 20], [x + 22, base - 20], [x + 22, base]])} ${[0, 1, 2, 3, 4].map((i) => `M${x - 18 + i * 9},${base} a3,5 0 0,1 6,0`).join(' ')}` },
  { x: 286, label: 'Cairo · Damascus', draw: (x) => `${dome(x, 11)} ${rect(x + 16, base - 34, 3, 34)} ${dome(x + 17.5, 3, base - 34)} ${dome(x - 22, 7)}` },
  { x: 330, label: 'Shiraz', draw: (x) => dome(x, 8) },
  { x: 430, label: 'Padua', draw: (x) => `${rect(x - 18, base - 14, 36, 14)} ${dome(x - 9, 6, base - 14)} ${dome(x + 9, 6, base - 14)} ${rect(x + 20, base - 28, 4, 28)}` },
  { x: 572, label: 'London · Oxford', draw: (x) => `${rect(x - 14, base - 16, 28, 16)} ${dome(x, 9, base - 16)} ${rect(x - 1, base - 32, 2, 7)}` },
  { x: 622, label: 'Delft', draw: (x) => `${tri(x, 6, 18)} ${line([x, base - 18], [x - 10, base - 28])} ${line([x, base - 18], [x + 10, base - 8])} ${line([x, base - 18], [x + 10, base - 28])} ${line([x, base - 18], [x - 10, base - 8])}` },
  { x: 714, label: 'Paris', draw: (x) => `${rect(x - 14, base - 26, 8, 26)} ${rect(x + 6, base - 26, 8, 26)} ${rect(x - 6, base - 18, 12, 18)}` },
  { x: 790, label: 'Madrid · Berlin', draw: (x) => `${rect(x - 12, base - 16, 24, 16)} ${tri(x, 14, 8).replace(new RegExp(`${base}`, 'g'), `${base - 16}`)}` },
  { x: 857, label: 'Cambridge · Toronto', draw: (x) => `${rect(x - 10, base - 36, 20, 36)} ${[0, 1, 2, 3].map((i) => rect(x - 7, base - 32 + i * 8, 14, 3)).join(' ')}` },
  { x: 960, label: 'Today', draw: (x) => `${rect(x - 22, base - 30, 10, 30)} ${rect(x - 10, base - 44, 12, 44)} ${rect(x + 4, base - 24, 14, 24)}` },
];
export function panoramaSvg(): string {
  const hills = smooth([[0, base], [80, base - 4], [200, base + 1], [330, base - 3], [470, base + 2], [600, base - 3], [760, base + 1], [900, base - 2], [1000, base]]);
  return `<path class="pano-hill" d="${hills}"/>` + GLYPHS.map((g) => `<g class="pano-glyph"><title>${g.label}</title><path d="${g.draw(g.x, base)}"/></g>`).join('');
}
