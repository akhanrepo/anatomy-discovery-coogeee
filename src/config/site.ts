/** Single source of truth for the brand (F17) and third-party integrations. */
export const site = {
  name: 'Tabula',
  tagline: 'The body, as it was written.',
  description:
    'An engraved human body where every part carries the story of who figured it out, how, and what they got wrong first. Drag through 3,600 years and watch it being written in.',
  repo: 'https://github.com/akhanrepo/tabula',
  /** The project licences (F18). Code: MIT. Written content and the packs/edition built from it: CC BY-SA 4.0. Plates: CC BY 4.0 per asset. */
  licences: {
    code: { name: 'MIT', url: 'https://github.com/akhanrepo/tabula/blob/main/LICENSE' },
    content: { name: 'CC BY-SA 4.0', url: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  },
  /** Optional email for corrections and sponsorship enquiries. Empty = only GitHub links are shown. */
  contactEmail: process.env.PUBLIC_CONTACT_EMAIL ?? '',
  /** Analytics (F08): Plausible domain. Empty = disabled. Never active on localhost or deploy previews. */
  analytics: { plausibleDomain: process.env.PUBLIC_PLAUSIBLE_DOMAIN ?? '', productionHost: process.env.PUBLIC_PRODUCTION_HOST ?? '' },
  /** Email (F15): Buttondown username. Empty = signup shows RSS only. */
  email: { buttondownUser: process.env.PUBLIC_BUTTONDOWN_USER ?? '' },
  /** Donations (F18): any donation page (GitHub Sponsors, Ko-fi, …). Empty = hidden. */
  donateUrl: process.env.PUBLIC_DONATE_URL ?? '',
  /** Sponsorship (F14): empty until a sponsor exists AND the policy page is live. */
  sponsors: [] as { name: string; url: string; scope: 'site' | string }[],
} as const;
