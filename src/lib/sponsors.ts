import { existsSync } from 'node:fs';
import { site } from '../config/site';
/** F14-AC4: sponsors may only appear once the editorial-independence policy page is published. */
export function sponsorsVisible(policyPage = 'src/pages/support.astro'): typeof site.sponsors {
  if (!existsSync(policyPage)) return [];
  return site.sponsors;
}
