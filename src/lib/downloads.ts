/** F18: the one list of downloadable files. `npm run artefacts` writes these names, the release workflow publishes
 * them as GitHub Release assets, and the site links to the latest release. Names are stable (the content version is
 * printed inside each file), so `releases/latest/download/<file>` always resolves to the newest build. */
import { site } from '../config/site';
import { PACKS } from './packs';

export type PaperFormat = 'A4' | 'Letter';
export const PAPER_FORMATS: readonly PaperFormat[] = ['A4', 'Letter'];

export const packFile = (id: string, format: PaperFormat) => `tabula-pack-${id}-${format.toLowerCase()}.pdf`;
export const EDITION_FILES = { epub: 'tabula-edition.epub', pdf: 'tabula-edition.pdf' } as const;

/** Every file a release must carry, in a stable order. */
export function allDownloadFiles(): string[] {
  return [...PACKS.flatMap((p) => PAPER_FORMATS.map((f) => packFile(p.id, f))), EDITION_FILES.epub, EDITION_FILES.pdf];
}

/** Where `npm run artefacts` writes a download file, relative to the repository root. */
export const artefactPath = (file: string) => `artefacts/${file.startsWith('tabula-pack-') ? 'packs' : 'edition'}/${file}`;

export const downloadUrl = (file: string, repo: string = site.repo) => `${repo}/releases/latest/download/${file}`;
