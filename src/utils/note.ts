export type NoteArticle = {
  href: string;
  title: string;
  description: string;
  pubDate: Date;
  tags: string[];
};

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractCdata(raw: string): string {
  const m = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return m ? m[1] : raw;
}

export async function fetchNoteArticles(username: string): Promise<NoteArticle[]> {
  try {
    const res = await fetch(`https://note.com/${username}/rss`, {
      headers: { 'User-Agent': 'hokke414.com/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const itemPattern = /<item>([\s\S]*?)<\/item>/g;
    const articles: NoteArticle[] = [];

    for (const match of xml.matchAll(itemPattern)) {
      const item = match[1];

      const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
      const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
      const pubDateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      const descMatch = item.match(/<description>([\s\S]*?)<\/description>/);

      if (!titleMatch || !linkMatch || !pubDateMatch) continue;

      const title = stripHtml(extractCdata(titleMatch[1]));
      const href = linkMatch[1].trim();
      const pubDate = new Date(pubDateMatch[1].trim());
      const rawDesc = descMatch ? extractCdata(descMatch[1]) : '';
      const fullText = stripHtml(rawDesc);
      // 本文の最初の文（続きをみる リンクは除外）
      const description = fullText
        .replace(/続きをみる$/, '')
        .trim()
        .slice(0, 120) || 'note に公開した記事';

      articles.push({ href, title, description, pubDate, tags: ['note'] });
    }

    return articles;
  } catch {
    return [];
  }
}
