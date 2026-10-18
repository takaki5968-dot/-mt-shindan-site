import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    categories: z.array(z.string()).optional(),
    description: z.string().optional(),
    seoTitle: z.string().optional(),
    service: z.string().optional(),
    ctaLead: z.string().optional(),
    // 記事ごとの共有用画像（1200×630）。SNS・LINEで共有したときのカードと構造化データに使う。
    image: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.string().optional(),
    updated: z.string().optional(),
    description: z.string().optional(),
    seoTitle: z.string().optional(),
    eyebrow: z.string().optional(),
  }),
});

export const collections = { blog, pages };
