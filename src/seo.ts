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

const PROFILE_CREATED = '2026-07-26';

export function buildJsonLd(data: StructuredData, ctx: PageContext): string {
  const { lang, canonical, image, origin } = ctx;
  const t = useTranslations(lang);
  const siteUrl = origin.toString();
  const personId = `${siteUrl}#person`;
  const websiteId = `${siteUrl}#website`;
  const inLanguage = lang;
  const author = { '@type': 'Person', '@id': personId, name: site.name, url: siteUrl };

  let node: Record<string, unknown>;

  if (data.type === 'person') {
    node = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': websiteId,
          name: site.name,
          url: siteUrl,
          inLanguage: ['en', 'fr'],
          publisher: { '@id': personId },
        },
        {
          '@type': 'ProfilePage',
          url: canonical,
          name: t('meta.title'),
          inLanguage,
          isPartOf: { '@id': websiteId },
          dateCreated: PROFILE_CREATED,
          dateModified: new Date().toISOString().slice(0, 10),
          mainEntity: { '@id': personId },
        },
        {
          '@type': 'Person',
          '@id': personId,
          name: site.name,
          givenName: 'Bruno',
          familyName: 'Seilliebert',
          url: siteUrl,
          image,
          jobTitle: t('hero.title'),
          description: t('meta.description'),
          email: `mailto:${site.email}`,
          worksFor: { '@type': 'Organization', name: t('xp.w1.sub') },
          alumniOf: { '@type': 'CollegeOrUniversity', name: t('xp.e1.sub') },
          sameAs: [site.github, site.linkedin],
          knowsLanguage: ['en', 'fr'],
        },
      ],
    };
  } else if (data.type === 'project') {
    const { title, desc, stack, repo, live } = data.entry.data;
    node = {
      '@context': 'https://schema.org',
      '@type': repo ? 'SoftwareSourceCode' : 'CreativeWork',
      inLanguage,
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
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      inLanguage,
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
