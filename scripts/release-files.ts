// Prints the files a release publishes, one path per line, and fails if any is missing (F18).
// The list comes from src/lib/downloads.ts, the same list the site links to. Used by .github/workflows/release.yml.
import { existsSync } from 'node:fs';
import { allDownloadFiles, artefactPath } from '../src/lib/downloads';

const paths = allDownloadFiles().map(artefactPath);
const missing = paths.filter((p) => !existsSync(p));
if (missing.length) {
  console.error(`Missing artefacts (run \`npm run build && npm run artefacts\`):\n${missing.join('\n')}`);
  process.exit(1);
}
console.log(paths.join('\n'));
