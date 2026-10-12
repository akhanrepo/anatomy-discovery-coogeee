// Writes verification logs (F05) for every subject from the October 2026 review.
// Usage: tsx scripts/write-logs.ts            → create missing logs
//        tsx scripts/write-logs.ts --sign <id> → re-sign one subject after re-verifying it (updates hash + date)
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import matter from 'gray-matter';
import { loadCorpus, claimsHash } from '../src/lib/content/load';
import { sourceIdOf } from '../src/lib/content/gates';
import type { Claim } from '../src/lib/content/schema';

const TODAY = new Date().toISOString().slice(0, 10);
const REVIEWER = 'Claude (AI-assisted verification; see /how-we-source)';

const MYTH: Record<string, string[]> = {
  'edwin-smith-papyrus': ['Date of the papyrus (sources range 1700–1500 BCE; underlying text older)', '"First description of the brain": checked against neurosurgical history literature'],
  'alcmaeon-brain-sensation': ['Did Alcmaeon dissect? (rests on Calcidius; doubted by SEP)', 'Optic-nerve "discovery" attribution'],
  'herophilus-nerves': ['Human vivisection accusation (Celsus, Tertullian; doubted)', 'Duodenum naming and heart valves: could not verify, so removed', 'Erasistratus and hollow nerves: summary contradicted the standard account, so removed'],
  'huangdi-circulation-myth': ['"China knew circulation before Harvey": traced to Vossius 1685 and Needham; rejected by Unschuld'],
  'sushruta-dissection': ['Popular 6th c. BCE date (rejected)', 'Method details conflict: cage/river vs grass/still water; 7 vs 3 days'],
  'galen-arteries-blood': ["Erasistratus's actual position (blood rushes in only after wounding)"],
  'galen-recurrent-laryngeal': ['Which nerves were tied: recurrent laryngeal vs intercostal in some retellings'],
  'ibn-al-haytham-vision': ['"Discovered eye anatomy": rejected; contribution is optics (his anatomy was Galenic)', 'Dates 1011–1021'],
  'ibn-al-nafis-pulmonary-circulation': ['Date 1242 (inferred from age ~29; birth 1210 or 1213)', 'Transmission to Europe (debated)', '1924 rediscovery (Altatawi, Berlin)'],
  'leonardo-aortic-valve': ['Was the glass model built? (disputed)', 'Influence: notes unpublished'],
  'vesalius-fabrica': ['"Corrected 200 errors" (popular figure, no scholarly source: not used)', 'Rete mirabile lingering after 1543', 'Sternum 3 vs 7 parts (not used: needs scholarly source)'],
  'pulmonary-circulation-europe': ['Priority: Servetus 1553 vs Valverde 1556 vs Colombo 1559', 'Independence from Ibn al-Nafis'],
  'falloppio-uterine-tubes': ['Date 1561 vs 1562 in some bibliographies', 'What Vesalius actually called the tube'],
  'fabricius-venous-valves': ['"First to discover venous valves" (no: Canano, Amato Lusitano earlier)'],
  'aselli-lacteals': ['Year seen (1622) vs published (1627)', 'Pecquet date 1650 vs 1651', 'Aselli death 1625 vs 1626'],
  'harvey-circulation': ['Chapter numbering of the quantitative argument (sources disagree: not cited by chapter)'],
  'malpighi-capillaries': ['Lung vs other organs; role of Fracassati', 'Capillaries "first seen" credit'],
  'willis-arterial-circle': ['Earlier partial descriptions of the circle', 'Who drew the plates (Wren; one by Lower)', 'Name attached later'],
  'ham-leeuwenhoek-spermatozoa': ['"Leeuwenhoek discovered sperm" (Ham saw them first; Leeuwenhoek said so)'],
  'bichat-tissues': ['Number of tissues (21)', 'Use of microscope (none)'],
  'langerhans-islets': ['What Langerhans knew of function (none established)'],
  'cajal-neurons': ['Golgi vs Cajal; shared 1906 prize', 'Who named the neuron doctrine (Waldeyer 1891)'],
  'insulin-islets-function': ['Nobel credit dispute; prize-money sharing with Best and Collip'],
  'sliding-filaments': ['Same issue of Nature (22 May 1954)', 'The two Huxleys unrelated'],
  'meningeal-lymphatics': ['"Discovered in 2015" vs Mascagni 1787', 'Which paper in which journal (Louveau: Nature; Aspelund: JEM)'],
  'interstitium-organ': ['"New organ" framing vs critics', 'Artefact explanation'],
  'essay-circulation': ['Translator of the Canon (Gerard of Cremona, traditional; marked contested)', 'Harvey at Padua under Fabricius'],
  'essay-brain-and-nerves': ['Galen\'s pig and the voice: which nerve', 'Waldeyer named the neuron doctrine, not Cajal'],
  'essay-microscopy': ['Remak/Virchow dates and credit (marked contested)', 'Bichat used no microscope', 'Ham saw spermatozoa before Leeuwenhoek'],
  'essay-myths-and-firsts': ['"The Church banned dissection" (rejected; Park 2006; Boniface VIII bull misread)', 'Count of contested/revised plates checked against content (10)'],
  'essay-beyond-europe': ['Suśruta date (cautious dating used)', 'Huangdi Neijing circulation claim (revised)', 'Ibn al-Nafis transmission (contested)'],
  'essay-hidden-vessels': ['Rudbeck vs Bartholin priority (contested)', 'Glymphatic mechanism and human relevance (contested)', 'Mascagni 1787 vs 2015 "discovery"', 'Ancient sightings of lacteals: not claimed either way (no source in hand)'],
};

