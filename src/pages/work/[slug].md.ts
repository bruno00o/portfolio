import type { APIRoute } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { getLocalizedPaths, projectToMarkdown, markdownResponse } from '../../content/helpers';

export const getStaticPaths = () => getLocalizedPaths('projects', 'en');

export const GET: APIRoute = ({ props, site }) =>
  markdownResponse(projectToMarkdown(props.entry as CollectionEntry<'projects'>, 'en', site!));
