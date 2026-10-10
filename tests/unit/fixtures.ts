import type { Corpus } from '../../src/lib/content/schema';
import { claimsHash } from '../../src/lib/content/load';

const words = (n: number) => Array.from({ length: n }, (_, i) => `word${i % 7 === 0 ? 'x' : ''}`).join(' ');

/** A tiny corpus that passes every gate except the balance targets (which need the real set). */
export function miniCorpus(): Corpus {
  const claims = {
    c1: { text: 'Harvey published De motu cordis in 1628.', citations: ['harvey-1628:ch. 1', 'scholar-a'], status: 'established' as const },
  };
  const mbClaims = {
    belief: { text: 'Galen held that blood seeps through septal pores.', citations: ['galen-up', 'scholar-a'], status: 'established' as const },
    fix: { text: 'Harvey showed the blood circulates.', citations: ['harvey-1628', 'scholar-a'], status: 'established' as const },
  };
  return {
    structures: [{ id: 'heart', name: 'Heart', system: 'circulatory', layer: 'viscera', sex: 'both' }],
    people: [
      { id: 'harvey', name: 'William Harvey', dates: '1578–1657', place: 'London', tradition: 'early-modern' },
      { id: 'galen', name: 'Galen', dates: 'c. 129–216', place: 'Rome', tradition: 'greco-roman' },
    ],
    sources: [
      { id: 'harvey-1628', type: 'primary', scholarly: false, author: 'Harvey', title: 'De motu cordis', year: 1628 },
      { id: 'galen-up', type: 'primary', scholarly: false, author: 'Galen', title: 'De usu partium', year: '2nd c.' },
      { id: 'scholar-a', type: 'secondary', scholarly: true, author: 'A. Scholar', title: 'Harvey', year: 2000 },
      { id: 'wiki', type: 'tertiary', scholarly: false, author: 'Wikipedia', title: 'Harvey', year: 2026 },
    ],
    discoveries: [
      {
        id: 'harvey-circulation', plate: 'I', title: 'Circulation', hook: 'h', structures: ['heart'], kind: 'function',
        yearStart: 1628, yearPrecision: 'exact', displayDate: '1628', people: ['harvey'], place: 'London',
        tradition: 'early-modern', status: 'established', method: 'm', overturned: 'o', corrects: ['septal-pores'],
        claims, assets: ['plate-harvey'], threads: [], body: `${words(160)} [^c1]`,
      },
    ],
    misbeliefs: [
      {
        id: 'septal-pores', title: 'Septal pores', belief: 'b', heldBy: ['galen'], yearStart: 170, structures: ['heart'],
        corrections: [{ year: 1628, by: 'Harvey', discovery: 'harvey-circulation', scope: 'mainstream' }],
        claims: mbClaims, beliefClaim: 'belief', correctionClaim: 'fix',
      },
    ],
    eras: [],
    threads: [],
    assets: [
      {
        id: 'plate-harvey', title: 'Plate', creator: 'Tabula', date: '2026', sourceInstitution: 'Tabula',
        recordUrl: 'https://example.org/record', licence: 'CC-BY', licenceVerified: true, credit: 'Tabula',
        kind: 'generated', authenticity: 'ours', altText: 'A generated plate of the heart',
      },
    ],
    traditions: [],
    shareDates: [],
    logs: [
      { subject: 'harvey-circulation', date: '2026-10-10', reviewer: 'claude', claimsHash: claimsHash(claims), sourcesConsulted: ['x'], mythChecks: ['y'], verdict: 'pass', notes: '' },
      { subject: 'septal-pores', date: '2026-10-10', reviewer: 'claude', claimsHash: claimsHash(mbClaims), sourcesConsulted: ['x'], mythChecks: ['y'], verdict: 'pass', notes: '' },
    ],
    corrections: [],
    calendar: [],
  };
}
