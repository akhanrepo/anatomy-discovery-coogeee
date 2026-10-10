import { createHash } from 'node:crypto';
import type { Corpus } from './content/schema';
/** Content version: changes whenever any claim (text, citations, status) changes. Shown on packs and the edition. */
export function contentVersion(c: Corpus): string {
  const all = [
    ...c.discoveries.map((d) => [d.id, d.claims] as const),
    ...c.misbeliefs.map((m) => [m.id, m.claims] as const),
    ...c.traditions.flatMap((t) => t.concepts.map((k) => [k.id, k.claims] as const)),
  ].map(([id, cl]) => `${id}:${JSON.stringify(Object.entries(cl).sort())}`).join('\n');
  return createHash('sha256').update(all).digest('hex').slice(0, 8);
}
