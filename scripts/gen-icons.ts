// F17: the half-inked heart. Left half = line only (described); right half = hatch + madder wash (understood);
// a faint vermilion pore being erased. Writes SVG + PNG sizes + a two-tone 16px variant.
import { writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import { LIGHT, DARK } from '../src/styles/tokens';

const HEART = 'M32 54 C20 44 8 36 8 24 C8 15 15 9 22 9 C27 9 30 12 32 16 C34 12 37 9 42 9 C49 9 56 15 56 24 C56 36 44 44 32 54 Z';
const hatch = Array.from({ length: 34 }, (_, i) => `<line x1="${20 + i * 2}" y1="4" x2="${i * 2 - 6}" y2="60"/>`).join('');

export function fullIcon(t: Record<string, string>, bg = true) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
${bg ? `<rect width="64" height="64" rx="12" fill="${t.paper}"/>` : ''}
<defs><clipPath id="r"><rect x="32" y="0" width="32" height="64"/></clipPath><clipPath id="h"><path d="${HEART}"/></clipPath></defs>
<g clip-path="url(#r)"><path d="${HEART}" fill="${t.madder}" opacity=".55"/><g clip-path="url(#h)" stroke="${t.ink}" stroke-width=".55" opacity=".8">${hatch}</g></g>
<path d="${HEART}" fill="none" stroke="${t.ink}" stroke-width="1.8" stroke-linejoin="round"/>
<line x1="32" y1="17" x2="32" y2="52" stroke="${t.ink}" stroke-width="1" stroke-dasharray="2 2" opacity=".6"/>
<circle cx="29" cy="33" r="1.6" fill="${t.vermilion}" opacity=".55"/>
</svg>`;
}
export function tinyIcon(t: Record<string, string>) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="${t.paper}"/>
<defs><clipPath id="r"><rect x="32" y="0" width="32" height="64"/></clipPath></defs>
<path d="${HEART}" fill="${t.madder}" clip-path="url(#r)"/><path d="${HEART}" fill="none" stroke="${t.ink}" stroke-width="5" stroke-linejoin="round"/></svg>`;
}

const adaptive = (light: string, dark: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><style>.d{display:none}@media (prefers-color-scheme: dark){.l{display:none}.d{display:inline}}</style><g class="l">${light.replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g><g class="d">${dark.replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g></svg>`;

if (process.argv[1]?.endsWith('gen-icons.ts')) {
  writeFileSync('public/icon.svg', fullIcon(LIGHT));
  writeFileSync('public/icon-dark.svg', fullIcon(DARK));
  writeFileSync('public/favicon.svg', adaptive(tinyIcon(LIGHT), tinyIcon(DARK)));
  for (const size of [16, 32, 180, 192, 512]) {
    const svg = size <= 32 ? tinyIcon(LIGHT) : fullIcon(LIGHT);
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
    writeFileSync(`public/icon-${size}.png`, png);
  }
  writeFileSync('public/site.webmanifest', JSON.stringify({
    name: 'Tabula', short_name: 'Tabula', description: 'The body, as it was written.',
    icons: [192, 512].map((s) => ({ src: `/icon-${s}.png`, sizes: `${s}x${s}`, type: 'image/png' })),
    theme_color: LIGHT.paper, background_color: LIGHT.paper, display: 'standalone', start_url: '/',
  }, null, 2));
  console.log('icons written');
}
