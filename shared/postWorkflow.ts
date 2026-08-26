export type PostPublishMode = "draft" | "scheduled" | "published";

export function getPostPublishMode(
  published: boolean,
  publishedAt?: Date | string | null,
  now = Date.now()
): PostPublishMode {
  if (!published) return "draft";
  if (publishedAt) {
    const timestamp = new Date(publishedAt).getTime();
    if (!Number.isNaN(timestamp) && timestamp > now) return "scheduled";
  }
  return "published";
}

export function parseTagInput(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  ).slice(0, 20);
}
