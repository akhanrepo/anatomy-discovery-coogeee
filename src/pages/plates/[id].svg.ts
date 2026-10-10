import type { APIRoute } from 'astro';
import { corpus } from '../../lib/content/load';
import { plateSvg } from '../../lib/plate';
export function getStaticPaths() {
  return corpus().discoveries.map((d) => ({ params: { id: d.id } }));
}
export const GET: APIRoute = ({ params }) =>
  new Response(plateSvg(params.id!), { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } });
