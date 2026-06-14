export type ZennArticle = {
  href: string;
  title: string;
  description: string;
  pubDate: Date;
  tags: string[];
};

export async function fetchZennArticles(username: string): Promise<ZennArticle[]> {
  try {
    const res = await fetch(
      `https://zenn.dev/api/articles?username=${username}&order=latest&count=20`,
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.articles ?? []).map((a: {
      title: string;
      emoji?: string;
      article_type?: string;
      published_at: string;
      path: string;
      topics?: { name: string; display_name?: string }[];
    }) => ({
      href: `https://zenn.dev${a.path}`,
      title: a.title,
      description: `${a.emoji ?? '📝'} Zenn に公開した${a.article_type === 'tech' ? '技術' : 'アイデア'}記事`,
      pubDate: new Date(a.published_at),
      tags: ['Zenn', ...(a.topics ?? []).map((t) => t.display_name ?? t.name)],
    }));
  } catch {
    return [];
  }
}
