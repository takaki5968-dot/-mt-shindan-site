import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const SITE = "https://mt-shindan.com";

// Slugs in the pages collection that are rendered by their own route,
// not by src/pages/[slug].astro.
const PAGES_HANDLED_ELSEWHERE = ["home-2", "blog", "contact"];

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// lastmod は公開日ではなく最終更新日を指す。date のまま出していたため、
// 9月に全面的に作り直したセミナーページが「2026-03-01 から変更なし」と
// 申告される状態だった。frontmatter の updated があればそちらを使う。
function toLastmod(date: string | undefined): string | undefined {
  if (!date) return undefined;
  const match = date.match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : undefined;
}

export const GET: APIRoute = async () => {
  const pages = await getCollection("pages");
  const posts = await getCollection("blog");

  const entries: { path: string; lastmod?: string; priority: string }[] = [
    { path: "/", priority: "1.0" },
    { path: "/blog/", priority: "0.7" },
    { path: "/contact/", priority: "0.9" },
  ];

  for (const page of pages) {
    if (PAGES_HANDLED_ELSEWHERE.includes(page.data.slug)) continue;
    entries.push({
      path: `/${page.data.slug}/`,
      lastmod: toLastmod(page.data.updated ?? page.data.date),
      priority: page.data.slug === "privacy-policy" ? "0.2" : "0.8",
    });
  }

  for (const post of posts) {
    entries.push({
      path: `/blog/${post.data.slug}/`,
      lastmod: toLastmod(post.data.updated ?? post.data.date),
      priority: "0.6",
    });
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(({ path, lastmod, priority }) => {
    const loc = xmlEscape(SITE + encodeURI(path));
    return [
      "  <url>",
      `    <loc>${loc}</loc>`,
      lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
      `    <priority>${priority}</priority>`,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n");
  })
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
