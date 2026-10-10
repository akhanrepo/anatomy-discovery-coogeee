import { describe, it, expect } from 'vitest';
import { loadCorpus } from '../../src/lib/content/load';
import { cardFor, isoWeek } from '../../src/lib/week';
import { cardView } from '../../src/lib/cards';
import { ShareDate } from '../../src/lib/content/schema';
import { runGates } from '../../src/lib/content/gates';
import { miniCorpus } from './fixtures';

const c = loadCorpus();

describe('F07 this week / on this day', () => {
  it('F07-AC3 every day of 2026–2028 resolves to a displayable card (never empty)', () => {
    for (let t = Date.UTC(2026, 0, 1); t <= Date.UTC(2028, 11, 31); t += 86400000) {
      const card = cardFor(new Date(t), c.calendar, c.shareDates);
      expect(card.subject, new Date(t).toISOString()).toBeTruthy();
      expect(cardView(card.subject).title.length).toBeGreaterThan(3);
    }
  });
  it('22 May is "on this day" for the sliding-filament papers', () => {
    expect(cardFor(new Date(Date.UTC(2027, 4, 22)), c.calendar, c.shareDates)).toMatchObject({ kind: 'on-this-day', subject: 'sliding-filaments' });
  });
  it('ISO weeks are computed correctly at year boundaries', () => {
    expect(isoWeek(new Date(Date.UTC(2026, 0, 1)))).toBe(1);
    expect(isoWeek(new Date(Date.UTC(2027, 0, 1)))).toBe(53);
    expect(isoWeek(new Date(Date.UTC(2026, 11, 31)))).toBe(53);
  });
  it('F07-AC4 every ShareDate needs a calendar and a citation (schema + gate)', () => {
    const ok = { discovery: 'x', month: 5, day: 22, year: 1954, calendar: 'gregorian', basis: 'publication', citation: 'src', caption: 'c' };
    expect(ShareDate.safeParse(ok).success).toBe(true);
    const { calendar: _c, ...noCal } = ok;
    expect(ShareDate.safeParse(noCal).success).toBe(false);
    const { citation: _ci, ...noCite } = ok;
    expect(ShareDate.safeParse(noCite).success).toBe(false);
    const m = miniCorpus();
    m.shareDates = [{ ...ok, discovery: 'harvey-circulation', citation: 'missing-source' } as never];
    expect(runGates(m).some((e) => e.gate === 'dangling-citation')).toBe(true);
    for (const s of c.shareDates) { expect(s.calendar).toBeTruthy(); expect(s.citation).toBeTruthy(); }
  });
});
