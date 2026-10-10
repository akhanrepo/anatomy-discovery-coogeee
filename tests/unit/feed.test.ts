import { describe, it, expect } from 'vitest';
import { buildFeed } from '../../src/lib/feed';
import { emailIssue } from '../../src/lib/email';

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
  it('F15-AC2 [proxy] email issues are table-based, inline-styled, with a plate header image and live text, under Gmail\'s clip limit', () => {
    for (const w of [1, 21, 52]) {
      const { subject, html } = emailIssue(w, SITE);
      expect(subject).toMatch(/^Tabula: /);
      expect(html).toMatch(/<table role="presentation"/);
      expect(html).not.toMatch(/<style|<link rel="stylesheet"|class="/);
      expect(html).toMatch(/<img src="https:\/\/tabula.example\/og\/[a-z0-9-]+\.png" width="552" alt="[^"]+"/);
      expect(html).toMatch(/<a href="https:\/\/tabula.example\/[^"]+"[^>]*>[^<]{4,}<\/a>/);
      expect(html).toMatch(/unsubscribe_url/);
      expect(Buffer.byteLength(html)).toBeLessThan(100 * 1024);
    }
  });
});
