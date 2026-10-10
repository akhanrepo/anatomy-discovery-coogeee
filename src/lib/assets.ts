import type { Asset } from './content/schema';

/** F06-AC2: later depictions must say so. */
export function authenticityLabel(a: Pick<Asset, 'authenticity' | 'date'>): string | undefined {
  if (a.authenticity === 'later-depiction') return `Later depiction, ${a.date}`;
  if (a.authenticity === 'ours') return 'Drawn for Tabula';
  return undefined;
}

export const archiveUrl = (url: string) => `https://web.archive.org/web/2026/${url}`;
