import { getCollection } from 'astro:content';

export async function getPublishedPosts() {
  return (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}

export async function getFeaturedProjects() {
  return (await getCollection('projects', ({ data }) => data.featured)).sort(
    (a, b) => b.data.startDate.getTime() - a.data.startDate.getTime(),
  );
}

export async function getAllProjects() {
  return (await getCollection('projects')).sort(
    (a, b) => b.data.startDate.getTime() - a.data.startDate.getTime(),
  );
}

export async function getAllActivities() {
  return (await getCollection('activities')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function allTags(items: { data: { tags: string[] } }[]): string[] {
  return [...new Set(items.flatMap((i) => i.data.tags))].sort((a, b) =>
    a.localeCompare(b, 'ja'),
  );
}
