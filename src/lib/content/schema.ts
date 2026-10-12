import { z } from 'zod';

export const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'ids are kebab-case');

export const SYSTEMS = [
  'nervous', 'circulatory', 'respiratory', 'lymphatic', 'musculoskeletal',
  'reproductive', 'endocrine', 'sensory', 'integumentary', 'digestive', 'general',
] as const;
export const LAYERS = ['surface', 'muscles', 'viscera', 'skeleton'] as const;
export const TRADITIONS = [
  'egyptian', 'greek', 'hellenistic', 'greco-roman', 'chinese', 'indian', 'islamic-world',
  'renaissance', 'early-modern', 'modern', 'contemporary',
] as const;
export const NON_EUROPEAN: readonly string[] = ['egyptian', 'chinese', 'indian', 'islamic-world'];
export const STATUSES = ['established', 'contested', 'revised'] as const;
export const KINDS = ['morphology', 'function', 'microscopic', 'molecular'] as const;
export const PRECISION = ['exact', 'circa', 'range', 'century'] as const;
export const LICENCES = ['PD', 'PDM', 'CC0', 'CC-BY'] as const;

export const Structure = z.strictObject({
  id,
  name: z.string().min(2),
  system: z.enum(SYSTEMS),
  layer: z.enum(LAYERS),
  sex: z.enum(['both', 'male', 'female']).default('both'),
});

export const Person = z.strictObject({
  id,
  name: z.string(),
  nameOriginal: z.string().optional(),
  script: z.enum(['arab', 'grek', 'hans', 'deva', 'latn']).optional(),
  dates: z.string(),
  place: z.string(),
  tradition: z.enum(TRADITIONS),
  note: z.string().optional(),
});

export const Source = z.strictObject({
  id,
  type: z.enum(['primary', 'secondary', 'tertiary']),
  scholarly: z.boolean().default(false),
  author: z.string(),
  title: z.string(),
  year: z.union([z.number(), z.string()]),
  publisher: z.string().optional(),
  url: z.string().url().optional(),
  doi: z.string().optional(),
  note: z.string().optional(),
  /** Bibliographic details (byline/title/volume) not yet fully confirmed; URL is authoritative. */
  detailsPending: z.boolean().optional(),
});

/** "source-id" or "source-id:locator" */
export const CitationRef = z.string().regex(/^[a-z0-9-]+(?::.+)?$/);

export const Claim = z.strictObject({
  text: z.string().min(10),
  citations: z.array(CitationRef).min(1),
  status: z.enum(STATUSES).default('established'),
  contestNote: z.string().optional(),
  secondarySummary: z.boolean().optional(),
});

export const Discovery = z.strictObject({
  id,
  plate: z.string().regex(/^[IVXL]+$/),
  title: z.string(),
  hook: z.string(),
  structures: z.array(id).min(1),
  kind: z.enum(KINDS),
  yearStart: z.number().int(),
  yearEnd: z.number().int().optional(),
  yearPrecision: z.enum(PRECISION),
  displayDate: z.string(),
  people: z.array(id).min(1),
  place: z.string(),
  tradition: z.enum(TRADITIONS),
  status: z.enum(STATUSES),
  contestNote: z.string().optional(),
  method: z.string(),
  overturned: z.string(),
  corrects: z.array(id).default([]),
  claims: z.record(z.string(), Claim),
  assets: z.array(id).min(1),
  threads: z.array(id).default([]),
  body: z.string(),
});

export const Misbelief = z.strictObject({
  id,
  title: z.string(),
  belief: z.string(),
  heldBy: z.array(id).min(1),
  yearStart: z.number().int(),
  structures: z.array(id).min(1),
  corrections: z
    .array(
      z.strictObject({
        year: z.number().int(),
        by: z.string(),
        discovery: id.optional(),
        scope: z.enum(['first', 'mainstream']),
      }),
    )
    .min(1),
  claims: z.record(z.string(), Claim),
  /** claim keys: which claim documents the belief (needs a primary source) and which the correction */
  beliefClaim: z.string(),
  correctionClaim: z.string(),
});

