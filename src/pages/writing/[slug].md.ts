import type { APIRoute } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { getLocalizedPaths, writingToMarkdown, markdownResponse } from '../../content/helpers';

export const getStaticPaths = () => getLocalizedPaths('writing', 'en');

export const GET: APIRoute = ({ props, site }) =>
  markdownResponse(writingToMarkdown(props.entry as CollectionEntry<'writing'>, 'en', site!));
