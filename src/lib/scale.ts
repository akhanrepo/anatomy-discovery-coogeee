/** F02 piecewise slider scale: anchors are evenly spaced along the track; linear in between. */
export function makeScale(anchors: number[]) {
  const a = [...anchors].sort((x, y) => x - y);
  const n = a.length - 1;
  const toPos = (year: number): number => {
    if (year <= a[0]) return 0;
    if (year >= a[n]) return 1;
    let i = 0;
    while (year > a[i + 1]) i++;
    return (i + (year - a[i]) / (a[i + 1] - a[i])) / n;
  };
  const toYear = (pos: number): number => {
    const p = Math.min(1, Math.max(0, pos)) * n;
    const i = Math.min(n - 1, Math.floor(p));
    return Math.round(a[i] + (p - i) * (a[i + 1] - a[i]));
  };
  const nextAnchor = (year: number) => a.find((x) => x > year) ?? a[n];
  const prevAnchor = (year: number) => [...a].reverse().find((x) => x < year) ?? a[0];
  return { toPos, toYear, nextAnchor, prevAnchor, min: a[0], max: a[n], anchors: a };
}

export function formatYear(y: number, present?: number): string {
  if (present !== undefined && y >= present) return 'Today';
  return y < 0 ? `${-y} BCE` : `${y}`;
}
