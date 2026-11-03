import { site } from '../config/site';

/** The GitHub issue form for corrections (`.github/ISSUE_TEMPLATE/correction.yml`). It applies the `correction` label. */
export const CORRECTION_FORM = 'correction.yml';

/** F05/F18: prefilled correction report. Opens the correction issue form with the story and claim IDs filled in
 * (issue forms take field values from query parameters named after the field ids). */
export function buildCorrectionUrl(o: { discoveryId: string; claimId?: string; title?: string }, repo: string = site.repo): string {
  const ref = o.claimId ? `${o.discoveryId}#${o.claimId}` : o.discoveryId;
  const q = new URLSearchParams({
    template: CORRECTION_FORM,
    title: `Correction: ${ref}${o.title ? ` (${o.title})` : ''}`,
    story: o.discoveryId,
    claim: o.claimId ?? '(whole story)',
  });
  return `${repo}/issues/new?${q.toString()}`;
}

/** Account-free fallback. Null when no contact email is configured (no placeholder address ever ships). */
export function buildCorrectionMailto(o: { discoveryId: string; claimId?: string }, email: string = site.contactEmail): string | null {
  if (!email) return null;
  const ref = o.claimId ? `${o.discoveryId}#${o.claimId}` : o.discoveryId;
  return `mailto:${email}?subject=${encodeURIComponent(`Correction: ${ref}`)}`;
}
