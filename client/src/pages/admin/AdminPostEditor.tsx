import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import AdminLayout from "./AdminLayout";
import { toast } from "sonner";
import { ArrowLeft, Upload, X, ImagePlus, Film } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import MediaUploader from "@/components/MediaUploader";
import PostBlocksEditor, { type EditablePostBlock } from "@/components/PostBlocksEditor";

const CATEGORIES = ["南美", "中東", "亞洲", "歐洲", "中亞", "東南亞"] as const;
type Category = (typeof CATEGORIES)[number];

type MediaItem = {
  id: number;
  url: string;
  caption?: string | null;
  sortOrder: number;
  mediaType?: "image" | "video";
};

export default function AdminPostEditor() {
  const params = useParams<{ id: string }>();
  const postId = params.id ? parseInt(params.id) : undefined;
  const isEdit = !!postId;
  const [, navigate] = useLocation();

  const { data: existingPost, refetch: refetchPost } = trpc.posts.byId.useQuery(
    { id: postId! },
    { enabled: isEdit }
  );

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "亞洲" as Category,
    type: "travel" as "travel" | "culture" | "snow",
    published: false,
    coverImageUrl: "",
    coverImageKey: "",
    embedUrl: "",
  });
  const [uploadingCover, setUploadingCover] = useState(false);

  // Media gallery state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [savingCaptions, setSavingCaptions] = useState(false);

  useEffect(() => {
    if (existingPost) {
      setForm({
        title: existingPost.title,
        slug: existingPost.slug,
        excerpt: existingPost.excerpt ?? "",
        content: existingPost.content,
        category: existingPost.category as Category,
        type: existingPost.type,
        published: existingPost.published,
        coverImageUrl: existingPost.coverImageUrl ?? "",
        coverImageKey: existingPost.coverImageKey ?? "",
        embedUrl: existingPost.embedUrl ?? "",
      });
      // Load existing media
      if (existingPost.media && Array.isArray(existingPost.media)) {
        setMediaItems(
          (existingPost.media as MediaItem[]).sort((a, b) => a.sortOrder - b.sortOrder)
        );
      }
    }
  }, [existingPost]);

  const createMutation = trpc.posts.create.useMutation({
    onSuccess: () => {
      toast.success("文章已建立");
      navigate("/admin/posts");
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.posts.update.useMutation({
    onSuccess: () => {
      toast.success("文章已更新");
      navigate("/admin/posts");
    },
    onError: (err) => toast.error(err.message),
  });

  const uploadCoverMutation = trpc.posts.uploadCover.useMutation();
  const uploadMediaMutation = trpc.posts.uploadMedia.useMutation();
  const deleteMediaMutation = trpc.posts.deleteMedia.useMutation();
  const updateMediaMutation = trpc.posts.updateMedia.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.category) return;
    const payload = {
      ...form,
      embedUrl: form.embedUrl.trim() || null,
    };
    if (isEdit && postId) {
      updateMutation.mutate({ id: postId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const autoSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u4e00-\u9fff-]/g, "")
      .slice(0, 80);

  // Handle multiple photo uploads for gallery
  const handleMediaUpload = async (files: File[] | FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    if (!postId) {
      toast.error("請先儲存文章後再上傳相簿照片");
      return;
    }
    setUploadingMedia(true);
    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        if (!file) continue;
        const mediaType = file.type.startsWith("video/") ? "video" : "image";
        if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
          toast.error(`${file.name} 不是支援的圖片或影片檔案`);
          continue;
        }
        const maxSize = mediaType === "video" ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
          toast.error(`${file.name} 超過 ${mediaType === "video" ? "100MB" : "10MB"} 限制`);
          continue;
        }
        const base64 = await fileToBase64(file);
        await uploadMediaMutation.mutateAsync({
          postId,
          filename: file.name,
          contentType: file.type,
          dataBase64: base64,
          mediaType,
          sortOrder: mediaItems.length + i,
        });
      }
      // Refresh media list
      const updated = await refetchPost();
      if (updated.data?.media) {
        const allMedia = (updated.data.media as MediaItem[]).sort(
          (a, b) => a.sortOrder - b.sortOrder
        );
        setMediaItems(allMedia);
      }
      toast.success(`已上傳 ${fileArray.length} 個媒體檔案`);
    } catch {
      toast.error("上傳失敗，請重試");
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async (id: number) => {
    try {
      await deleteMediaMutation.mutateAsync({ id });
      setMediaItems((prev) => prev.filter((m) => m.id !== id));
      toast.success("照片已刪除");
    } catch {
      toast.error("刪除失敗");
    }
  };

  const handleCaptionChange = (id: number, caption: string) => {
    setMediaItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, caption } : m))
    );
  };

  // Save all captions to DB
  const handleSaveCaptions = async () => {
    if (mediaItems.length === 0) return;
    setSavingCaptions(true);
    try {
      await Promise.all(
        mediaItems.map((m) =>
          updateMediaMutation.mutateAsync({ id: m.id, caption: m.caption ?? null })
        )
      );
      toast.success("照片說明已儲存");
    } catch {
      toast.error("儲存說明失敗");
    } finally {
      setSavingCaptions(false);
    }
  };

  const loading = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout title={isEdit ? "編輯文章" : "新增文章"}>
      <div className="max-w-3xl">
        <button
          onClick={() => navigate("/admin/posts")}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={12} /> 返回文章列表
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">
              標題 *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((f) => ({
                  ...f,
                  title,
                  slug: f.slug || autoSlug(title),
                }));
              }}
              required
              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors font-serif"
              placeholder="文章標題"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">
              Slug（網址）*
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              required
              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors font-mono"
              placeholder="url-friendly-slug"
            />
          </div>

          {/* Category + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">
                分類 *
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value as Category }))
                }
                className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">
                類型 *
              </label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    type: e.target.value as "travel" | "culture" | "snow",
                  }))
                }
                className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
              >
                <option value="travel">遊記</option>
                <option value="culture">靈感拾光（電影/書籍）</option>
                <option value="snow">雪季映像（滑雪）</option>
              </select>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">
              摘要
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              rows={2}
              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
              placeholder="文章摘要（選填）"
            />
          </div>

          {/* Cover Image */}
          <div className="max-w-md">
            <ImageUploader
              label="封面圖片"
              currentUrl={form.coverImageUrl}
              uploading={uploadingCover}
              onUpload={async (params) => {
                setUploadingCover(true);
                try {
                  return await uploadCoverMutation.mutateAsync(params);
                } finally {
                  setUploadingCover(false);
                }
              }}
              onUploaded={(url) =>
                setForm((f) => ({ ...f, coverImageUrl: url, coverImageKey: url ? f.coverImageKey : "" }))
              }
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">
              文章內容 *
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              required
              rows={20}
              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors resize-y font-serif leading-relaxed"
              placeholder="在這裡輸入文章內容..."
            />
          </div>

          {isEdit && postId && (
            <PostBlocksEditor
              postId={postId}
              initialBlocks={(existingPost?.blocks ?? []) as EditablePostBlock[]}
              mediaItems={mediaItems}
            />
          )}

          {/* Embed URL */}
          <div>
            <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">
              嵌入網址（embedUrl）
            </label>
            <input
              type="url"
              value={form.embedUrl}
              onChange={(e) => setForm((f) => ({ ...f, embedUrl: e.target.value }))}
              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors font-mono"
              placeholder="https://example.com（填入後文章將以 iframe 全螢幕嵌入方式展示）"
            />
            <p className="text-xs text-muted-foreground mt-1">
              填入後，文章頁面將改為 iframe 嵌入模式，適合嵌入外部互動網站。留空則顯示一般文章內容。
            </p>
          </div>

          {/* Published */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              className="w-4 h-4 border border-border"
            />
            <label htmlFor="published" className="text-sm text-muted-foreground cursor-pointer">
              立即發布
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-foreground text-background px-6 py-2.5 text-xs tracking-widest hover:bg-foreground/80 transition-colors disabled:opacity-50"
            >
              {loading ? "儲存中..." : isEdit ? "更新文章" : "建立文章"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/posts")}
              className="border border-border px-6 py-2.5 text-xs tracking-widest hover:border-foreground transition-colors"
            >
              取消
            </button>
          </div>
        </form>

        {/* Photo Gallery Section — only shown when editing an existing post */}
        {isEdit && postId && (
          <div className="mt-12 border-t border-border pt-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-serif text-lg font-light">文章媒體</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  上傳照片或影片，將在文章詳細頁展示
                </p>
              </div>

            </div>

            <div className="mb-4">
              <MediaUploader onFiles={handleMediaUpload} uploading={uploadingMedia} />
            </div>

            {/* Photo grid */}
            {mediaItems.length > 0 && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mediaItems.map((item, idx) => (
                    <div key={item.id} className="group relative">
                      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                        {item.mediaType === "video" ? (
                          <>
                            <video
                              src={item.url}
                              controls
                              preload="metadata"
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-black/65 text-white px-2 py-1 text-[10px]">
                              <Film size={11} /> 影片
                            </span>
                          </>
                        ) : (
                          <img
                            src={item.url}
                            alt={item.caption ?? `照片 ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteMedia(item.id)}
                        className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                        title="刪除照片"
                      >
                        <X size={12} />
                      </button>
                      {/* Caption input */}
                      <input
                        type="text"
                        value={item.caption ?? ""}
                        onChange={(e) => handleCaptionChange(item.id, e.target.value)}
                        placeholder={item.mediaType === "video" ? "影片說明（選填）" : "照片說明（選填）"}
                        className="w-full mt-1.5 border border-border bg-background px-2 py-1.5 text-xs focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                  ))}
                  {/* Add more button in grid */}

                </div>

                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-muted-foreground">
                    共 {mediaItems.length} 個媒體檔案
                  </p>
                  <button
                    type="button"
                    onClick={handleSaveCaptions}
                    disabled={savingCaptions}
                    className="text-xs border border-border px-4 py-1.5 hover:border-foreground transition-colors disabled:opacity-50"
                  >
                    {savingCaptions ? "儲存中..." : "儲存照片說明"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Hint for new posts */}
        {!isEdit && (
          <div className="mt-8 p-4 bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">
              💡 建立文章後，即可在編輯頁面上傳文章照片或影片
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
