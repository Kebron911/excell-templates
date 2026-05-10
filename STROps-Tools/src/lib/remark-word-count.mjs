import { toString } from 'mdast-util-to-string';

/**
 * Adds wordCount to MDX frontmatter at build time. Consumed by the blog
 * post page to populate BlogPosting JSON-LD (EEAT/Article completeness signal).
 */
export function remarkWordCount() {
  return (tree, file) => {
    const text = toString(tree);
    const words = text.split(/\s+/).filter(Boolean).length;
    file.data.astro = file.data.astro ?? {};
    file.data.astro.frontmatter = file.data.astro.frontmatter ?? {};
    file.data.astro.frontmatter.wordCount = words;
  };
}
