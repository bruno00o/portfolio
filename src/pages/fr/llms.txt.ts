import type { APIRoute } from 'astro';
import { buildLlmsTxt } from '../../content/helpers';

export const GET: APIRoute = async ({ site }) =>
  new Response(await buildLlmsTxt('fr', site!), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
