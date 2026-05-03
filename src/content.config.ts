import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
import { languages } from './i18n/ui';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    num: z.string(),
    locale: z.enum(languages),
    kind: z.string(),
    stack: z.array(z.string()),
    desc: z.string(),
    order: z.number(),
    repo: z.url().optional(),
    live: z.url().optional(),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    dek: z.string(),
    tag: z.string(),
    locale: z.enum(languages),
    date: z.coerce.date(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { projects, writing };
