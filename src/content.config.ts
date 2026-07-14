import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    github: z.string().optional(),
    demo: z.string().optional(),
    featured: z.boolean().default(false),
    status: z.enum(['active', 'wip', 'archived']).default('active'),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
  }),
});

const activities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/activities' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    type: z.enum(['community', 'event', 'oss', 'hackathon', 'other']),
    organization: z.string().optional(),
    role: z.string().optional(),
    image: z.string().optional(),
    links: z
      .array(z.object({ label: z.string(), url: z.string() }))
      .optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog, projects, activities };
