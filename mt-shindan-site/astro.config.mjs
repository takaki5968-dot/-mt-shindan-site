// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Every image in the markdown content sits below the fold, but all of them
 * were being fetched the moment a page opened. This walks the rendered tree
 * and marks them lazy, leaving alone anything that already declares its own
 * loading behaviour (the hero portrait sets loading="eager").
 */
function rehypeLazyImages() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'img') {
        node.properties = node.properties || {};
        if (!node.properties.loading) {
          node.properties.loading = 'lazy';
          node.properties.decoding = 'async';
        }
      }
      if (Array.isArray(node.children)) {
        for (const child of node.children) visit(child);
      }
    };
    visit(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://mt-shindan.com',
  markdown: {
    rehypePlugins: [rehypeLazyImages],
  },
});
