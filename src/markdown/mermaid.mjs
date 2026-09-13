// Sätteri mdast plugin: ```mermaid fences become inline SVG at build time, rendered by
// beautiful-mermaid (no browser, no client JS). Colours are CSS variables from
// tokens.css, so the diagram follows the theme toggle like the rest of the page.
import { renderMermaidSVG } from 'beautiful-mermaid';

// The renderer sets `--bg: <value>` on the <svg> itself, so `var(--bg)` there would be a
// self-reference (invalid at computed-value time, every derived colour breaks). The
// `--d-*` names are defined on .detail__diagram in detail.css from the site tokens.
const OPTIONS = {
  bg: 'var(--d-bg)',
  fg: 'var(--d-fg)',
  line: 'var(--d-line)',
  border: 'var(--d-line)',
  surface: 'var(--d-surface)',
  muted: 'var(--d-muted)',
  accent: 'var(--d-muted)',
  transparent: true,
  font: 'var(--font-sans)',
  padding: 8,
};

// A plain object: `defineMdastPlugin` from satteri is only a typing helper, and satteri is
// not a direct dependency of this project.
export function mermaid() {
  return {
    name: 'mermaid',
    code(node, ctx) {
      if (node.lang !== 'mermaid') return;
      let svg;
      try {
        svg = renderMermaidSVG(node.value, OPTIONS);
      } catch (err) {
        ctx.report({ message: `mermaid: ${err instanceof Error ? err.message : String(err)}`, node, severity: 'error' });
        return;
      }
      // The renderer hardcodes a Google Fonts import for Inter; the site ships its own font.
      svg = svg.replace(/@import\s+url\([^)]*\)\s*;?/g, '');
      // Fixed pixel size becomes an upper bound; the stylesheet scales it down on narrow screens.
      svg = svg.replace(/^(<svg[^>]*?) width="([\d.]+)" height="[\d.]+"([^>]*?) style="/, (_, open, w, rest) => `${open}${rest} style="max-width:${Math.ceil(w)}px;`);
      return { raw: `<figure class="detail__diagram">${svg}</figure>`, mdxExpressions: false };
    },
  };
}
