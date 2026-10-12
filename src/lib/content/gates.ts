import type { Corpus, Claim, Source } from './schema';
import { LICENCES, NON_EUROPEAN } from './schema';
import { claimsHash } from './load';

export interface GateError {
  gate: string;
  subject: string;
  message: string;
}

export const sourceIdOf = (ref: string) => ref.split(':')[0];
export const locatorOf = (ref: string) => (ref.includes(':') ? ref.slice(ref.indexOf(':') + 1) : undefined);

const counts = (s: Source | undefined) => !!s && s.type !== 'tertiary';
const isScholarly = (s: Source | undefined) => !!s && s.type === 'secondary' && s.scholarly;

export const BALANCE = { pre1500: 8, nonEuropean: 5, post1900: 4, contestedOrRevised: 6, systems: 7 } as const;
export const WORDS = { min: 150, max: 300 } as const;

export function wordCount(md: string): number {
  return md.replace(/\[\^[^\]]+\]/g, '').split(/\s+/).filter((w) => /[A-Za-zÀ-ɏ]/.test(w)).length;
}

/** Every content rule from F04/F05/F06/F07/F09/F10 as a named gate. Empty array = publishable. */
export function runGates(c: Corpus): GateError[] {
  const errors: GateError[] = [];
  const err = (gate: string, subject: string, message: string) => errors.push({ gate, subject, message });
  const src = new Map(c.sources.map((s) => [s.id, s]));
  const has = (arr: { id: string }[]) => new Set(arr.map((x) => x.id));
  const structures = has(c.structures);
  const people = has(c.people);
  const assets = has(c.assets);
  const misbeliefs = has(c.misbeliefs);
  const discoveries = has(c.discoveries);
  const threads = has(c.threads);
  const concepts = c.traditions.flatMap((t) => t.concepts);
  const logs = new Map(c.logs.map((l) => [l.subject, l]));

  const checkClaims = (subject: string, claims: Record<string, Claim>) => {
    for (const [key, claim] of Object.entries(claims)) {
      const where = `${subject}#${key}`;
      if (claim.citations.length === 0) err('uncited-claim', where, 'claim has no citation');
      const ids = [...new Set(claim.citations.map(sourceIdOf))];
      for (const sid of ids) if (!src.has(sid)) err('dangling-citation', where, `unknown source "${sid}"`);
      const counting = ids.filter((sid) => counts(src.get(sid)));
      if (counting.length < 2) err('two-source-rule', where, `needs ≥2 primary/secondary sources, has ${counting.length}`);
      if (!ids.some((sid) => isScholarly(src.get(sid)))) err('scholarly-source', where, 'needs ≥1 scholarly secondary source');
      if (claim.status !== 'established' && !claim.contestNote) err('contest-note', where, `${claim.status} claim needs a contestNote`);
    }
  };

  const checkLog = (subject: string, claims: Record<string, Claim>) => {
    const log = logs.get(subject);
    if (!log) return err('verification-log', subject, 'missing verification log');
    if (log.claimsHash !== claimsHash(claims)) err('stale-verification-log', subject, 'claims changed since verification; re-verify and update claimsHash');
  };

  // F04 / F05: discoveries
  const plates = new Set<string>();
  for (const d of c.discoveries) {
    if (plates.has(d.plate)) err('unique-plate', d.id, `duplicate plate ${d.plate}`);
    plates.add(d.plate);
    d.structures.forEach((s) => structures.has(s) || err('ref', d.id, `unknown structure "${s}"`));
    d.people.forEach((p) => people.has(p) || err('ref', d.id, `unknown person "${p}"`));
    d.assets.forEach((a) => assets.has(a) || err('ref', d.id, `unknown asset "${a}"`));
    d.corrects.forEach((m) => misbeliefs.has(m) || err('ref', d.id, `unknown misbelief "${m}"`));
    d.threads.forEach((t) => threads.has(t) || err('ref', d.id, `unknown thread "${t}"`));
    if (d.status !== 'established' && !d.contestNote) err('contest-note', d.id, `${d.status} discovery needs a contestNote`);
    for (const m of d.body.matchAll(/\[\^([^\]]+)\]/g)) {
      if (!d.claims[m[1]]) err('dangling-footnote', d.id, `footnote [^${m[1]}] has no claim`);
    }
    const words = wordCount(d.body);
    if (words < WORDS.min || words > WORDS.max) err('story-length', d.id, `story is ${words} words (want ${WORDS.min}–${WORDS.max})`);
    checkClaims(d.id, d.claims);
    checkLog(d.id, d.claims);
  }

  // F09: misbeliefs
  for (const m of c.misbeliefs) {
    m.heldBy.forEach((p) => people.has(p) || err('ref', m.id, `unknown person "${p}"`));
    m.structures.forEach((s) => structures.has(s) || err('ref', m.id, `unknown structure "${s}"`));
    m.corrections.forEach((k) => k.discovery && !discoveries.has(k.discovery) && err('ref', m.id, `unknown discovery "${k.discovery}"`));
    if (!m.corrections.some((k) => k.scope === 'mainstream')) err('misbelief-mainstream', m.id, 'needs a mainstream correction');
    const belief = m.claims[m.beliefClaim];
    const correction = m.claims[m.correctionClaim];
    if (!belief || !belief.citations.some((r) => src.get(sourceIdOf(r))?.type === 'primary'))
      err('misbelief-primary', m.id, 'belief claim must cite a primary source');
    if (!correction || !correction.citations.some((r) => isScholarly(src.get(sourceIdOf(r)))))
      err('misbelief-scholarly', m.id, 'correction claim must cite a scholarly source');
    checkClaims(m.id, m.claims);
    checkLog(m.id, m.claims);
  }

  // F11: threads
  for (const t of c.threads) {
    t.discoveries.forEach((d) => discoveries.has(d) || err('ref', t.id, `unknown discovery "${d}"`));
    checkClaims(t.id, t.claims);
    if (Object.keys(t.claims).length) checkLog(t.id, t.claims);
  }

  // F14: edition essays (same rules as stories; subject id = essay-<thread>)
  for (const e of c.essays ?? []) {
    const subject = `essay-${e.thread}`;
    if (!threads.has(e.thread)) err('ref', subject, `unknown thread "${e.thread}"`);
    for (const m of e.body.matchAll(/\[\^([^\]]+)\]/g)) if (!e.claims[m[1]]) err('dangling-footnote', subject, `footnote [^${m[1]}] has no claim`);
    checkClaims(subject, e.claims);
    checkLog(subject, e.claims);
  }

  // F10: traditions
  for (const t of c.traditions) {
    if (!assets.has(t.plateAsset)) err('ref', t.id, `unknown plate asset "${t.plateAsset}"`);
    if (t.concepts.length < 6) err('lens-concepts', t.id, `needs ≥6 concepts, has ${t.concepts.length}`);
    for (const k of t.concepts) {
      k.relatesTo.forEach((r) => r.structure && !structures.has(r.structure) && err('ref', k.id, `unknown structure "${r.structure}"`));
      const specialist = Object.values(k.claims).every((cl) =>
        cl.citations.some((r) => isScholarly(src.get(sourceIdOf(r))) && !!locatorOf(r)),
      );
      if (!specialist) err('lens-specialist-source', k.id, 'every concept claim needs a scholarly source with a locator');
      checkClaims(k.id, k.claims);
      checkLog(k.id, k.claims);
    }
  }

  // F06: assets
  for (const a of c.assets) {
    if (!(LICENCES as readonly string[]).includes(a.licence)) err('licence', a.id, `licence "${a.licence}" not allowed`);
  }

  // F07: share dates
  for (const s of c.shareDates) {
    if (!discoveries.has(s.discovery)) err('ref', `share-date:${s.discovery}`, 'unknown discovery');
    if (!src.has(sourceIdOf(s.citation))) err('dangling-citation', `share-date:${s.discovery}`, `unknown source "${s.citation}"`);
  }

  // F07: calendar slots resolve
  const calendarIds = new Set([...discoveries, ...misbeliefs, ...concepts.map((k) => k.id)]);
  c.calendar.forEach((slot, i) => calendarIds.has(slot) || err('ref', `calendar[${i}]`, `unknown subject "${slot}"`));
  if (c.calendar.length && c.calendar.length !== 52) err('calendar', 'calendar', `needs 52 weekly slots, has ${c.calendar.length}`);

  // logs must point at something real
  const subjects = new Set([...discoveries, ...misbeliefs, ...threads, ...concepts.map((k) => k.id), ...(c.essays ?? []).map((e) => `essay-${e.thread}`)]);
  for (const l of c.logs) if (!subjects.has(l.subject)) err('ref', `log:${l.subject}`, 'log for unknown subject');

  // F04: balance targets
  if (c.discoveries.length) {
    const b = balance(c);
    if (b.pre1500 < BALANCE.pre1500) err('balance', 'pre1500', `${b.pre1500} < ${BALANCE.pre1500}`);
    if (b.nonEuropean < BALANCE.nonEuropean) err('balance', 'nonEuropean', `${b.nonEuropean} < ${BALANCE.nonEuropean}`);
    if (b.post1900 < BALANCE.post1900) err('balance', 'post1900', `${b.post1900} < ${BALANCE.post1900}`);
    if (b.contestedOrRevised < BALANCE.contestedOrRevised) err('balance', 'contested', `${b.contestedOrRevised} < ${BALANCE.contestedOrRevised}`);
    if (b.systems < BALANCE.systems) err('balance', 'systems', `${b.systems} < ${BALANCE.systems}`);
  }
  return errors;
}

export function balance(c: Corpus) {
  const sys = new Map(c.structures.map((s) => [s.id, s.system]));
  return {
    pre1500: c.discoveries.filter((d) => d.yearStart < 1500).length,
    nonEuropean: c.discoveries.filter((d) => NON_EUROPEAN.includes(d.tradition)).length,
    post1900: c.discoveries.filter((d) => d.yearStart >= 1900).length,
    contestedOrRevised: c.discoveries.filter((d) => d.status !== 'established').length,
    systems: new Set(c.discoveries.flatMap((d) => d.structures.map((s) => sys.get(s))).filter((s) => s && s !== 'general')).size,
  };
}
