/** F15: weekly email issue: table-based, inline-styled HTML that renders in Gmail, Apple Mail and Outlook. */
import { corpus } from './content/load';
import { cardView } from './cards';
import { site } from '../config/site';
import { LIGHT } from '../styles/tokens';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function emailIssue(week: number, siteUrl: string): { subject: string; html: string } {
  const c = corpus();
  const v = cardView(c.calendar[Math.min(c.calendar.length, week) - 1]);
  const thread = c.threads[(week - 1) % c.threads.length];
  const correction = c.corrections.at(-1);
  const img = v.image ? `${siteUrl}${v.image}` : `${siteUrl}/og/default.png`;
  const p = (t: string, extra = '') => `<p style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.55;color:${LIGHT.ink};${extra}">${t}</p>`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(v.title)}</title></head>
<body style="margin:0;padding:0;background:${LIGHT.paper};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${LIGHT.paper};"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:${LIGHT.paper};border:1px solid ${LIGHT.ink};">
<tr><td style="padding:20px 24px 8px;font-family:Georgia,serif;font-size:14px;letter-spacing:4px;color:${LIGHT.gold};text-transform:uppercase;">${esc(site.name)} · This week in anatomy</td></tr>
<tr><td style="padding:0 24px;"><a href="${esc(siteUrl + v.href)}"><img src="${esc(img)}" width="552" alt="${esc(v.title)}" style="display:block;width:100%;max-width:552px;height:auto;border:1px solid ${LIGHT['ink-soft']};"></a></td></tr>
<tr><td style="padding:20px 24px 4px;">
${p(`<a href="${esc(siteUrl + v.href)}" style="color:${LIGHT.ink};font-size:24px;text-decoration:none;">${esc(v.title)}</a>`)}
${p(esc(v.text))}
${p(`<a href="${esc(siteUrl + v.href)}" style="color:${LIGHT.madder};">Read the plate and its sources →</a>`)}
${p(`<strong>A tour for the weekend:</strong> <a href="${esc(`${siteUrl}/threads/${thread.id}/`)}" style="color:${LIGHT.ink};">${esc(thread.title)}</a>`)}
${correction ? p(`<strong>Corrected this week:</strong> ${esc(correction.summary)}`) : p(`<em>No corrections this week.</em> <a href="${esc(siteUrl)}/corrections/" style="color:${LIGHT.ink};">The corrections log</a> is public.`, 'font-size:14px;')}
</td></tr>
<tr><td style="padding:12px 24px 20px;font-family:Georgia,serif;font-size:12px;color:${LIGHT['ink-soft']};">You are receiving this because you subscribed at ${esc(siteUrl)}. <a href="{{ unsubscribe_url }}" style="color:${LIGHT['ink-soft']};">Unsubscribe in one click</a>.</td></tr>
</table></td></tr></table></body></html>`;
  return { subject: `${site.name}: ${v.title}`, html };
}
