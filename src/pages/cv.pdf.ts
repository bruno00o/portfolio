import type { APIRoute } from 'astro';
import { cvPdfResponse } from '../cv';

export const GET: APIRoute = ({ site }) => cvPdfResponse('en', site!);
