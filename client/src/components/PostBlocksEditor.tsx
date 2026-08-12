import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Image as ImageIcon, MessageSquareQuote, Minus, Plus, Save, Trash2, Type, Video } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type BlockType = "paragraph" | "image" | "heading" | "quote" | "video";

export type EditablePostBlock = {
  id?: number;
  blockType: BlockType;
  content: string;
  caption: string;
  sortOrder: number;
};

type MediaOption = {
  id: number;
  url: string;
  mediaType?: "image" | "video";
  caption?: string | null;
};

type Props = {
  postId: number;
  initialBlocks?: EditablePostBlock[];
  mediaItems?: MediaOption[];
};

const BLOCK_LABELS: Record<BlockType, string> = {
  paragraph: "段落",
  image: "圖片",
  heading: "小標題",
  quote: "引言",
  video: "影片",
};

const createBlock = (blockType: BlockType): EditablePostBlock => ({
  blockType,
  content: "",
  caption: "",
  sortOrder: 0,
});

export default function PostBlocksEditor({ postId, initialBlocks = [], mediaItems = [] }: Props) {
  const [blocks, setBlocks] = useState<EditablePostBlock[]>([]);
  const saveBlocksMutation = trpc.posts.saveBlocks.useMutation();

  useEffect(() => {
    setBlocks(
      [...initialBlocks]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((block, index) => ({ ...block, sortOrder: index }))
    );
  }, [initialBlocks]);

  const addBlock = (blockType: BlockType) => {
    setBlocks((current) => [...current, { ...createBlock(blockType), sortOrder: current.length }]);
  };

  const updateBlock = (index: number, patch: Partial<EditablePostBlock>) => {
    setBlocks((current) => current.map((block, blockIndex) => (blockIndex === index ? { ...block, ...patch } : block)));
  };

  const removeBlock = (index: number) => {
    setBlocks((current) => current.filter((_, blockIndex) => blockIndex !== index).map((block, sortOrder) => ({ ...block, sortOrder })));
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    setBlocks((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((block, sortOrder) => ({ ...block, sortOrder }));
    });
  };

  const handleSave = async () => {
    try {
      await saveBlocksMutation.mutateAsync({
        postId,
        blocks: blocks.map(({ blockType, content, caption, sortOrder }) => ({
          blockType,
          content: content.trim() || null,
          caption: caption.trim() || null,
          sortOrder,
        })),
      });
      toast.success("文章版面區塊已儲存");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "區塊儲存失敗");
    }
  };

  return (
    <section className="mt-10 border-t border-border pt-8">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="font-serif text-lg font-light">文章版面區塊</h2>
          <p className="text-xs text-muted-foreground mt-1">讓文字、圖片、引言與影片交錯排列，建立更接近 Medium 的閱讀節奏。</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saveBlocksMutation.isPending}
          className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs tracking-widest disabled:opacity-50"
        >
          <Save size={13} />
          {saveBlocksMutation.isPending ? "儲存中" : "儲存版面"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {(Object.keys(BLOCK_LABELS) as BlockType[]).map((blockType) => {
          const Icon = blockType === "paragraph" ? Type : blockType === "image" ? ImageIcon : blockType === "heading" ? Type : blockType === "quote" ? MessageSquareQuote : Video;
          return (
            <button
              key={blockType}
              type="button"
              onClick={() => addBlock(blockType)}
              className="inline-flex items-center gap-1.5 border border-border px-3 py-2 text-xs text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
            >
              <Icon size={13} />
              <Plus size={11} />
              {BLOCK_LABELS[blockType]}
            </button>
          );
        })}
      </div>

      {blocks.length === 0 ? (
        <div className="border border-dashed border-border px-5 py-8 text-center text-xs text-muted-foreground">
          尚未建立文章區塊。您可以從上方加入段落、圖片或引言；若保持空白，前台會使用原有文章內容與相簿呈現。
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <article key={`${block.id ?? "new"}-${index}`} className="border border-border bg-muted/10 p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-xs tracking-widest text-muted-foreground">{String(index + 1).padStart(2, "0")} · {BLOCK_LABELS[block.blockType]}</span>
                <div className="flex items-center gap-1">
                  <button type="button" aria-label="區塊上移" onClick={() => moveBlock(index, -1)} disabled={index === 0} className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-25"><ArrowUp size={14} /></button>
                  <button type="button" aria-label="區塊下移" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1} className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-25"><ArrowDown size={14} /></button>
                  <button type="button" aria-label="刪除區塊" onClick={() => removeBlock(index)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                </div>
              </div>

              {block.blockType === "paragraph" && (
                <textarea value={block.content} onChange={(event) => updateBlock(index, { content: event.target.value })} rows={5} placeholder="輸入一段文字…" className="w-full border border-border bg-background px-3 py-2 text-sm font-serif leading-relaxed resize-y focus:outline-none focus:border-foreground" />
              )}

              {block.blockType === "heading" && (
                <input value={block.content} onChange={(event) => updateBlock(index, { content: event.target.value })} placeholder="輸入小標題…" className="w-full border border-border bg-background px-3 py-2 text-base font-serif focus:outline-none focus:border-foreground" />
              )}

              {block.blockType === "quote" && (
                <textarea value={block.content} onChange={(event) => updateBlock(index, { content: event.target.value })} rows={3} placeholder="輸入引言或旅途中記下的一句話…" className="w-full border-l-2 border-foreground bg-background px-3 py-2 text-sm font-serif italic leading-relaxed resize-y focus:outline-none" />
              )}

              {block.blockType === "image" && (
                <>
                  {mediaItems.filter((media) => media.mediaType !== "video").length > 0 && (
                    <select value={mediaItems.some((media) => media.url === block.content) ? block.content : ""} onChange={(event) => updateBlock(index, { content: event.target.value })} className="w-full border border-border bg-background px-3 py-2 text-sm mb-2 focus:outline-none focus:border-foreground">
                      <option value="">從已上傳媒體選擇圖片</option>
                      {mediaItems.filter((media) => media.mediaType !== "video").map((media) => <option key={media.id} value={media.url}>{media.caption || `圖片 ${media.id}`}</option>)}
                    </select>
                  )}
                  <input value={block.content} onChange={(event) => updateBlock(index, { content: event.target.value })} placeholder="或貼上圖片 URL…" className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground" />
                  <input value={block.caption} onChange={(event) => updateBlock(index, { caption: event.target.value })} placeholder="圖片說明（選填）" className="w-full border border-border bg-background px-3 py-2 text-xs mt-2 focus:outline-none focus:border-foreground" />
                </>
              )}

              {block.blockType === "video" && (
                <>
                  <input value={block.content} onChange={(event) => updateBlock(index, { content: event.target.value })} placeholder="YouTube embed URL 或自上傳影片 URL…" className="w-full border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:border-foreground" />
                  <input value={block.caption} onChange={(event) => updateBlock(index, { caption: event.target.value })} placeholder="影片說明（選填）" className="w-full border border-border bg-background px-3 py-2 text-xs mt-2 focus:outline-none focus:border-foreground" />
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
