/** F15: RSS 2.0 feed of the weekly cards (+ on-this-day items). */
import { corpus } from './content/load';
import { cardView } from './cards';
import { site } from '../config/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Monday of ISO week w in year y (UTC). */
export function isoWeekStart(y: number, w: number): Date {
  const jan4 = new Date(Date.UTC(y, 0, 4));
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - ((jan4.getUTCDay() || 7) - 1) + (w - 1) * 7);
  return monday;
}

export function buildFeed(siteUrl: string, year = new Date().getUTCFullYear()): string {
  const c = corpus();
  const items = c.calendar.map((s, i) => ({ v: cardView(s), date: isoWeekStart(year, i + 1), guid: `${siteUrl}/today/#${year}-w${i + 1}` }));
  const otd = c.shareDates.map((s) => ({ v: cardView(s.discovery), date: new Date(Date.UTC(year, s.month - 1, s.day)), guid: `${siteUrl}/today/#${year}-otd-${s.discovery}`, caption: s.caption }));
  const now = new Date();
  const all = [...items, ...otd].filter((x) => x.date <= now).sort((a, b) => b.date.getTime() - a.date.getTime());
  const entries = all.map((x) => `    <item>
      <title>${esc(x.v.title)}</title>
      <link>${esc(siteUrl + x.v.href)}</link>
      <guid isPermaLink="false">${esc(x.guid)}</guid>
      <pubDate>${x.date.toUTCString()}</pubDate>
      <description>${esc(('caption' in x ? (x as { caption: string }).caption : x.v.text))}</description>
    </item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)}: This week in anatomy</title>
    <link>${esc(siteUrl)}/</link>
    <description>${esc(site.description)}</description>
    <language>en</language>
    <atom:link href="${esc(siteUrl)}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
${entries}
  </channel>
</rss>
`;
}