export const Era = z.strictObject({
  id,
  yearStart: z.number().int(),
  label: z.string(),
  caption: z.string(),
  paper: z.enum(['papyrus', 'vellum', 'laid', 'laid-fine', 'wove', 'coated', 'ivory']),
  script: z.string(),
  anchor: z.boolean().default(false),
});

export const Thread = z.strictObject({
  id,
  title: z.string(),
  intro: z.string(),
  discoveries: z.array(id).min(2),
  claims: z.record(z.string(), Claim).default({}),
});

export const Asset = z.strictObject({
  id,
  title: z.string(),
  creator: z.string(),
  date: z.string(),
  sourceInstitution: z.string(),
  recordUrl: z.string().url(),
  licence: z.string(),
  licenceVerified: z.boolean().default(false),
  credit: z.string(),
  kind: z.enum(['plate', 'manuscript', 'portrait', 'photo', 'generated', 'commissioned']),
  authenticity: z.enum(['contemporary', 'later-depiction', 'unknown', 'ours']),
  altText: z.string().min(10),
  file: z.string().optional(),
});

export const TraditionConcept = z.strictObject({
  id,
  name: z.string(),
  nameOriginal: z.string().optional(),
  script: z.enum(['arab', 'grek', 'hans', 'deva', 'latn', 'fas']).optional(),
  story: z.string(),
  hotspot: z.tuple([z.number(), z.number()]),
  relatesTo: z.array(
    z.strictObject({ structure: id.optional(), relation: z.enum(['corresponds', 'partially', 'none']) }),
  ).min(1),
  claims: z.record(z.string(), Claim),
});

export const Tradition = z.strictObject({
  id,
  name: z.string(),
  era: z.string(),
  intro: z.string(),
  /** our schematic drawn after the source plate (always shown) */
  plateAsset: id,
  /** the historical plate itself; shown only once its scan exists and its licence is verified (F10-AC3) */
  originalAsset: id.optional(),
  concepts: z.array(TraditionConcept).min(1),
});

export const ShareDate = z.strictObject({
  discovery: id,
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  year: z.number().int(),
  calendar: z.enum(['julian', 'gregorian']),
  basis: z.enum(['publication', 'demonstration', 'letter', 'birth', 'death']),
  citation: CitationRef,
  caption: z.string(),
});

export const VerificationLog = z.strictObject({
  subject: id,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reviewer: z.string(),
  claimsHash: z.string(),
  sourcesConsulted: z.array(z.string()).min(1),
  mythChecks: z.array(z.string()).min(1),
  verdict: z.enum(['pass', 'pass-with-caveats']),
  notes: z.string(),
});

export const Essay = z.strictObject({
  thread: id,
  title: z.string(),
  claims: z.record(z.string(), Claim),
  body: z.string(),
});

export const Correction = z.strictObject({
  date: z.string(),
  subject: id,
  summary: z.string(),
  reportedBy: z.string().optional(),
});

export type Structure = z.infer<typeof Structure>;
export type Person = z.infer<typeof Person>;
export type Source = z.infer<typeof Source>;
export type Claim = z.infer<typeof Claim>;
export type Discovery = z.infer<typeof Discovery>;
export type Misbelief = z.infer<typeof Misbelief>;
export type Era = z.infer<typeof Era>;
export type Thread = z.infer<typeof Thread>;
export type Asset = z.infer<typeof Asset>;
export type Tradition = z.infer<typeof Tradition>;
export type TraditionConcept = z.infer<typeof TraditionConcept>;
export type ShareDate = z.infer<typeof ShareDate>;
export type VerificationLog = z.infer<typeof VerificationLog>;
export type Correction = z.infer<typeof Correction>;
export type Essay = z.infer<typeof Essay>;

export interface Corpus {
  structures: Structure[];
  people: Person[];
  sources: Source[];
  discoveries: Discovery[];
  misbeliefs: Misbelief[];
  eras: Era[];
  threads: Thread[];
  assets: Asset[];
  traditions: Tradition[];
  shareDates: ShareDate[];
  logs: VerificationLog[];
  corrections: Correction[];
  calendar: string[];
  essays: Essay[];
}
