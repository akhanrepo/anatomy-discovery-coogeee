export interface EraLike { id: string; yearStart: number }
/** The era in force at `year`: the last anchor at or before it. */
export function eraAt<T extends EraLike>(eras: T[], year: number): T {
  let cur = eras[0];
  for (const e of eras) if (e.yearStart <= year) cur = e;
  return cur;
}
