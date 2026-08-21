import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { getCollection } from 'astro:content';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getEntrySlug, formatKind } from '../../content/helpers';
import { getLocalizedPath } from '../../i18n/utils';

const FONT_DIR = resolve(process.cwd(), 'node_modules/@fontsource');

const fontsP = Promise.all([
  readFile(`${FONT_DIR}/geist-sans/files/geist-sans-latin-400-normal.woff`),
  readFile(`${FONT_DIR}/geist-sans/files/geist-sans-latin-500-normal.woff`),
  readFile(`${FONT_DIR}/geist-mono/files/geist-mono-latin-400-normal.woff`),
]).then(([regular, medium, mono]) => ({ regular, medium, mono }));

interface OgProps {
  title: string;
  subtitle: string;
}

function ogSlugFor(prefix: 'work' | 'writing', entry: { id: string; data: { locale: 'en' | 'fr' } }) {
  return getLocalizedPath(`/${prefix}/${getEntrySlug(entry as Parameters<typeof getEntrySlug>[0])}`, entry.data.locale).slice(1);
}

export const getStaticPaths = (async () => {
  const [projects, writing] = await Promise.all([
    getCollection('projects'),
    getCollection('writing'),
  ]);

  const paths: { params: { slug: string }; props: OgProps }[] = [
    { params: { slug: 'home' }, props: { title: 'Bruno Seilliebert', subtitle: 'Software engineer' } },
    { params: { slug: 'fr/home' }, props: { title: 'Bruno Seilliebert', subtitle: 'Ingénieur logiciel' } },
    { params: { slug: 'legal' }, props: { title: 'Legal notice', subtitle: 'Bruno Seilliebert' } },
    { params: { slug: 'fr/legal' }, props: { title: 'Mentions légales', subtitle: 'Bruno Seilliebert' } },
    // Single static 404.html served for every unknown path, so a single OG image.
    { params: { slug: '404' }, props: { title: '404', subtitle: 'Page not found' } },
  ];

  for (const p of projects) {
    paths.push({
      params: { slug: ogSlugFor('work', p) },
      props: { title: p.data.title, subtitle: formatKind(p.data.kind, p.data.locale) },
    });
  }

  for (const w of writing) {
    paths.push({
      params: { slug: ogSlugFor('writing', w) },
      props: { title: w.data.title, subtitle: w.data.tags.join(' / ') },
    });
  }

  return paths;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Node = { type: string; props: { style?: Record<string, unknown>; children?: any } };

const el = (
  type: string,
  style: Record<string, unknown> | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any,
): Node => ({ type, props: { style, children } });

export const GET: APIRoute<OgProps> = async ({ props }) => {
  const { title, subtitle } = props;
  const fonts = await fontsP;

  const tree = el(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      height: '100%',
      background: '#09090b',
      padding: '80px 96px',
      fontFamily: 'Geist',
    },
    [
      el(
        'div',
        { display: 'flex', alignItems: 'center', fontSize: 32, color: '#fafafa', fontWeight: 500, letterSpacing: '-0.03em' },
        [
          el('span', { color: '#fafafa' }, 'bruno'),
          el('span', {
            display: 'flex',
            width: 10,
            height: 10,
            background: '#1f9dff',
            borderRadius: 999,
            marginLeft: 6,
          }),
        ],
      ),
      el(
        'div',
        { display: 'flex', flexDirection: 'column', gap: 24, maxWidth: '90%' },
        [
          el(
            'div',
            {
              display: 'flex',
              fontSize: 80,
              color: '#fafafa',
              fontWeight: 500,
              letterSpacing: '-0.035em',
              lineHeight: 1.05,
            },
            title,
          ),
          el(
            'div',
            {
              display: 'flex',
              fontSize: 22,
              color: '#a1a1aa',
              fontFamily: 'Geist Mono',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            },
            subtitle,
          ),
        ],
      ),
      el(
        'div',
        { display: 'flex', justifyContent: 'flex-end', fontSize: 20, color: '#71717a', fontFamily: 'Geist Mono', letterSpacing: '0.05em' },
        'bruno.seilliebert.dev',
      ),
    ],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svg = await satori(tree as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Geist', data: fonts.regular, weight: 400, style: 'normal' },
      { name: 'Geist', data: fonts.medium, weight: 500, style: 'normal' },
      { name: 'Geist Mono', data: fonts.mono, weight: 400, style: 'normal' },
    ],
  });

  const png = new Resvg(svg).render().asPng();

  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
