/** F12: classroom packs, generated entirely from content (threads, stories, claims, misbeliefs). */
import type { Corpus, Discovery, Claim } from './content/schema';
import { contentVersion } from './version';

export interface PackDef { id: string; title: string; subtitle: string; discoveries: string[]; product?: string; free?: boolean; syllabus: string }
export const PACKS: PackDef[] = [
  { id: 'sample', title: 'Galen vs Vesalius', subtitle: 'Free sample pack', discoveries: ['galen-arteries-blood', 'galen-recurrent-laryngeal', 'vesalius-fabrica'], free: true, syllabus: 'Any history of medicine unit' },
  { id: 'circulation', title: 'The circulation of the blood', subtitle: 'Galen to Malpighi', discoveries: [], product: 'pack-circulation', syllabus: 'GCSE History "Medicine through time"; NSW Science (nature of science)' },
  { id: 'myths', title: 'Myths and "firsts" in medicine', subtitle: 'Source analysis for sceptics', discoveries: [], product: 'pack-myths', syllabus: 'IB TOK; Modern History (source analysis)' },
  { id: 'microscopy', title: 'Seeing the invisible', subtitle: 'Microscopy, tissues and cells', discoveries: [], product: 'pack-microscopy', syllabus: 'Biology (cells, tissues); nature of science' },
];
const THREAD_OF: Record<string, string> = { circulation: 'circulation', myths: 'myths-and-firsts', microscopy: 'microscopy' };

export interface PackClaim { ref: string; text: string; status: string; citations: string[] }
export interface Pack {
  def: PackDef; version: string; discoveries: Discovery[]; plateYears: number[];
  myths: { statement: string; answer: 'believed then, later overturned' | 'supported by the sources'; ref: string }[];
  questions: string[]; claims: PackClaim[];
}

const claimList = (subject: string, claims: Record<string, Claim>): PackClaim[] =>
  Object.entries(claims).map(([k, cl]) => ({ ref: `${subject}#${k}`, text: cl.text, status: cl.status, citations: cl.citations }));

export function buildPack(c: Corpus, id: string): Pack {
  const def = PACKS.find((p) => p.id === id)!;
  const ids = def.discoveries.length ? def.discoveries : c.threads.find((t) => t.id === THREAD_OF[id])!.discoveries;
  const discoveries = ids.map((x) => c.discoveries.find((d) => d.id === x)!);
  const years = discoveries.map((d) => d.yearStart);
  const plateYears = [...new Set([years[0], years[Math.floor(years.length / 3)], years[Math.floor((2 * years.length) / 3)], years[years.length - 1]])];
  const misbeliefs = c.misbeliefs.filter((m) => discoveries.some((d) => d.corrects.includes(m.id)));
  const myths = [
    ...misbeliefs.map((m) => ({ statement: m.belief, answer: 'believed then, later overturned' as const, ref: `${m.id}#${m.beliefClaim}` })),
    ...discoveries.slice(0, Math.max(2, misbeliefs.length)).map((d) => { const [k, cl] = Object.entries(d.claims)[0]; return { statement: cl.text, answer: 'supported by the sources' as const, ref: `${d.id}#${k}` }; }),
  ];
  const people = (d: Discovery) => d.people.map((p) => c.people.find((x) => x.id === p)!.name).join(' and ');
  const questions = discoveries.flatMap((d) => [
    `${people(d)}: what method did they use, and why did it convince (or fail to convince) people at the time?`,
    d.status !== 'established' ? `Tab. ${d.plate} is marked "${d.status}". What exactly is disputed, and what evidence would settle it?` : `What did people believe before Tab. ${d.plate}, and why was that belief reasonable then?`,
  ]).slice(0, 8);
  const claims = [...discoveries.flatMap((d) => claimList(d.id, d.claims)), ...misbeliefs.flatMap((m) => claimList(m.id, m.claims))];
  return { def, version: contentVersion(c), discoveries, plateYears, myths, questions, claims };
}
