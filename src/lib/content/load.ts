import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import YAML from 'yaml';
import matter from 'gray-matter';
import { z } from 'zod';
import * as S from './schema';
import type { Corpus, Claim } from './schema';

export class ContentError extends Error {}

function readYaml(dir: string, file: string): unknown {
  const p = join(dir, file);
  if (!existsSync(p)) return [];
  return YAML.parse(readFileSync(p, 'utf8')) ?? [];
}

function parse<T extends z.ZodTypeAny>(schema: T, data: unknown, where: string): z.infer<T> {
  const r = schema.safeParse(data);
  if (!r.success) {
    const msg = r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new ContentError(`${where}: ${msg}`);
  }
  return r.data;
}

const list = <T extends z.ZodTypeAny>(schema: T, data: unknown, where: string) =>
  parse(z.array(schema), data, where);

function mdFiles(dir: string): string[] {
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.md')).sort() : [];
}

/** Stable hash of a subject's claims; verification logs must match it (F05 staleness gate). */
export function claimsHash(claims: Record<string, Claim>): string {
  const canon = Object.keys(claims)
    .sort()
    .map((k) => `${k}|${claims[k].text}|${[...claims[k].citations].sort().join(',')}|${claims[k].status}`)
    .join('\n');
  return createHash('sha256').update(canon).digest('hex').slice(0, 16);
}

export function loadCorpus(root = resolve(process.cwd(), 'content')): Corpus {
  const discoveries = mdFiles(join(root, 'discoveries')).map((f) => {
    const { data, content } = matter(readFileSync(join(root, 'discoveries', f), 'utf8'));
    return parse(S.Discovery, { ...data, body: content.trim() }, `discoveries/${f}`);
  });
  const logs = mdFiles(join(root, 'logs')).map((f) => {
    const { data, content } = matter(readFileSync(join(root, 'logs', f), 'utf8'));
    return parse(S.VerificationLog, { ...data, notes: content.trim() }, `logs/${f}`);
  });
  return {
    structures: list(S.Structure, readYaml(root, 'structures.yaml'), 'structures.yaml'),
    people: list(S.Person, readYaml(root, 'people.yaml'), 'people.yaml'),
    sources: list(S.Source, readYaml(root, 'sources.yaml'), 'sources.yaml'),
    misbeliefs: list(S.Misbelief, readYaml(root, 'misbeliefs.yaml'), 'misbeliefs.yaml'),
    eras: list(S.Era, readYaml(root, 'eras.yaml'), 'eras.yaml').sort((a, b) => a.yearStart - b.yearStart),
    threads: list(S.Thread, readYaml(root, 'threads.yaml'), 'threads.yaml'),
    assets: list(S.Asset, readYaml(root, 'assets.yaml'), 'assets.yaml'),
    traditions: list(S.Tradition, readYaml(root, 'traditions.yaml'), 'traditions.yaml'),
    shareDates: list(S.ShareDate, readYaml(root, 'share-dates.yaml'), 'share-dates.yaml'),
    corrections: list(S.Correction, readYaml(root, 'corrections.yaml'), 'corrections.yaml'),
    calendar: parse(z.array(z.string()), readYaml(root, 'calendar.yaml'), 'calendar.yaml'),
    discoveries: discoveries.sort((a, b) => a.yearStart - b.yearStart),
    logs,
  };
}

let cached: Corpus | undefined;
/** Memoised corpus for Astro pages (content doesn't change during a build). */
export function corpus(): Corpus {
  return (cached ??= loadCorpus());
}
