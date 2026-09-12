import type { APIRoute } from 'astro';
import { homeToMarkdown, markdownResponse } from '../../content/helpers';

export const GET: APIRoute = async ({ site }) => markdownResponse(await homeToMarkdown('fr', site!));
