// Adds width/height to every <img> in the built pages that points at a file
// in public/. Without them the browser can't reserve space before an image
// loads, so the text below jumps as each picture arrives (layout shift, one
// of Google's Core Web Vitals). The global `img { height: auto }` rule keeps
// images responsive; the attributes only supply the aspect ratio.
//
// Runs after the build so it covers Markdown, raw HTML inside Markdown and
// .astro templates alike. Tags that already carry width or height are left
// alone.
//
// Sizes are read with Astro's own pure-JS image probe rather than sharp:
// sharp is an optional native dev dependency that the Cloudflare build
// doesn't reliably install, and a missing import fails the whole build.
import { readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { imageMetadata } from "astro/assets/utils";

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (entry.name.endsWith(".html")) out.push(p);
  }
  return out;
}

export default function imageSize() {
  let publicDir;
  return {
    name: "image-size",
    hooks: {
      "astro:config:done": ({ config }) => {
        publicDir = fileURLToPath(config.publicDir);
      },
      "astro:build:done": async ({ dir, logger }) => {
        const cache = new Map();
        const sizeOf = (src) => {
          if (!src.startsWith("/") || src.startsWith("//")) return null;
          let file;
          try {
            file = join(publicDir, decodeURIComponent(src.split(/[?#]/)[0]));
          } catch {
            return null;
          }
          if (!cache.has(file)) {
            cache.set(
              file,
              existsSync(file)
                ? readFile(file).then((buf) => imageMetadata(buf, src)).catch(() => null)
                : Promise.resolve(null),
            );
          }
          return cache.get(file);
        };

        let patched = 0;
        for (const file of await htmlFiles(fileURLToPath(dir))) {
          const html = await readFile(file, "utf8");
          const tags = [...new Set(html.match(/<img\b[^>]*>/gi) ?? [])];
          let out = html;
          for (const tag of tags) {
            if (/\s(width|height)\s*=/i.test(tag)) continue;
            const src = tag.match(/\ssrc\s*=\s*"([^"]+)"/i)?.[1];
            const meta = src && (await sizeOf(src));
            if (!meta?.width || !meta?.height) continue;
            out = out.split(tag).join(
              tag.replace(/^<img\b/i, `<img width="${meta.width}" height="${meta.height}"`),
            );
            patched++;
          }
          if (out !== html) await writeFile(file, out);
        }
        logger.info(`added width/height to ${patched} image tag(s)`);
      },
    },
  };
}
