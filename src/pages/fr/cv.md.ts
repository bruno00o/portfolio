import type { APIRoute } from 'astro';
import { cvToMarkdown } from '../../cv';
import { markdownResponse } from '../../content/helpers';

export const GET: APIRoute = async ({ site }) => markdownResponse(await cvToMarkdown('fr', site!));
