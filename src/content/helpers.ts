import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import { getLocalizedPath, useTranslations } from '../i18n/utils';
import { site } from '../config';
import type { Lang } from '../i18n/ui';
import { stackRows, work, education, now, formatDates, type XpItem } from './profile';
import { legalCopy } from './legal';

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

export async function buildLlmsTxt(lang: Lang, origin: URL): Promise<string> {
  const t = useTranslations(lang);
  const abs = (path: string) => new URL(path, origin).toString();
  const other: Lang = lang === 'fr' ? 'en' : 'fr';

  const projects = (await getCollection('projects', (e) => e.data.locale === lang)).sort(
    (a, b) => a.data.order - b.data.order,
  );
  const writing = (await getCollection('writing', (e) => e.data.locale === lang)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return [
    `# ${site.name}`,
    '',
    `> ${t('meta.description')}`,
    '',
    t('hero.oneliner'),
    '',
    t('llms.markdown'),
    '',
    `${t('llms.alternate')} ${abs(getLocalizedPath('/llms.txt', other))}`,
    '',
    `## ${t('nav.work')}`,
    '',
    ...projects.map(
      (e) => `- [${e.data.title}](${abs(getProjectHref(e, lang))}.md): ${e.data.desc}`,
    ),
    '',
    `## ${t('nav.writing')}`,
    '',
    ...writing.map((e) => `- [${e.data.title}](${abs(getWritingHref(e, lang))}.md): ${e.data.dek}`),
    '',
    `## ${t('nav.contact')}`,
    '',
    `- [GitHub](${site.github})`,
    `- [LinkedIn](${site.linkedin})`,
    `- ${site.email}`,
    '',
  ].join('\n');
}

export async function homeToMarkdown(lang: Lang, origin: URL): Promise<string> {
  const t = useTranslations(lang);
  const abs = (path: string) => new URL(path, origin).toString();

  const projects = (await getCollection('projects', (e) => e.data.locale === lang)).sort(
    (a, b) => a.data.order - b.data.order,
  );
  const writing = (await getCollection('writing', (e) => e.data.locale === lang)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  const xp = (it: XpItem) =>
    `- ${formatDates(it, lang)}: ${t(it.roleKey)}, ${t(it.subKey)}${it.tagKey ? ` (${t(it.tagKey)})` : ''}`;

  return [
    `# ${site.name}`,
    '',
    `> ${t('meta.description')}`,
    '',
    meta([
      `- Title: ${t('hero.title')}`,
      `- Location: ${t('now.city')}`,
      `- Email: ${site.email}`,
      `- GitHub: ${site.github}`,
      `- LinkedIn: ${site.linkedin}`,
      `- Canonical: ${abs(getLocalizedPath('/', lang)).replace(/\/?$/, '/')}`,
    ]),
    '',
    '---',
    '',
    t('hero.oneliner'),
    '',
    `## ${t('nav.work')}`,
    '',
    ...projects.map(
      (e) => `- [${e.data.title}](${abs(getProjectHref(e, lang))}.md): ${e.data.desc}`,
    ),
    '',
    `## ${t('stack.label')}`,
    '',
    ...stackRows.map((r) => `- ${t(r.labelKey)}: ${r.items.join(', ')}`),
    '',
    `## ${t('xp.label')}`,
    '',
    ...work.map(xp),
    '',
    `## ${t('xp.edu_label')}`,
    '',
    ...education.map(xp),
    '',
    `## ${t('now.label')}`,
    '',
    `- ${t('now.building')}: ${now.building.join(', ')}.`,
    `- ${t('now.exploring')}: ${t('now.exploring_text')}`,
    `- ${t('now.running')}: ${t('now.running_pre')}${now.cluster}.`,
    '',
    `## ${t('nav.writing')}`,
    '',
    ...writing.map((e) => `- [${e.data.title}](${abs(getWritingHref(e, lang))}.md): ${e.data.dek}`),
    '',
  ].join('\n');
}

export function legalToMarkdown(lang: Lang, origin: URL): string {
  const c = legalCopy[lang];
  const abs = (path: string) => new URL(path, origin).toString();

  return [
    `# ${c.title}`,
    '',
    `- Canonical: ${abs(getLocalizedPath('/legal', lang))}/`,
    '',
    '---',
    '',
    `## ${c.publisher.h}`,
    '',
    c.publisher.body,
    '',
    c.publisher.role,
    '',
    site.email,
    '',
    `## ${c.hosting.h}`,
    '',
    c.hosting.lead,
    '',
    c.hosting.fr,
    '',
    `## ${c.ip.h}`,
    '',
    c.ip.body,
    '',
    `${c.ip.source} ${site.github}/portfolio`,
    '',
    `## ${c.data.h}`,
    '',
    c.data.noCookies,
    '',
    c.data.storage,
    '',
    c.data.analytics,
    '',
    `## ${c.infra.h}`,
    '',
    `${c.infra.body} [${c.infra.link}](${abs(getLocalizedPath('/work/homelab', lang))}.md).`,
    '',
    `## ${c.contact.h}`,
    '',
    site.email,
    '',
  ].join('\n');
}
