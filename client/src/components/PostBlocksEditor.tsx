import { useEffect, useState, useRef } from "react";
import { ArrowDown, ArrowUp, Image as ImageIcon, MessageSquareQuote, Plus, Save, Trash2, Type, Video, Upload, Loader2, X } from "lucide-react";
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
  const [uploadingBlockIndex, setUploadingBlockIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const saveBlocksMutation = trpc.posts.saveBlocks.useMutation();
  const uploadMediaMutation = trpc.posts.uploadMedia.useMutation();

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

  const handleImageFile = async (index: number, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("請選擇圖片檔案（JPG、PNG、WEBP、GIF）");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("圖片大小不能超過 10MB");
      return;
    }

    setUploadingBlockIndex(index);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1] ?? "");
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await uploadMediaMutation.mutateAsync({
        postId,
        filename: file.name,
        contentType: file.type,
        dataBase64: base64,
        mediaType: "image",
        sortOrder: index,
        caption: blocks[index]?.caption || "",
      });

      updateBlock(index, { content: res.url });
      toast.success("圖片上傳成功並已填入區塊");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "圖片上傳失敗");
    } finally {
      setUploadingBlockIndex(null);
    }
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
          <p className="text-xs text-muted-foreground mt-1">讓文字、圖片、引言與影片交錯排列，建立更接近 Medium 的閱讀節奏。圖片區塊支援直接拖放或點擊上傳。</p>
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
        <div className="space-y-4">
          {blocks.map((block, index) => {
            const isUploading = uploadingBlockIndex === index;
            return (
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
                  <div className="space-y-3">
                    <div
                      onClick={() => !isUploading && fileInputRefs.current[index]?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleImageFile(index, file);
                      }}
                      className={`relative border-2 border-dashed border-border bg-background/50 hover:border-foreground/50 transition-colors cursor-pointer p-4 text-center min-h-[140px] flex flex-col items-center justify-center ${isUploading ? "cursor-wait" : ""}`}
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2 py-4 text-muted-foreground">
                          <Loader2 size={24} className="animate-spin" />
                          <span className="text-xs">上傳圖片中...</span>
                        </div>
                      ) : block.content ? (
                        <div className="relative w-full">
                          <img src={block.content} alt={block.caption || "區塊圖片"} className="max-h-48 mx-auto object-cover rounded-sm" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-1">
                            <Upload size={13} /> 點擊或拖放以更換圖片
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateBlock(index, { content: "" });
                            }}
                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                            title="清除圖片"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground py-2">
                          <Upload size={22} />
                          <p className="text-xs">點擊或拖放圖片至此直接上傳</p>
                          <p className="text-[10px] text-muted-foreground/60">支援 JPG、PNG、WEBP，最大 10MB</p>
                        </div>
                      )}
                    </div>

                    <input
                      ref={(el) => {
                        fileInputRefs.current[index] = el;
                      }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFile(index, file);
                        e.target.value = "";
                      }}
                    />

                    {mediaItems.filter((media) => media.mediaType !== "video").length > 0 && (
                      <select value={mediaItems.some((media) => media.url === block.content) ? block.content : ""} onChange={(event) => updateBlock(index, { content: event.target.value })} className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground">
                        <option value="">或從已上傳媒體選擇圖片</option>
                        {mediaItems.filter((media) => media.mediaType !== "video").map((media) => <option key={media.id} value={media.url}>{media.caption || `圖片 ${media.id}`}</option>)}
                      </select>
                    )}
                    <input value={block.content} onChange={(event) => updateBlock(index, { content: event.target.value })} placeholder="或手動貼上圖片 URL…" className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground font-mono text-xs" />
                    <input value={block.caption} onChange={(event) => updateBlock(index, { caption: event.target.value })} placeholder="圖片說明（選填）" className="w-full border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-foreground" />
                  </div>
                )}

                {block.blockType === "video" && (
                  <>
                    <input value={block.content} onChange={(event) => updateBlock(index, { content: event.target.value })} placeholder="YouTube embed URL 或自上傳影片 URL…" className="w-full border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:border-foreground" />
                    <input value={block.caption} onChange={(event) => updateBlock(index, { caption: event.target.value })} placeholder="影片說明（選填）" className="w-full border border-border bg-background px-3 py-2 text-xs mt-2 focus:outline-none focus:border-foreground" />
                  </>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
