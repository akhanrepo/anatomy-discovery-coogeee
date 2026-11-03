import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';
import { site } from '../../src/config/site';
import { PACKS } from '../../src/lib/packs';
import { allDownloadFiles, artefactPath, downloadUrl, packFile, EDITION_FILES, PAPER_FORMATS } from '../../src/lib/downloads';
import { buildCorrectionUrl, CORRECTION_FORM } from '../../src/lib/corrections';
import { buildEdition, editionMarkdown } from '../../src/lib/edition';
import { loadCorpus } from '../../src/lib/content/load';
import { CHROMIUM_CANDIDATES } from '../../scripts/chromium.mjs';

const read = (p: string) => readFileSync(p, 'utf8');
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const REPO = 'https://github.com/akhanrepo/tabula';

describe('F18 open-source release', () => {
  it('F18-AC1 no commerce remains: no buy buttons, prices, checkout or merchant copy in src/', () => {
    expect(existsSync('src/components/BuyButton.astro')).toBe(false);
    expect(site).not.toHaveProperty('commerce');
    const offenders = walk('src')
      .filter((f) => /\.(astro|ts|css)$/.test(f))
      .flatMap((f) => {
        const src = read(f);
        return [/BuyButton/, /checkout/i, /A\$\s?\d/, /merchant of record/i, /Lemon ?Squeezy/i, /school licence/i, /\bpurchas/i, /\.btn\.buy\b/]
          .filter((re) => re.test(src))
          .map((re) => `${f}: ${re}`);
      });
    expect(offenders).toEqual([]);
  });

  it('F18-AC2 site links, artefacts script and release workflow share one download list', () => {
    // one list: every pack in both paper sizes, plus the edition in both formats
    const files = allDownloadFiles();
    expect(files).toHaveLength(PACKS.length * PAPER_FORMATS.length + 2);
    expect(new Set(files).size).toBe(files.length);
    for (const p of PACKS) for (const f of PAPER_FORMATS) expect(files).toContain(packFile(p.id, f));
    expect(files).toEqual(expect.arrayContaining([EDITION_FILES.epub, EDITION_FILES.pdf]));
    // stable names (no content hash), so releases/latest/download/<file> always resolves
    for (const f of files) expect(f).toMatch(/^tabula-[a-z0-9-]+\.(pdf|epub)$/);
    expect(downloadUrl('x.pdf')).toBe(`${REPO}/releases/latest/download/x.pdf`);
    // the artefacts script writes exactly these names, via the same helpers
    const script = read('scripts/build-artefacts.ts');
    expect(script).toMatch(/from '\.\.\/src\/lib\/downloads'/);
    expect(script).toMatch(/artefactPath\(packFile\(p\.id, format\)\)/);
    expect(script).toMatch(/artefactPath\(EDITION_FILES\.epub\)/);
    expect(script).toMatch(/artefactPath\(EDITION_FILES\.pdf\)/);
    expect(new Set(files.map(artefactPath)).size).toBe(files.length);
    // the release publishes the list (release-files.ts reads allDownloadFiles and fails on a missing file)
    expect(read('scripts/release-files.ts')).toMatch(/allDownloadFiles\(\)\.map\(artefactPath\)/);
    expect(read('.github/workflows/release.yml')).toMatch(/npx tsx scripts\/release-files\.ts/);
    // the pages link through the same helpers
    expect(read('src/pages/teachers.astro')).toMatch(/packFile\(p\.def\.id, 'A4'\)[\s\S]*packFile\(p\.def\.id, 'Letter'\)/);
    expect(read('src/pages/edition/index.astro')).toMatch(/EDITION_FILES\.epub[\s\S]*EDITION_FILES\.pdf/);
    expect(read('src/components/DownloadLink.astro')).toMatch(/downloadUrl\(file\)/);
  });

  it('F18-AC3 licences are explicit and consistent', () => {
    const mit = read('LICENSE');
    expect(mit).toMatch(/^MIT License\n\nCopyright \(c\) 2026 Ali Khan/);
    expect(mit).toContain('Permission is hereby granted, free of charge');
    const cc = read('LICENSE-CONTENT');
    expect(cc.split('\n')[0]).toBe('Attribution-ShareAlike 4.0 International');
    expect(cc.replace(/\s+/g, ' ')).toContain('Creative Commons Attribution-ShareAlike 4.0 International Public License');
    expect(cc).toContain('Section 8 -- Interpretation.'); // the whole legal code, not an excerpt
    expect(JSON.parse(read('package.json')).license).toBe('MIT');
    expect(site.licences.code.name).toBe('MIT');
    expect(site.licences.content).toEqual({ name: 'CC BY-SA 4.0', url: 'https://creativecommons.org/licenses/by-sa/4.0/' });
    const readme = read('README.md');
    expect(readme).toMatch(/^## Licence$/m);
    expect(readme).toMatch(/\| \*\*Code\*\*.*\[MIT\]\(LICENSE\)/);
    expect(readme).toMatch(/\*\*Written content\*\*.*\[CC BY-SA 4\.0\]\(LICENSE-CONTENT\)/);
    expect(read('src/layouts/Layout.astro')).toMatch(/data-testid="licence"[\s\S]*site\.licences\.content[\s\S]*site\.licences\.code/);
    expect(read('src/pages/packs/[id]/print.astro')).toMatch(/data-testid="pack-licence">Licence: \{site\.licences\.content\.name\}/);
    const md = editionMarkdown(buildEdition(loadCorpus()));
    expect(md).toMatch(/^rights: ".*CC BY-SA 4\.0/m);
    expect(md.split('\n# ')[0]).toContain('CC BY-SA 4.0');
  });

  it('F18-AC4 the repository has the open-source project files', () => {
    const files = [
      'README.md', 'LICENSE', 'LICENSE-CONTENT', 'CONTRIBUTING.md', 'CODE_OF_CONDUCT.md', 'SECURITY.md', 'CHANGELOG.md',
      'THIRD_PARTY_NOTICES.md', 'docs/architecture.md', '.editorconfig', '.nvmrc',
      '.github/ISSUE_TEMPLATE/config.yml', '.github/ISSUE_TEMPLATE/bug_report.yml', '.github/ISSUE_TEMPLATE/correction.yml',
      '.github/ISSUE_TEMPLATE/discovery.yml', '.github/ISSUE_TEMPLATE/feature_request.yml', '.github/pull_request_template.md',
      '.github/CODEOWNERS', '.github/dependabot.yml', '.github/workflows/ci.yml', '.github/workflows/codeql.yml', '.github/workflows/release.yml',
    ];
    expect(files.filter((f) => !existsSync(f))).toEqual([]);
    const readme = read('README.md');
    for (const h of ['## Why Tabula', '## Features', '## Accuracy is a build gate', '## Quick start', '## How it works', '## Contributing', '## Licence'])
      expect(readme, h).toContain(h);
    // every issue form parses and has a name, a description and a body; blank issues are off
    for (const f of readdirSync('.github/ISSUE_TEMPLATE').filter((x) => x !== 'config.yml')) {
      const form = YAML.parse(read(`.github/ISSUE_TEMPLATE/${f}`));
      expect(form.name, f).toBeTruthy();
      expect(form.description, f).toBeTruthy();
      expect(Array.isArray(form.body) && form.body.length > 0, f).toBe(true);
    }
    expect(YAML.parse(read('.github/ISSUE_TEMPLATE/config.yml')).blank_issues_enabled).toBe(false);
    const dependabot = YAML.parse(read('.github/dependabot.yml'));
    expect(dependabot.updates.map((u: { 'package-ecosystem': string }) => u['package-ecosystem']).sort()).toEqual(['github-actions', 'npm']);
    expect(read('.github/workflows/codeql.yml')).toMatch(/javascript-typescript/);
    expect(read('CODE_OF_CONDUCT.md')).toContain('Contributor Covenant, version 2.1');
    expect(read('SECURITY.md')).toContain(`${REPO}/security/advisories/new`);
    expect(read('CHANGELOG.md')).toMatch(new RegExp(`^## \\[${JSON.parse(read('package.json')).version.replace(/\./g, '\\.')}\\]`, 'm'));
  });

  it('F18-AC5 no placeholder emails or stale repository links ship', () => {
    expect(site.repo).toBe(REPO);
    expect(site.contactEmail).not.toMatch(/\.example\b/);
    const shipped = [
      ...walk('src'), ...walk('scripts'), ...walk('.github'), 'package.json', 'netlify.toml', 'astro.config.mjs',
      'README.md', 'CONTRIBUTING.md', 'SECURITY.md', 'CODE_OF_CONDUCT.md', 'CHANGELOG.md', 'THIRD_PARTY_NOTICES.md', 'CLAUDE.md', 'docs/architecture.md',
    ];
    const stale = shipped.filter((f) => /anatomy-discovery-coogeee|@[a-z0-9.-]+\.example\b/i.test(read(f)));
    expect(stale).toEqual([]);
    const repoLinks = shipped.flatMap((f) => [...read(f).matchAll(/github\.com\/akhanrepo\/([a-z0-9._-]+)/gi)].map((m) => `${f}: ${m[1]}`));
    expect(repoLinks.length).toBeGreaterThan(10);
    expect(repoLinks.filter((l) => !/: tabula(\.git)?$/.test(l))).toEqual([]);
  });

  it('F18-AC6 correction links open the correction issue form prefilled', () => {
    const url = new URL(buildCorrectionUrl({ discoveryId: 'harvey-circulation', claimId: 'c2', title: 'The blood goes round' }));
    expect(`${url.origin}${url.pathname}`).toBe(`${REPO}/issues/new`);
    expect(url.searchParams.get('template')).toBe(CORRECTION_FORM);
    const form = YAML.parse(read(`.github/ISSUE_TEMPLATE/${CORRECTION_FORM}`));
    expect(form.labels).toEqual(['correction']);
    const ids = form.body.map((b: { id?: string }) => b.id).filter(Boolean);
    // every prefilled parameter (other than template/title) names a field in the form
    for (const [k, v] of url.searchParams) if (!['template', 'title'].includes(k)) expect(ids, k).toContain(k);
    expect(url.searchParams.get('story')).toBe('harvey-circulation');
    expect(url.searchParams.get('claim')).toBe('c2');
    expect(read('src/pages/corrections.astro')).toContain('issues/new?template=correction.yml');
  });

  it('F18-AC7 CI runs lint, unit, build and e2e on pushes and PRs; tags publish a release', () => {
    const ci = YAML.parse(read('.github/workflows/ci.yml'));
    expect(ci.on.push.branches).toEqual(['main']);
    expect(ci.on).toHaveProperty('pull_request');
    const runs = ci.jobs.test.steps.map((s: { run?: string }) => s.run).filter(Boolean);
    expect(runs).toEqual(expect.arrayContaining(['npm ci', 'npm run lint', 'npm test', 'npm run build', 'npm run test:e2e']));
    expect(runs.indexOf('npm run build')).toBeLessThan(runs.indexOf('npm run test:e2e'));
    expect(ci.jobs.test['continue-on-error']).toBeUndefined();
    const rel = YAML.parse(read('.github/workflows/release.yml'));
    expect(rel.on.push.tags).toEqual(['v*.*.*']);
    expect(rel.permissions.contents).toBe('write');
    const relRuns = rel.jobs.release.steps.map((s: { run?: string }) => s.run ?? '').join('\n');
    expect(relRuns).toMatch(/require\('\.\/package\.json'\)\.version/);
    for (const cmd of ['npm test', 'npm run build', 'npm run artefacts', 'pandoc', 'gh release create']) expect(relRuns, cmd).toContain(cmd);
    expect(read('.nvmrc').trim()).toBe(JSON.parse(read('package.json')).engines.node.replace(/^>=/, ''));
  });

  it('F18-AC8 third-party notices name every production dependency and its licence', () => {
    const notices = read('THIRD_PARTY_NOTICES.md');
    for (const dep of Object.keys(JSON.parse(read('package.json')).dependencies)) {
      expect(notices, dep).toContain(`\`${dep.startsWith('@fontsource/') ? '@fontsource/' : dep}`);
      const licence = JSON.parse(read(`node_modules/${dep}/package.json`)).license as string;
      expect(notices, `${dep} ${licence}`).toContain(licence);
    }
  });

  it('F18-AC9 Chromium is found without version-pinned paths', () => {
    expect(CHROMIUM_CANDIDATES).toEqual([process.env.PLAYWRIGHT_CHROMIUM_PATH, '/opt/pw-browsers/chromium']);
    for (const f of ['playwright.config.ts', 'scripts/build-artefacts.ts']) {
      const src = read(f);
      expect(src, f).toMatch(/chromiumExecutable\(\)/);
      expect(src, f).not.toMatch(/chromium-\d{3,}/);
    }
  });
});
