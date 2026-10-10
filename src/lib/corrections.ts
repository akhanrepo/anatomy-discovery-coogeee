import { site } from '../config/site';

/** F05: prefilled correction report. GitHub issue (public, triaged with the `correction` label) plus an email fallback for readers without an account. */
export function buildCorrectionUrl(o: { discoveryId: string; claimId?: string; title?: string }): string {
  const ref = o.claimId ? `${o.discoveryId}#${o.claimId}` : o.discoveryId;
  const body = [
    `**Story:** ${o.discoveryId}`,
    `**Claim:** ${o.claimId ?? '(whole story)'}`,
    '',
    '**What looks wrong?**',
    '',
    '**Your source (author, title, page or link):**',
    '',
  ].join('\n');
  const q = new URLSearchParams({ title: `Correction: ${ref}${o.title ? ` (${o.title})` : ''}`, body, labels: 'correction' });
  return `${site.repo}/issues/new?${q.toString()}`;
}

export function buildCorrectionMailto(o: { discoveryId: string; claimId?: string }): string {
  const ref = o.claimId ? `${o.discoveryId}#${o.claimId}` : o.discoveryId;
  return `mailto:${site.contactEmail}?subject=${encodeURIComponent(`Correction: ${ref}`)}`;
}
