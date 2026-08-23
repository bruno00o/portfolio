import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) =>
  new Response(
    [
      '# Content signals: https://contentsignals.org',
      '# Restrictions expressed below are express reservations of rights under',
      '# Article 4 of EU Directive 2019/790.',
      '',
      'User-Agent: *',
      'Content-Signal: search=yes, ai-input=yes, ai-train=no',
      'Allow: /',
      '',
      `Sitemap: ${new URL('/sitemap-index.xml', site!).toString()}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
