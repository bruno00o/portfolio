import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import { getLocalizedPath, useTranslations } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

export function formatKind(kind: string, lang: Lang): string {
  const t = useTranslations(lang);
  return kind.replace('{present}', t('common.present'));
}

type LocalizedCollection = 'projects' | 'writing';

export function getEntrySlug(
  entry: CollectionEntry<'projects'> | CollectionEntry<'writing'>,
): string {
  return entry.id.replace(/^(en|fr)\//, '');
}

export function getProjectHref(entry: CollectionEntry<'projects'>, lang: Lang): string {
  return getLocalizedPath(`/work/${getEntrySlug(entry)}`, lang);
}

export function getWritingHref(entry: CollectionEntry<'writing'>, lang: Lang): string {
  return getLocalizedPath(`/writing/${getEntrySlug(entry)}`, lang);
}

export function formatPostDate(d: Date, lang: Lang): string {
  return d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    month: 'long',
    year: 'numeric',
  });
}

export async function getLocalizedPaths<C extends LocalizedCollection>(collection: C, lang: Lang) {
  const entries = await getCollection(collection, (e) => e.data.locale === lang);
  return entries.map((entry) => ({
    params: { slug: getEntrySlug(entry) },
    props: { entry },
  }));
}

export function markdownResponse(body: string): Response {
  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}

// Labels stay English in both locales: they are machine-facing keys, not site copy.
function meta(lines: (string | false | undefined)[]): string {
  return lines.filter(Boolean).join('\n');
}

export function projectToMarkdown(
  entry: CollectionEntry<'projects'>,
  lang: Lang,
  site: URL,
): string {
  const { title, desc, kind, stack, repo, live } = entry.data;
  return [
    `# ${title}`,
    '',
    `> ${desc}`,
    '',
    meta([
      `- Kind: ${formatKind(kind, lang)}`,
      `- Stack: ${stack.join(', ')}`,
      repo && `- Repo: ${repo}`,
      live && `- Live: ${live}`,
      `- Canonical: ${new URL(getProjectHref(entry, lang), site).toString()}`,
    ]),
    '',
    '---',
    '',
    entry.body?.trim() ?? '',
    '',
  ].join('\n');
}

export function writingToMarkdown(
  entry: CollectionEntry<'writing'>,
  lang: Lang,
  site: URL,
): string {
  const { title, dek, date, tags, draft } = entry.data;
  return [
    `# ${title}`,
    '',
    `> ${dek}`,
    '',
    meta([
      `- Published: ${date.toISOString().slice(0, 10)}`,
      tags.length > 0 && `- Tags: ${tags.join(', ')}`,
      draft && '- Status: draft',
      `- Canonical: ${new URL(getWritingHref(entry, lang), site).toString()}`,
    ]),
    '',
    '---',
    '',
    entry.body?.trim() ?? '',
    '',
  ].join('\n');
}
