import { getCollection } from 'astro:content';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import QRCode from 'qrcode';
import { site } from './config';
import { cvCopy } from './content/cv';
import { getProjectHref } from './content/helpers';
import { work, education, formatMonthRange } from './content/profile';
import type { Lang } from './i18n/ui';
import { getLocalizedPath, useTranslations } from './i18n/utils';

const ROOT = process.cwd();

export interface CvData {
  lang: Lang;
  name: string;
  title: string;
  summary: string;
  location: string;
  email: string;
  // From CV_PHONE at build time. Never committed, never on the HTML page or its .md twin.
  phone?: string;
  site: string;
  siteLabel: string;
  github: string;
  githubLabel: string;
  linkedin: string;
  linkedinLabel: string;
  qr: string;
  labels: {
    profile: string;
    work: string;
    projects: string;
    education: string;
    stack: string;
    languages: string;
    certifications: string;
  };
  work: { role: string; org: string; tag?: string; dates: string; lead: string; bullets: string[] }[];
  education: { role: string; org: string; tag?: string; dates: string; note?: string }[];
  projects: { title: string; desc: string; stack: string[]; url: string }[];
  stack: { label: string; items: string[] }[];
  languages: string[];
  certifications: string[];
}

const stripScheme = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

export async function buildCvData(lang: Lang, origin: URL): Promise<CvData> {
  const t = useTranslations(lang);
  const copy = cvCopy[lang];
  const abs = (path: string) => new URL(path, origin).toString();
  const home = abs(getLocalizedPath('/', lang)).replace(/\/?$/, '/');

  const projects = (await getCollection('projects', (e) => e.data.locale === lang && e.data.cv)).sort(
    (a, b) => a.data.order - b.data.order,
  );

  // ?ref=cv shows up as a referrer in Umami, so scans are countable.
  const qr = await QRCode.toString(`${home}?ref=cv`, {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
    color: { dark: '#09090b', light: '#0000' },
  });

  return {
    lang,
    name: site.name,
    title: t('hero.title'),
    summary: copy.summary,
    location: t('now.city'),
    email: site.email,
    ...(process.env.CV_PHONE ? { phone: process.env.CV_PHONE } : {}),
    site: home,
    siteLabel: origin.host,
    github: site.github,
    githubLabel: stripScheme(site.github),
    linkedin: site.linkedin,
    linkedinLabel: stripScheme(site.linkedin),
    qr,
    labels: {
      profile: copy.labels.profile,
      work: t('xp.label'),
      projects: copy.labels.projects,
      education: t('xp.edu_label'),
      stack: copy.labels.skills,
      languages: copy.labels.languages,
      certifications: copy.labels.certifications,
    },
    work: work.map((it) => ({
      role: t(it.roleKey),
      org: t(it.subKey),
      ...(it.tagKey ? { tag: t(it.tagKey) } : {}),
      dates: formatMonthRange(it, lang),
      ...copy.work[it.id],
    })),
    education: education.map((it) => ({
      role: t(it.roleKey),
      org: t(it.subKey),
      ...(it.tagKey ? { tag: t(it.tagKey) } : {}),
      dates: formatMonthRange(it, lang),
      ...(copy.education[it.id] ? { note: copy.education[it.id] } : {}),
    })),
    projects: projects.map((e) => ({
      title: e.data.title,
      desc: e.data.cvDesc ?? e.data.desc,
      stack: e.data.stack,
      url: abs(getProjectHref(e, lang)),
    })),
    stack: copy.skills,
    languages: copy.languages,
    certifications: copy.certifications,
  };
}

export function renderCvPdf(data: CvData): Uint8Array<ArrayBuffer> {
  const pdf = execFileSync(
    'typst',
    [
      'compile',
      '--root', ROOT,
      '--font-path', resolve(ROOT, 'cv/fonts'),
      '--ignore-system-fonts',
      '--pdf-standard', 'ua-1',
      '--input', `data=${JSON.stringify(data)}`,
      resolve(ROOT, 'cv/cv.typ'),
      '-',
    ],
    { stdio: ['ignore', 'pipe', 'inherit'], maxBuffer: 16 * 1024 * 1024 },
  );
  return new Uint8Array(pdf);
}

export async function cvPdfResponse(lang: Lang, origin: URL): Promise<Response> {
  const pdf = renderCvPdf(await buildCvData(lang, origin));
  return new Response(pdf, { headers: { 'Content-Type': 'application/pdf' } });
}

// Bullets use **bold** for their key phrase. The PDF and the HTML page render it; the .md twin keeps it.
export function splitBold(s: string): { text: string; bold: boolean }[] {
  return s
    .split('**')
    .map((text, i) => ({ text, bold: i % 2 === 1 }))
    .filter((p) => p.text.length > 0);
}

export async function buildCvPageData(lang: Lang, origin: URL): Promise<CvData> {
  const { phone: _phone, ...data } = await buildCvData(lang, origin);
  return data;
}

export async function cvToMarkdown(lang: Lang, origin: URL): Promise<string> {
  const d = await buildCvPageData(lang, origin);
  const abs = (path: string) => new URL(path, origin).toString();
  const head = (it: { role: string; org: string; tag?: string; dates: string }) =>
    `### ${it.role}, ${it.org}${it.tag ? ` (${it.tag})` : ''}, ${it.dates}`;

  return [
    `# ${d.name}`,
    '',
    `> ${d.title}, ${d.location}`,
    '',
    `- Email: ${d.email}`,
    `- GitHub: ${d.github}`,
    `- LinkedIn: ${d.linkedin}`,
    `- PDF: ${abs(getLocalizedPath('/cv.pdf', lang))}`,
    `- Canonical: ${abs(getLocalizedPath('/cv', lang))}/`,
    '',
    '---',
    '',
    `## ${d.labels.profile}`,
    '',
    d.summary,
    '',
    `## ${d.labels.stack}`,
    '',
    ...d.stack.map((r) => `- ${r.label}: ${r.items.join(', ')}`),
    `- ${d.labels.languages}: ${d.languages.join(', ')}`,
    `- ${d.labels.certifications}: ${d.certifications.join(', ')}`,
    '',
    `## ${d.labels.work}`,
    '',
    ...d.work.flatMap((w) => [head(w), '', w.lead, '', ...w.bullets.map((b) => `- ${b}`), '']),
    `## ${d.labels.projects}`,
    '',
    ...d.projects.map((p) => `- [${p.title}](${p.url}.md) (${p.stack.join(', ')}): ${p.desc}`),
    '',
    `## ${d.labels.education}`,
    '',
    ...d.education.flatMap((e) => [head(e), ...(e.note ? ['', e.note] : []), '']),
  ].join('\n');
}
