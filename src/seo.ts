import type { CollectionEntry } from 'astro:content';
import { site } from './config';
import { useTranslations } from './i18n/utils';
import type { Lang } from './i18n/ui';

export type StructuredData =
  | { type: 'person' }
  | { type: 'project'; entry: CollectionEntry<'projects'> }
  | { type: 'post'; entry: CollectionEntry<'writing'> };

interface PageContext {
  lang: Lang;
  canonical: string;
  image: string;
  origin: URL;
}

export function buildJsonLd(data: StructuredData, ctx: PageContext): string {
  const { lang, canonical, image, origin } = ctx;
  const t = useTranslations(lang);
  const base = { '@context': 'https://schema.org', inLanguage: lang };
  const author = { '@type': 'Person', name: site.name, url: origin.toString() };

  let node: Record<string, unknown>;

  if (data.type === 'person') {
    node = {
      ...base,
      '@type': 'Person',
      name: site.name,
      url: canonical,
      jobTitle: t('hero.title'),
      description: t('meta.description'),
      email: `mailto:${site.email}`,
      sameAs: [site.github, site.linkedin],
      knowsLanguage: ['en', 'fr'],
    };
  } else if (data.type === 'project') {
    const { title, desc, stack, repo, live } = data.entry.data;
    node = {
      ...base,
      '@type': repo ? 'SoftwareSourceCode' : 'CreativeWork',
      name: title,
      description: desc,
      url: canonical,
      image,
      keywords: stack.join(', '),
      author,
      ...(repo ? { codeRepository: repo } : {}),
      ...(live ? { sameAs: live } : {}),
    };
  } else {
    const { title, dek, date, tags } = data.entry.data;
    node = {
      ...base,
      '@type': 'BlogPosting',
      headline: title,
      description: dek,
      url: canonical,
      image,
      datePublished: date.toISOString(),
      keywords: tags.join(', '),
      author,
    };
  }

  // A literal </script> inside any value would close the tag early.
  return JSON.stringify(node).replace(/</g, '\\u003c');
}
