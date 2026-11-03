import { describe, it, expect } from 'vitest';
import { buildCorrectionUrl, buildCorrectionMailto } from '../../src/lib/corrections';
import { authenticityLabel, archiveUrl } from '../../src/lib/assets';

describe('corrections (F05)', () => {
  it('F05-AC3 a correction link arrives with the story and claim IDs prefilled', () => {
    const url = new URL(buildCorrectionUrl({ discoveryId: 'ibn-al-nafis-pulmonary-circulation', claimId: 'c2' }));
    expect(url.pathname).toMatch(/\/issues\/new$/);
    expect(url.searchParams.get('template')).toBe('correction.yml');
    expect(url.searchParams.get('title')).toContain('ibn-al-nafis-pulmonary-circulation#c2');
    expect(url.searchParams.get('story')).toBe('ibn-al-nafis-pulmonary-circulation');
    expect(url.searchParams.get('claim')).toBe('c2');
  });
  it('F05-AC3 offers an account-free email fallback with the IDs, only when an address is configured', () => {
    expect(decodeURIComponent(buildCorrectionMailto({ discoveryId: 'harvey', claimId: 'c1' }, 'fix@example.org')!)).toContain('harvey#c1');
    expect(buildCorrectionMailto({ discoveryId: 'harvey' }, '')).toBeNull();
  });
});

describe('assets (F06)', () => {
  it('F06-AC2 later depictions are labelled with their date', () => {
    expect(authenticityLabel({ authenticity: 'later-depiction', date: '19th c.' })).toBe('Later depiction, 19th c.');
    expect(authenticityLabel({ authenticity: 'contemporary', date: '1543' })).toBeUndefined();
  });
  it('derives an archive.org link for web sources', () => {
    expect(archiveUrl('https://example.org/a')).toBe('https://web.archive.org/web/2026/https://example.org/a');
  });
});
