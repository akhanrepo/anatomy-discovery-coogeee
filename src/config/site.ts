/** Single source of truth for the brand (F17) and third-party integrations. */
export const site = {
  name: 'Tabula',
  tagline: 'The body, as it was written.',
  description:
    'An engraved human body where every part carries the story of who figured it out, how, and what they got wrong first. Drag through 3,600 years and watch it being written in.',
  repo: 'https://github.com/akhanrepo/anatomy-discovery-coogeee',
  contactEmail: 'corrections@tabula.example',
  /** Analytics (F08): Plausible domain. Empty = disabled. Never active on localhost or deploy previews. */
  analytics: { plausibleDomain: process.env.PUBLIC_PLAUSIBLE_DOMAIN ?? '', productionHost: process.env.PUBLIC_PRODUCTION_HOST ?? '' },
  /** Email (F15): Buttondown username. Empty = signup shows RSS only. */
  email: { buttondownUser: process.env.PUBLIC_BUTTONDOWN_USER ?? '' },
  /** Commerce (F12/F14): Lemon Squeezy checkout URLs per product. Empty = "coming soon". Don't change without asking. */
  commerce: {
    currency: 'AUD',
    products: {
      'pack-circulation': { price: 19, schoolPrice: 57, checkoutUrl: process.env.PUBLIC_CHECKOUT_PACK_CIRCULATION ?? '' },
      'pack-myths': { price: 19, schoolPrice: 57, checkoutUrl: process.env.PUBLIC_CHECKOUT_PACK_MYTHS ?? '' },
      'pack-microscopy': { price: 19, schoolPrice: 57, checkoutUrl: process.env.PUBLIC_CHECKOUT_PACK_MICROSCOPY ?? '' },
      edition: { price: 29, schoolPrice: 0, checkoutUrl: process.env.PUBLIC_CHECKOUT_EDITION ?? '' },
    } as Record<string, { price: number; schoolPrice: number; checkoutUrl: string }>,
  },
  /** Sponsorship (F14): empty until a sponsor exists AND the policy page is live. */
  sponsors: [] as { name: string; url: string; scope: 'site' | string }[],
} as const;
