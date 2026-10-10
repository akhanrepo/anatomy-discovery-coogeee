import type { APIRoute } from 'astro';
import { corpus } from '../../lib/content/load';
import { ogForDiscovery, ogPng } from '../../lib/og';
import { site } from '../../config/site';
export function getStaticPaths() {
  return [...corpus().discoveries.map((d) => ({ params: { id: d.id } })), { params: { id: 'default' } }];
}
export const GET: APIRoute = async ({ params }) => {
  const png = params.id === 'default'
    ? await ogPng({ kicker: '3,600 years · 26 plates', title: site.tagline, text: 'Who figured out the body, how, and what they got wrong first.', plateId: 'harvey-circulation' })
    : await ogForDiscovery(params.id!);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
