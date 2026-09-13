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
    cv: z.boolean().optional().default(false),
    cvDesc: z.string().optional(),
    // Path under public/ to a meshopt GLB shown in an interactive viewer after the body.
    model: z.string().optional(),
    // Path under public/ to an MP4 shown above the body; its poster is the same path with .jpg.
    video: z.string().optional(),
    // Listed on /work/archive instead of the home grid. Numbering restarts at 001 there.
    archived: z.boolean().optional().default(false),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    dek: z.string(),
    tags: z.array(z.string()),
    locale: z.enum(languages),
    date: z.coerce.date(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { projects, writing };
