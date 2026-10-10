// Design-token lint (F09-AC3, F16): no raw hex colours outside the token files, and vermilion only for misbeliefs.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export function lintTokens(root = 'src'): string[] {
  const files: string[] = [];
  const walk = (d: string) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : files.push(p); });
  walk(root);
  const errors: string[] = [];
  const TOKEN_FILES = ['src/styles/global.css', 'src/styles/tokens.ts'];
  for (const f of files.filter((x) => /\.(astro|ts|css)$/.test(x))) {
    const src = readFileSync(f, 'utf8');
    if (!TOKEN_FILES.includes(f)) {
      for (const m of src.matchAll(/#[0-9a-fA-F]{3,8}\b(?![\w-]*["'`]?\s*[:=]\s*\{)/g)) {
        const line = src.slice(0, m.index).split('\n').length;
        const ctx = src.split('\n')[line - 1];
        if (/stop-color="#(fff|000)"/.test(ctx) || /href=|url\(#|id=|#[a-z]-/.test(ctx) && !/#[0-9a-fA-F]{6}/.test(ctx)) continue;
        errors.push(`${f}:${line} raw colour ${m[0]} (use a token)`);
      }
    }
    for (const m of src.matchAll(/var\(--vermilion\)/g)) {
      const line = src.slice(0, m.index).split('\n').length;
      const ctx = src.split('\n')[line - 1];
      if (!/\.mb\b|misbelief|--vermilion\s*:/.test(ctx)) errors.push(`${f}:${line} --vermilion used outside misbelief styles`);
    }
  }
  return errors;
}

if (process.argv[1]?.endsWith('lint-tokens.ts')) {
  const e = lintTokens();
  if (e.length) { console.error(e.join('\n')); process.exit(1); }
  console.log('✓ token lint clean');
}
