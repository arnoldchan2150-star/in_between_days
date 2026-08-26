export const CULTURE_TOPICS = ["全部", "旅遊", "隨筆", "影評", "書評", "其他"] as const;

export type CultureTopic = (typeof CULTURE_TOPICS)[number];

type SearchablePost = {
  title: string;
  excerpt: string | null;
  category: string;
  content: string;
};

export function getCultureTopic(title: string): Exclude<CultureTopic, "全部"> {
  const normalizedTitle = title.trim();
  if (normalizedTitle.startsWith("旅遊")) return "旅遊";
  if (normalizedTitle.startsWith("隨筆")) return "隨筆";
  if (normalizedTitle.startsWith("影評")) return "影評";
  if (normalizedTitle.startsWith("書評")) return "書評";
  return "其他";
}

export function matchesPostSearch(post: SearchablePost, query: string): boolean {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return true;

  return [post.title, post.excerpt, post.category, post.content]
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
}
