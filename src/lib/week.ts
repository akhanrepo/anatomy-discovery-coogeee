/** F07 "This week / On this day": ISO week → curated slot; verified day-month dates win. */
export function isoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export interface Card { kind: 'on-this-day' | 'this-week'; subject: string; caption?: string }

export function cardFor(date: Date, calendar: string[], shareDates: { discovery: string; month: number; day: number; caption: string }[]): Card {
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  const hit = shareDates.find((s) => s.month === m && s.day === d);
  if (hit) return { kind: 'on-this-day', subject: hit.discovery, caption: hit.caption };
  const w = Math.min(isoWeek(date), calendar.length);
  return { kind: 'this-week', subject: calendar[w - 1] };
}
