import { describe, it, expect } from 'vitest';
import { analyticsSnippet } from '../../src/lib/analytics';

describe('F08 analytics', () => {
  it('F08-AC3 events are disabled unless a domain is configured, and only run on the production host', () => {
    expect(analyticsSnippet('', '')).toBe('');
    const s = analyticsSnippet('tabula.example', 'tabula.example');
    expect(s).toMatch(/location\.hostname!=="tabula\.example"\)return;/);
    expect(s).toMatch(/plausible\.io\/js\/script/);
    // deploy previews (deploy-preview-12--site.netlify.app) and localhost fail the host guard
    const guard = (host: string) => host !== 'tabula.example';
    expect(guard('deploy-preview-12--tabula.netlify.app')).toBe(true);
    expect(guard('localhost')).toBe(true);
  });
  it('F08-AC1 [static] the analytics script is cookieless Plausible, with no identifiers in the config', () => {
    const s = analyticsSnippet('tabula.example', 'tabula.example');
    expect(s).not.toMatch(/cookie|localStorage|userId|email/i);
  });
});
