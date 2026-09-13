import type { APIRoute } from 'astro';
import { archiveToMarkdown, markdownResponse } from '../../content/helpers';

export const GET: APIRoute = async ({ site }) => markdownResponse(await archiveToMarkdown('en', site!));
