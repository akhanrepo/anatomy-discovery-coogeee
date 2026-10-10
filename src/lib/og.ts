/** F07: plate-style 1200×630 share images (satori → resvg). */
import { readFileSync } from 'node:fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { corpus } from './content/load';
import { plateSvg } from './plate';
import { site } from '../config/site';
import { LIGHT } from '../styles/tokens';

const font = (pkg: string, file: string) => readFileSync(`node_modules/@fontsource/${pkg}/files/${file}`);
let fonts: { name: string; data: Buffer; weight: 400 | 500; style: 'normal' }[] | undefined;
const loadFonts = () => (fonts ??= [
  { name: 'EB Garamond', data: font('eb-garamond', 'eb-garamond-latin-400-normal.woff'), weight: 400, style: 'normal' },
  { name: 'EB Garamond', data: font('eb-garamond', 'eb-garamond-latin-500-normal.woff'), weight: 500, style: 'normal' },
  { name: 'IM Fell English', data: font('im-fell-english', 'im-fell-english-latin-400-normal.woff'), weight: 400, style: 'normal' },
]);

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Node | string)[]): Node => ({ type, props: { style, children: children.length === 1 ? children[0] : children } });

export async function ogPng(o: { kicker: string; title: string; text: string; plateId?: string }): Promise<Buffer> {
  const plate = o.plateId ? `data:image/svg+xml;base64,${Buffer.from(plateSvg(o.plateId, { width: 440 })).toString('base64')}` : undefined;
  const tree = h('div', { width: 1200, height: 630, boxSizing: 'border-box', display: 'flex', background: LIGHT.paper, color: LIGHT.ink, padding: 30, fontFamily: 'EB Garamond' },
    h('div', { display: 'flex', boxSizing: 'border-box', width: 1140, height: 570, border: `2px solid ${LIGHT.ink}`, padding: 26, gap: 40 },
      ...(plate ? [{ type: 'img', props: { src: plate, width: 200, height: 500, style: { border: `1px solid ${LIGHT['ink-soft']}` } } } as Node] : []),
      h('div', { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' },
        h('div', { display: 'flex', flexDirection: 'column' },
          h('div', { fontSize: 28, color: LIGHT.gold, letterSpacing: 3, textTransform: 'uppercase' }, o.kicker),
          h('div', { fontFamily: 'IM Fell English', fontSize: 64, lineHeight: 1.08, marginTop: 18 }, o.title),
          h('div', { fontSize: 30, lineHeight: 1.35, marginTop: 22, color: LIGHT['ink-soft'] }, o.text),
        ),
        h('div', { display: 'flex', fontSize: 26, letterSpacing: 6, alignItems: 'center' }, `${site.name.toUpperCase()} · `, h('span', { fontStyle: 'normal', letterSpacing: 0, marginLeft: 8, color: LIGHT['ink-soft'] }, site.tagline)),
      ),
    ),
  );
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts: loadFonts() });
  return Buffer.from(new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng());
}

export function ogForDiscovery(id: string) {
  const c = corpus();
  const d = c.discoveries.find((x) => x.id === id)!;
  const sd = c.shareDates.find((s) => s.discovery === id);
  const kicker = sd ? `On this day · ${sd.day} ${['January','February','March','April','May','June','July','August','September','October','November','December'][sd.month - 1]} ${sd.year}` : `Tab. ${d.plate} · ${d.displayDate}`;
  return ogPng({ kicker, title: d.title, text: d.hook, plateId: d.id });
}
