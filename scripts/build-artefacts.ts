// Builds the paid/delivered artefacts from content (F12, F14, F15): classroom-pack PDFs (A4 + Letter), the edition
// (EPUB via pandoc, PDF via Chromium), and weekly email issues. Requires `npm run build` first.
// Outputs go to artefacts/ (not deployed); the free sample pack is copied to public/packs/sample.pdf.
import { mkdirSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { spawn, execFileSync } from 'node:child_process';
import { chromium } from '@playwright/test';
import { loadCorpus } from '../src/lib/content/load';
import { PACKS } from '../src/lib/packs';
import { buildEdition, editionMarkdown } from '../src/lib/edition';
import { emailIssue } from '../src/lib/email';

if (!existsSync('dist/index.html')) { console.error('Run `npm run build` first.'); process.exit(1); }
const PORT = 4329;
const SITE = process.env.SITE_URL ?? 'https://tabula-anatomy.netlify.app';
for (const d of ['artefacts/packs', 'artefacts/edition', 'artefacts/email', 'public/packs']) mkdirSync(d, { recursive: true });

const server = spawn('node', ['scripts/serve.mjs'], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 600));
const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', process.env.PLAYWRIGHT_CHROMIUM_PATH].find((p) => p && existsSync(p));
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
try {
  const page = await browser.newPage();
  for (const p of PACKS) {
    await page.goto(`http://127.0.0.1:${PORT}/packs/${p.id}/print/`, { waitUntil: 'networkidle' });
    for (const format of ['A4', 'Letter'] as const) {
      const out = `artefacts/packs/${p.id}-${format.toLowerCase()}.pdf`;
      await page.pdf({ path: out, format, printBackground: true });
      console.log(`✓ ${out}`);
    }
  }
  copyFileSync('artefacts/packs/sample-a4.pdf', 'public/packs/sample.pdf');

  const c = loadCorpus();
  const e = buildEdition(c);
  writeFileSync('artefacts/edition/tabula-edition.md', editionMarkdown(e));
  execFileSync('pandoc', ['artefacts/edition/tabula-edition.md', '-o', `artefacts/edition/tabula-edition-${e.version}.epub`, '--toc', '--metadata', `title=${e.title}`]);
  execFileSync('pandoc', ['artefacts/edition/tabula-edition.md', '-s', '-o', 'artefacts/edition/tabula-edition.html', '--toc', '--metadata', `title=${e.title}`, '-c', 'data:text/css,body{font-family:Georgia,serif;max-width:40em;margin:auto;line-height:1.5}']);
  await page.goto(`file://${process.cwd()}/artefacts/edition/tabula-edition.html`);
  await page.pdf({ path: `artefacts/edition/tabula-edition-${e.version}.pdf`, format: 'A4', printBackground: true, margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' } });
  console.log(`✓ edition ${e.version} (EPUB + PDF)`);

  for (let w = 1; w <= c.calendar.length; w++) {
    const { subject, html } = emailIssue(w, SITE);
    writeFileSync(`artefacts/email/week-${String(w).padStart(2, '0')}.html`, `<!-- subject: ${subject} -->\n${html}`);
  }
  console.log(`✓ ${c.calendar.length} email issues`);
} finally {
  await browser.close();
  server.kill();
}
