/** F07 view state ↔ URL query (?y=&d=&fig=&lens=&layer=). */
export interface ViewState { y?: number; d?: string; m?: string; tour?: string; fig?: 'male' | 'female'; lens?: string; layer?: string }
const LAYERS = ['surface', 'muscles', 'viscera', 'skeleton'];

export function parseView(search: string): ViewState {
  const q = new URLSearchParams(search);
  const v: ViewState = {};
  const y = q.get('y');
  if (y !== null && /^-?\d+$/.test(y)) v.y = parseInt(y, 10);
  const d = q.get('d');
  if (d && /^[a-z0-9-]+$/.test(d)) v.d = d;
  for (const k of ['m', 'tour'] as const) {
    const val = q.get(k);
    if (val && /^[a-z0-9-]+$/.test(val)) v[k] = val;
  }
  const fig = q.get('fig');
  if (fig === 'male' || fig === 'female') v.fig = fig;
  const lens = q.get('lens');
  if (lens && /^[a-z0-9-]+$/.test(lens)) v.lens = lens;
  const layer = q.get('layer');
  if (layer && LAYERS.includes(layer)) v.layer = layer;
  return v;
}

export function serializeView(v: ViewState): string {
  const q = new URLSearchParams();
  if (v.y !== undefined) q.set('y', String(v.y));
  if (v.d) q.set('d', v.d);
  if (v.m) q.set('m', v.m);
  if (v.tour) q.set('tour', v.tour);
  if (v.fig) q.set('fig', v.fig);
  if (v.lens && v.lens !== 'modern') q.set('lens', v.lens);
  if (v.layer) q.set('layer', v.layer);
  const s = q.toString();
  return s ? `?${s}` : '';
}
