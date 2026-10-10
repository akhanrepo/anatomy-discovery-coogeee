/** F07: weekly/on-this-day cards resolved to displayable subjects. */
import { corpus } from './content/load';
export interface CardView { subject: string; kind: 'discovery' | 'misbelief' | 'concept'; title: string; text: string; href: string; image?: string; plate?: string }
export function cardView(subject: string): CardView {
  const c = corpus();
  const d = c.discoveries.find((x) => x.id === subject);
  if (d) return { subject, kind: 'discovery', title: `Tab. ${d.plate}: ${d.title}`, text: d.hook, href: `/tab/${d.id}/`, image: `/og/${d.id}.png`, plate: d.plate };
  const m = c.misbeliefs.find((x) => x.id === subject);
  if (m) return { subject, kind: 'misbelief', title: `A belief of its time: ${m.title}`, text: m.belief, href: `/?m=${m.id}` };
  for (const t of c.traditions) {
    const k = t.concepts.find((x) => x.id === subject);
    if (k) return { subject, kind: 'concept', title: `${t.name}: ${k.name}`, text: k.story, href: `/?lens=${t.id}` };
  }
  throw new Error(`unknown card subject ${subject}`);
}
