import { marked } from 'marked';
import type { Source, Claim, Person } from './content/schema';
import { sourceIdOf, locatorOf } from './content/gates';
import { archiveUrl } from './assets';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Story markdown → HTML with numbered footnote markers that point at claim notes (F03, F05). */
export function renderStory(body: string, subjectId: string): { html: string; order: string[] } {
  const order: string[] = [];
  const withMarkers = body.replace(/\[\^([^\]]+)\]/g, (_, key: string) => {
    if (!order.includes(key)) order.push(key);
    const n = order.indexOf(key) + 1;
    return `<sup class="fn"><a href="#fn-${subjectId}-${key}" data-claim="${key}" aria-label="Source ${n}">${n}</a></sup>`;
  });
  return { html: marked.parse(withMarkers, { async: false }) as string, order };
}

export function inlineMd(s: string): string {
  return marked.parseInline(s, { async: false }) as string;
}

export function formatSource(s: Source, locator?: string): string {
  const title = s.title.startsWith('[') ? esc(s.title) : `<cite>${esc(s.title)}</cite>`;
  const bits = [`${esc(s.author)}, ${title}`, String(s.year)];
  if (s.publisher) bits.push(esc(s.publisher));
  if (s.doi) bits.push(`doi:${esc(s.doi)}`);
  let out = bits.join('. ').replace(/\.\./g, '.');
  if (locator) out += `, ${esc(locator)}`;
  out += '.';
  if (s.url) out += ` <a href="${esc(s.url)}" rel="noopener">Link</a> · <a href="${esc(archiveUrl(s.url))}" rel="noopener">Archive</a>`;
  const tags = [s.type === 'primary' ? 'primary' : s.scholarly ? 'scholarly' : s.type === 'tertiary' ? 'reference' : 'secondary'];
  if (s.detailsPending) tags.push('details pending');
  return `${out} <span class="src-tag">${tags.join(' · ')}</span>`;
}

export function formatCitations(claim: Claim, sources: Map<string, Source>): string[] {
  return claim.citations.map((ref) => {
    const s = sources.get(sourceIdOf(ref));
    return s ? formatSource(s, locatorOf(ref)) : esc(ref);
  });
}

export function personName(p: Person): string {
  const script = p.script === 'arab' ? 'ar' : p.script === 'hans' ? 'zh' : p.script === 'deva' ? 'sa' : p.script === 'grek' ? 'grc' : undefined;
  const orig = p.nameOriginal && script ? ` <span lang="${script}" class="orig"${script === 'ar' ? ' dir="rtl"' : ''}>${esc(p.nameOriginal)}</span>` : '';
  return `${esc(p.name)}${orig}`;
}
