import { describe, it, expect } from 'vitest';
import { runGates, type GateError } from '../../src/lib/content/gates';
import { loadCorpus } from '../../src/lib/content/load';
import { miniCorpus } from './fixtures';

const gates = (errs: GateError[]) => [...new Set(errs.filter((e) => e.gate !== 'balance').map((e) => e.gate))];

describe('content gates (F05, F06)', () => {
  it('passes a well-formed mini corpus (except balance, which needs the full set)', () => {
    expect(gates(runGates(miniCorpus()))).toEqual([]);
  });

  describe('F05-AC1 the build fails on each content violation', () => {
    it('F05-AC1 uncited claim', () => {
      const c = miniCorpus();
      c.discoveries[0].claims.c1.citations = [];
      expect(gates(runGates(c))).toContain('uncited-claim');
    });
    it('F05-AC1 contested claim without a note', () => {
      const c = miniCorpus();
      c.discoveries[0].claims.c1.status = 'contested';
      expect(gates(runGates(c))).toContain('contest-note');
    });
    it('F05-AC1 contested discovery without a note', () => {
      const c = miniCorpus();
      c.discoveries[0].status = 'contested';
      expect(runGates(c).some((e) => e.gate === 'contest-note' && e.subject === 'harvey-circulation')).toBe(true);
    });
    it('F05-AC1 dangling citation', () => {
      const c = miniCorpus();
      c.discoveries[0].claims.c1.citations = ['nope', 'scholar-a'];
      expect(gates(runGates(c))).toContain('dangling-citation');
    });
    it('F05-AC1 dangling footnote in the story body', () => {
      const c = miniCorpus();
      c.discoveries[0].body += ' [^c9]';
      expect(gates(runGates(c))).toContain('dangling-footnote');
    });
    it('F05-AC1 no scholarly source', () => {
      const c = miniCorpus();
      c.discoveries[0].claims.c1.citations = ['harvey-1628', 'galen-up'];
      expect(gates(runGates(c))).toContain('scholarly-source');
    });
    it('F05-AC1 tertiary sources do not count toward the two-source rule', () => {
      const c = miniCorpus();
      c.discoveries[0].claims.c1.citations = ['scholar-a', 'wiki'];
      expect(gates(runGates(c))).toContain('two-source-rule');
    });
    it('F05-AC1 missing verification log', () => {
      const c = miniCorpus();
      c.logs = c.logs.filter((l) => l.subject !== 'harvey-circulation');
      expect(gates(runGates(c))).toContain('verification-log');
    });
    it('F05-AC1 stale verification log after a claim edit', () => {
      const c = miniCorpus();
      c.discoveries[0].claims.c1.text = 'Harvey published De motu cordis in Frankfurt in 1628.';
      expect(gates(runGates(c))).toContain('stale-verification-log');
    });
    it('F05-AC1 misbelief belief claim without a primary source', () => {
      const c = miniCorpus();
      c.misbeliefs[0].claims.belief.citations = ['scholar-a', 'harvey-1628'];
      c.misbeliefs[0].claims.belief.citations = ['scholar-a'];
      expect(gates(runGates(c))).toContain('misbelief-primary');
    });
  });

  describe('F06-AC1 the build fails on asset problems', () => {
    it('F06-AC1 disallowed licence (NC)', () => {
      const c = miniCorpus();
      c.assets[0].licence = 'CC-BY-NC';
      expect(gates(runGates(c))).toContain('licence');
    });
    it('F06-AC1 share-alike is not allowed either', () => {
      const c = miniCorpus();
      c.assets[0].licence = 'CC-BY-SA';
      expect(gates(runGates(c))).toContain('licence');
    });
    it('F06-AC1 missing required asset fields are rejected by the loader schema', async () => {
      const { Asset } = await import('../../src/lib/content/schema');
      const { recordUrl: _r, ...noRecord } = miniCorpus().assets[0];
      expect(Asset.safeParse(noRecord).success).toBe(false);
      expect(Asset.safeParse({ ...miniCorpus().assets[0], altText: '' }).success).toBe(false);
      expect(Asset.safeParse({ ...miniCorpus().assets[0], credit: undefined }).success).toBe(false);
    });
  });

  it('the real corpus passes every gate', () => {
    const errors = runGates(loadCorpus());
    expect(errors.map((e) => `[${e.gate}] ${e.subject}: ${e.message}`)).toEqual([]);
  });
});
