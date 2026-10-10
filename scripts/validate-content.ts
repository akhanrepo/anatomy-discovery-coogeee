import { loadCorpus, ContentError } from '../src/lib/content/load';
import { runGates } from '../src/lib/content/gates';

try {
  const c = loadCorpus();
  const errors = runGates(c);
  if (errors.length) {
    console.error(`✗ ${errors.length} content gate error(s):`);
    for (const e of errors) console.error(`  [${e.gate}] ${e.subject}: ${e.message}`);
    process.exit(1);
  }
  console.log(`✓ content valid: ${c.discoveries.length} discoveries, ${c.misbeliefs.length} misbeliefs, ${c.traditions.length} lenses, ${c.sources.length} sources`);
} catch (e) {
  if (e instanceof ContentError) { console.error(`✗ ${e.message}`); process.exit(1); }
  throw e;
}
