import type { APIRoute } from 'astro';
import { buildFeed } from '../lib/feed';
export const GET: APIRoute = ({ site }) => new Response(buildFeed((site?.toString() ?? '').replace(/\/$/, '')), { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
