import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { buildFeed } from '../../src/lib/feed';
import { site } from '../../src/config/site';

const SITE = 'https://tabula.example';

describe('F15 subscription', () => {
  const xml = buildFeed(SITE, 2026);
  it('F15-AC1 [proxy] the RSS feed is well-formed RSS 2.0 with the required elements', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toMatch(/<rss version="2.0"/);
    for (const tag of ['title', 'link', 'description']) expect(xml).toMatch(new RegExp(`<channel>[\\s\\S]*<${tag}>`));
    expect(xml).toMatch(/<atom:link href="https:\/\/tabula.example\/feed.xml" rel="self"/);
    // balanced tags (cheap well-formedness check) and escaped ampersands
    for (const tag of ['item', 'channel', 'rss', 'title', 'link', 'guid', 'pubDate', 'description']) {
      expect((xml.match(new RegExp(`<${tag}[ >]`, 'g')) ?? []).length, tag).toBe((xml.match(new RegExp(`</${tag}>`, 'g')) ?? []).length);
    }
    expect(xml).not.toMatch(/&(?!amp;|lt;|gt;|quot;|#)/);
    const dates = [...xml.matchAll(/<pubDate>(.+?)<\/pubDate>/g)].map((m) => m[1]);
    expect(dates.length).toBeGreaterThan(5);
    for (const d of dates) expect(d).toMatch(/^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/);
    const guids = [...xml.matchAll(/<guid[^>]*>(.+?)<\/guid>/g)].map((m) => m[1]);
    expect(new Set(guids).size).toBe(guids.length);
  });
  it('subscription is RSS only: no email signup, Buttondown config or email issues remain', () => {
    expect(site).not.toHaveProperty('email');
    expect(existsSync('src/lib/email.ts')).toBe(false);
    const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
    const offenders = [...walk('src'), ...walk('scripts')].filter((f) => /buttondown|type="email"|emailIssue|BUTTONDOWN/i.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
    expect(readFileSync('src/components/Subscribe.astro', 'utf8')).toMatch(/href="\/feed\.xml" data-subscribe-rss/);
  });
});
