/** Small path helpers for the engraved figure. All coordinates are in a 400 × 1000 viewBox, midline x = 200. */
export type Pt = readonly [number, number];
export const MID = 200;

const f = (n: number) => Math.round(n * 10) / 10;

/** Smooth path through points (Catmull–Rom → cubic Bézier). */
export function smooth(points: Pt[], closed = false, tension = 0.5): string {
  const p = points;
  if (p.length < 2) return '';
  const n = p.length;
  const at = (i: number) => (closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f(p[0][0])},${f(p[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const t = tension / 3;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return closed ? `${d} Z` : d;
}

export const mirrorPt = ([x, y]: Pt): Pt => [2 * MID - x, y];
export const mirror = (pts: Pt[]): Pt[] => pts.map(mirrorPt);

/** A closed outline from the right half (top → bottom along the midline), mirrored to the left. */
export function symmetricOutline(rightHalf: Pt[]): Pt[] {
  const left = mirror(rightHalf.slice(1, -1)).reverse();
  return [...rightHalf, ...left];
}

export function ellipse(cx: number, cy: number, rx: number, ry: number): string {
  return `M${f(cx - rx)},${f(cy)} a${f(rx)},${f(ry)} 0 1,0 ${f(2 * rx)},0 a${f(rx)},${f(ry)} 0 1,0 ${f(-2 * rx)},0 Z`;
}

export function line(...pts: Pt[]): string {
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)},${f(y)}`).join(' ');
}

/** Both sides of a bilateral open path. */
export function both(pts: Pt[], open = true): string[] {
  return [smooth(pts, !open), smooth(mirror(pts), !open)];
}

/** Small chevrons along a path direction, used for valves and misbelief arrows. */
export function chevron(x: number, y: number, w = 5, dir: 1 | -1 = -1): string {
  return line([x - w, y - dir * w * 0.6], [x, y], [x + w, y - dir * w * 0.6]);
}
