/** F14: the premium edition, generated from content: one chapter per thread (intro, long-view essay, stories, beliefs, sources). */
import type { Corpus } from './content/schema';
import { contentVersion } from './version';
import { sourceIdOf, locatorOf } from './content/gates';

export interface Chapter { id: string; title: string; intro: string; sections: { title: string; ref: string; body: string; date: string }[]; claims: { ref: string; text: string; sources: string[] }[] }
export interface Edition { version: string; title: string; chapters: Chapter[]; images: string[] }

export function buildEdition(c: Corpus): Edition {
  const src = new Map(c.sources.map((s) => [s.id, s]));
  const cite = (r: string) => { const s = src.get(sourceIdOf(r))!; return `${s.author}, ${s.title} (${s.year})${locatorOf(r) ? `, ${locatorOf(r)}` : ''}${s.url ? ` <${s.url}>` : ''}`; };
  const chapters = c.threads.map((t) => {
    const ds = t.discoveries.map((id) => c.discoveries.find((d) => d.id === id)!);
    const mbs = c.misbeliefs.filter((m) => ds.some((d) => d.corrects.includes(m.id)));
    const essay = c.essays?.find((x) => x.thread === t.id);
    const essayId = `essay-${t.id}`;
    return {
      id: t.id, title: t.title, intro: t.intro.replace(/\[\^([^\]]+)\]/g, (_, k) => `[^${t.id}-${k}]`),
      sections: [
        ...(essay ? [{ title: essay.title, ref: essayId, date: '', body: essay.body.replace(/^## /gm, '### ').replace(/\[\^([^\]]+)\]/g, (_, k) => `[^${essayId}-${k}]`) }] : []),
        ...ds.map((d) => ({ title: `Tab. ${d.plate}: ${d.title}`, ref: d.id, date: d.displayDate, body: d.body.replace(/\[\^([^\]]+)\]/g, (_, k) => `[^${d.id}-${k}]`) + `\n\n*How they knew.* ${d.method}\n\n*What it overturned.* ${d.overturned}` })),
        ...mbs.map((m) => ({ title: `A belief of its time: ${m.title}`, ref: m.id, date: '', body: m.belief })),
      ],
      claims: [
        ...Object.entries(t.claims).map(([k, cl]) => ({ ref: `${t.id}#${k}`, text: cl.text, sources: cl.citations.map(cite) })),
        ...(essay ? Object.entries(essay.claims).map(([k, cl]) => ({ ref: `${essayId}#${k}`, text: cl.text, sources: cl.citations.map(cite) })) : []),
        ...ds.flatMap((d) => Object.entries(d.claims).map(([k, cl]) => ({ ref: `${d.id}#${k}`, text: cl.text, sources: cl.citations.map(cite) }))),
        ...mbs.flatMap((m) => Object.entries(m.claims).map(([k, cl]) => ({ ref: `${m.id}#${k}`, text: cl.text, sources: cl.citations.map(cite) }))),
      ],
    };
  });
  const images = c.threads.flatMap((t) => t.discoveries.map((id) => c.discoveries.find((d) => d.id === id)!.assets[0]));
  return { version: contentVersion(c), title: 'Tabula: The Body, as It Was Written', chapters, images: [...new Set(images)] };
}

export function editionMarkdown(e: Edition): string {
  const out = [`---\ntitle: "${e.title}"\nsubtitle: "Edition ${e.version}"\nlang: en\n---\n`];
  for (const ch of e.chapters) {
    out.push(`# ${ch.title}\n\n${ch.intro}\n`);
    for (const s of ch.sections) out.push(`## ${s.title}${s.date ? ` (${s.date})` : ''}\n\n${s.body}\n`);
    out.push(`### Sources for this chapter\n\n${ch.claims.map((k) => `- **${k.ref}**: ${k.text} ${k.sources.join('; ')}`).join('\n')}\n`);
    for (const body of [ch.intro, ...ch.sections.map((s) => s.body)]) for (const m of body.matchAll(/\[\^([^\]]+)\]/g)) {
      const [subj, key] = [m[1].slice(0, m[1].lastIndexOf('-')), m[1].slice(m[1].lastIndexOf('-') + 1)];
      const k = ch.claims.find((x) => x.ref === `${subj}#${key}`);
      if (k) out.push(`[^${m[1]}]: ${k.text} ${k.sources.join('; ')}`);
    }
    out.push('');
  }
  return [...new Set(out)].join('\n');
}
