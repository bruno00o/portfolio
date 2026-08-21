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
