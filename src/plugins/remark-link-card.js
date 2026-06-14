import { visit } from 'unist-util-visit';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function extractMeta(html, property, attr = 'property') {
  for (const re of [
    new RegExp(`<meta[^>]+${attr}=["']${property}["'][^>]+content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${property}["']`, 'i'),
  ]) {
    const m = html.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return '';
}

async function fetchOGP(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LinkCardBot/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    const title =
      extractMeta(html, 'og:title') ||
      html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ||
      url;
    const description =
      extractMeta(html, 'og:description') ||
      extractMeta(html, 'description', 'name');
    const image = extractMeta(html, 'og:image');
    const siteName =
      extractMeta(html, 'og:site_name') || new URL(url).hostname;

    return { title, description, image, siteName };
  } catch {
    try {
      const { hostname } = new URL(url);
      return { title: hostname, description: '', image: '', siteName: hostname };
    } catch {
      return { title: url, description: '', image: '', siteName: url };
    }
  }
}

// Detect a paragraph that contains only a single auto-linked bare URL
function extractLoneUrl(node) {
  if (node.children.length !== 1) return null;
  const child = node.children[0];
  if (child.type !== 'link') return null;
  if (child.children.length !== 1) return null;
  const text = child.children[0];
  if (text.type !== 'text') return null;
  if (text.value !== child.url) return null;
  return child.url;
}

export function remarkLinkCard() {
  return async function (tree) {
    const targets = [];

    visit(tree, 'paragraph', (node) => {
      const url = extractLoneUrl(node);
      if (url) targets.push({ node, url });
    });

    await Promise.all(
      targets.map(async ({ node, url }) => {
        const ogp = await fetchOGP(url);
        let hostname = url;
        try { hostname = new URL(url).hostname; } catch {}

        const imageHtml = ogp.image
          ? `<img class="lc-img" src="${escapeHtml(ogp.image)}" alt="" loading="lazy" />`
          : '';

        const html =
          `<a class="link-card" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">` +
          `<div class="lc-body">` +
          `<div class="lc-title">${escapeHtml(ogp.title)}</div>` +
          (ogp.description ? `<div class="lc-desc">${escapeHtml(ogp.description)}</div>` : '') +
          `<div class="lc-url">${escapeHtml(hostname)}</div>` +
          `</div>` +
          imageHtml +
          `</a>`;

        // Mutate node to html type in-place
        node.type = 'html';
        node.value = html;
        node.children = undefined;
      })
    );
  };
}
