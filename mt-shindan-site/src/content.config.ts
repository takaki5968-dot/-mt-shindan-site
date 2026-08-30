import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.string(),
    categories: z.array(z.string()).optional(),
    description: z.string().optional(),
    seoTitle: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.string().optional(),
    description: z.string().optional(),
    seoTitle: z.string().optional(),
    eyebrow: z.string().optional(),
  }),
});

export const collections = { blog, pages };
