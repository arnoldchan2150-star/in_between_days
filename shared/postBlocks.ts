export type PostBlockType = "paragraph" | "image" | "heading" | "quote" | "video";

export type PostBlockDraft = {
  blockType: PostBlockType;
  content?: string | null;
  caption?: string | null;
  sortOrder: number;
};

export function normalizePostBlocks<T extends PostBlockDraft>(blocks: readonly T[]) {
  return [...blocks]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((block, index) => ({
      ...block,
      content: block.content ?? "",
      caption: block.caption ?? "",
      sortOrder: index,
    }));
}

export function serializePostBlocks(blocks: readonly PostBlockDraft[]) {
  return blocks.map(({ blockType, content, caption, sortOrder }) => ({
    blockType,
    content: (content ?? "").trim() || null,
    caption: (caption ?? "").trim() || null,
    sortOrder,
  }));
}
