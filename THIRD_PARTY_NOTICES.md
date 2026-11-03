# Third-party notices

Tabula's own licences are in [README.md#licence](README.md#licence). This file lists the third-party material Tabula is built with or ships, and their licences.

## Fonts (shipped in the site, the share cards and the PDFs)

All are licensed under the [SIL Open Font License 1.1](https://openfontlicense.org), installed from [Fontsource](https://fontsource.org) packages:

| Font | Package | Used for |
|---|---|---|
| EB Garamond | `@fontsource/eb-garamond` | Body text |
| IM Fell English | `@fontsource/im-fell-english` | Display type and plate numbers |
| Amiri | `@fontsource/amiri` | Arabic names and margin script |
| Noto Serif Devanagari | `@fontsource/noto-serif-devanagari` | Sanskrit names and margin script |
| Noto Serif SC | `@fontsource/noto-serif-sc` | Chinese names and margin script |

## Production dependencies

| Package | Licence | Role |
|---|---|---|
| [`astro`](https://github.com/withastro/astro) | MIT | Static site framework |
| [`marked`](https://github.com/markedjs/marked) | MIT | Markdown → HTML for stories and essays |
| [`gray-matter`](https://github.com/jonschlinkert/gray-matter) | MIT | Front matter parsing |
| [`yaml`](https://github.com/eemeli/yaml) | ISC | YAML registries |
| [`zod`](https://github.com/colinhacks/zod) | MIT | Content schemas |
| [`satori`](https://github.com/vercel/satori) | MPL-2.0 | Share-card layout (build time only) |
| [`@resvg/resvg-js`](https://github.com/thx/resvg-js) | MPL-2.0 | Share-card rendering to PNG (build time only) |
| `@fontsource/*` (above) | OFL-1.1 | Fonts |

`satori` and `@resvg/resvg-js` run only at build time and aren't modified or shipped to readers. Their MPL-2.0 source is available from the links above.

## Development and build tools

Vitest (MIT), Playwright (Apache-2.0), TypeScript (Apache-2.0), tsx (MIT), `@astrojs/check` (MIT) and `@types/node` (MIT). The edition's EPUB is built with [pandoc](https://pandoc.org) (GPL-2.0-or-later), which is invoked as a separate program and not distributed.

## Historical material

- **Plates.** Every plate shown on the site is drawn for Tabula from its own figure and licensed CC BY 4.0. Each one's record in [`content/assets.yaml`](content/assets.yaml) links the primary source it illustrates. Those sources (books, articles, manuscripts) belong to their authors, publishers and holding institutions. Tabula links to them and doesn't reproduce them.
- **Traditions lens.** The lens plates (Wellcome Collection, U.S. National Library of Medicine) are listed in `content/assets.yaml` with `licenceVerified: false`. They aren't displayed until each record's licence is confirmed. Tabula shows its own labelled schematic in their place.
- **Quotations** from primary and secondary sources are short and cited under fair dealing for criticism, review and research. Full citations are on [`/sources`](https://tabula-anatomy.netlify.app/sources/).