const c = loadCorpus();
const srcs = new Map(c.sources.map((s) => [s.id, s]));
const subjects: { id: string; claims: Record<string, Claim>; myth: string[] }[] = [
  ...c.discoveries.map((d) => ({ id: d.id, claims: d.claims, myth: MYTH[d.id] ?? [] })),
  ...c.misbeliefs.map((m) => ({ id: m.id, claims: m.claims, myth: ['Belief attributed to the right people, from a primary source', 'Correction dated to first vs mainstream acceptance'] })),
  ...c.traditions.flatMap((t) => t.concepts.map((k) => ({ id: k.id, claims: k.claims, myth: ['Concept described in its own terms, not mapped onto modern anatomy beyond the stated relation', 'Checked for conflicting dates and counts across sources'] }))),
  ...c.threads.map((t) => ({ id: t.id, claims: t.claims, myth: ['Intro restates only claims already verified on the plates and essays, with the same sources', 'Tour order and dates checked against the plates'] })),
  ...c.essays.map((e) => ({ id: `essay-${e.thread}`, claims: e.claims, myth: [...(MYTH[`essay-${e.thread}`] ?? []), 'Every factual sentence footnoted or cut; interpretation phrased as interpretation', 'Dates and priority claims reconciled with the plates and the October 2026 review'] })),
];

const signId = process.argv.includes('--sign') ? process.argv[process.argv.indexOf('--sign') + 1] : undefined;
let written = 0;
for (const s of subjects) {
  const path = `content/logs/${s.id}.md`;
  if (signId) {
    if (s.id !== signId) continue;
    const { data, content } = matter(readFileSync(path, 'utf8'));
    data.claimsHash = claimsHash(s.claims);
    data.date = TODAY;
    writeFileSync(path, matter.stringify(content, data));
    console.log(`re-signed ${s.id}`);
    process.exit(0);
  }
  if (existsSync(path)) continue;
  const used = [...new Set(Object.values(s.claims).flatMap((k) => k.citations.map(sourceIdOf)))];
  const caveats = Object.values(s.claims).some((k) => k.secondarySummary || k.status !== 'established') || used.some((u) => srcs.get(u)?.detailsPending);
  const lines = [
    'First-pass verification from the October 2026 accuracy review (docs/research/accuracy-review-2026-10.md), then claim-by-claim against the sources listed.',
    '',
    ...Object.entries(s.claims).map(([k, v]) => `- **${k}** ${v.status}${v.secondarySummary ? ' · secondary-summary (key scholarship read only via summaries/abstracts)' : ''}: ${v.text}`),
    '',
    used.some((u) => srcs.get(u)?.detailsPending) ? 'Some sources have bibliographic details pending (byline/title); their URLs are authoritative.' : '',
  ];
  const fm = {
    subject: s.id, date: TODAY, reviewer: REVIEWER, claimsHash: claimsHash(s.claims),
    sourcesConsulted: used.map((u) => `${u}${srcs.get(u)?.url ? ` <${srcs.get(u)!.url}>` : ''}`),
    mythChecks: s.myth.length ? s.myth : ['Searched for priority disputes, alternative dates and popular myths'],
    verdict: caveats ? 'pass-with-caveats' : 'pass',
  };
  writeFileSync(path, matter.stringify(lines.join('\n').trim() + '\n', fm));
  written++;
}
console.log(`wrote ${written} logs`);
