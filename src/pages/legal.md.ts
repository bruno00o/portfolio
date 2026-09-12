import type { APIRoute } from 'astro';
import { legalToMarkdown, markdownResponse } from '../content/helpers';

export const GET: APIRoute = ({ site }) => markdownResponse(legalToMarkdown('en', site!));
