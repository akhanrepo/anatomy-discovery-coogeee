// Prints the CHANGELOG.md section for one version (used as the GitHub Release notes).
// Usage: node scripts/release-notes.mjs 1.0.0
import { readFileSync } from 'node:fs';

const version = process.argv[2];
if (!version) { console.error('Usage: node scripts/release-notes.mjs <version>'); process.exit(1); }
const lines = readFileSync('CHANGELOG.md', 'utf8').split('\n');
const start = lines.findIndex((l) => l.startsWith(`## [${version}]`));
if (start < 0) { console.error(`CHANGELOG.md has no "## [${version}]" section.`); process.exit(1); }
const end = lines.findIndex((l, i) => i > start && l.startsWith('## ['));
console.log(lines.slice(start + 1, end < 0 ? undefined : end).join('\n').trim());
