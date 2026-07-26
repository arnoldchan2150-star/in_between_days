import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import AdminLayout from "./AdminLayout";
import { toast } from "sonner";
import { ArrowLeft, Upload, X, ImagePlus, Video, Film } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import VideoUploader from "@/components/VideoUploader";

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
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [savingCaptions, setSavingCaptions] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState<"photos" | "videos">("photos");
  const mediaInputRef = useRef<HTMLInputElement>(null);

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
  const uploadVideoMutation = trpc.posts.uploadVideo.useMutation();
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
  const handleMediaUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!postId) {
      toast.error("請先儲存文章後再上傳相簿照片");
      return;
    }
    setUploadingMedia(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} 不是圖片檔案`);
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} 超過 10MB 限制`);
          continue;
        }
        const base64 = await fileToBase64(file);
        await uploadMediaMutation.mutateAsync({
          postId,
          filename: file.name,
          contentType: file.type,
          dataBase64: base64,
          sortOrder: mediaItems.filter((m) => (m.mediaType ?? "image") === "image").length + i,
          mediaType: "image",
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
      toast.success(`已上傳 ${files.length} 張照片`);
    } catch {
      toast.error("上傳失敗，請重試");
    } finally {
      setUploadingMedia(false);
      if (mediaInputRef.current) mediaInputRef.current.value = "";
    }
  };

  // Handle single video upload
  const handleVideoUpload = async (params: { dataBase64: string; contentType: string; filename: string }) => {
    if (!postId) {
      toast.error("請先儲存文章後再上傳影片");
      throw new Error("No postId");
    }
    const videoItems = mediaItems.filter((m) => m.mediaType === "video");
    const result = await uploadVideoMutation.mutateAsync({
      postId,
      filename: params.filename,
      contentType: params.contentType,
      dataBase64: params.dataBase64,
      sortOrder: videoItems.length,
    });
    // Refresh media list
    const updated = await refetchPost();
    if (updated.data?.media) {
      const allMedia = (updated.data.media as MediaItem[]).sort(
        (a, b) => a.sortOrder - b.sortOrder
      );
      setMediaItems(allMedia);
    }
    return result;
  };

  const handleDeleteMedia = async (id: number) => {
    try {
      await deleteMediaMutation.mutateAsync({ id });
      setMediaItems((prev) => prev.filter((m) => m.id !== id));
      toast.success("已刪除");
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
      toast.success("說明已儲存");
    } catch {
      toast.error("儲存說明失敗");
    } finally {
      setSavingCaptions(false);
    }
  };

  const loading = createMutation.isPending || updateMutation.isPending;

  // Separate photos and videos
  const photoItems = mediaItems.filter((m) => (m.mediaType ?? "image") === "image");
  const videoItems = mediaItems.filter((m) => m.mediaType === "video");

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

        {/* Media Section — only shown when editing an existing post */}
        {isEdit && postId && (
          <div className="mt-12 border-t border-border pt-8">
            <div className="mb-6">
              <h2 className="font-serif text-lg font-light">文章媒體</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                管理文章的照片相簿與影片
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border mb-6">
              <button
                type="button"
                onClick={() => setActiveMediaTab("photos")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-widest border-b-2 transition-colors -mb-px ${
                  activeMediaTab === "photos"
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <ImagePlus size={13} />
                照片相簿
                {photoItems.length > 0 && (
                  <span className="bg-foreground/10 text-foreground text-[10px] px-1.5 py-0.5 rounded-sm">
                    {photoItems.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveMediaTab("videos")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-widest border-b-2 transition-colors -mb-px ${
                  activeMediaTab === "videos"
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Film size={13} />
                影片
                {videoItems.length > 0 && (
                  <span className="bg-foreground/10 text-foreground text-[10px] px-1.5 py-0.5 rounded-sm">
                    {videoItems.length}
                  </span>
                )}
              </button>
            </div>

            {/* ── Photos Tab ── */}
            {activeMediaTab === "photos" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-muted-foreground">
                    上傳多張照片，將在文章頁面以相簿方式展示
                  </p>
                  <button
                    type="button"
                    onClick={() => mediaInputRef.current?.click()}
                    disabled={uploadingMedia}
                    className="flex items-center gap-2 border border-border px-4 py-2 text-xs tracking-widest hover:border-foreground transition-colors disabled:opacity-50"
                  >
                    <ImagePlus size={14} />
                    {uploadingMedia ? "上傳中..." : "新增照片"}
                  </button>
                  <input
                    ref={mediaInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleMediaUpload(e.target.files)}
                  />
                </div>

                {/* Drop zone when no photos */}
                {photoItems.length === 0 && (
                  <div
                    className="border border-dashed border-border rounded p-12 text-center cursor-pointer hover:border-foreground transition-colors"
                    onClick={() => mediaInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleMediaUpload(e.dataTransfer.files);
                    }}
                  >
                    <Upload size={24} className="mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      拖放照片至此，或點擊選擇檔案
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      支援 JPG、PNG、WEBP，每張最大 10MB，可多選
                    </p>
                  </div>
                )}

                {/* Photo grid */}
                {photoItems.length > 0 && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {photoItems.map((item, idx) => (
                        <div key={item.id} className="group relative">
                          <div className="aspect-[4/3] overflow-hidden bg-muted">
                            <img
                              src={item.url}
                              alt={item.caption ?? `照片 ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
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
                            placeholder="照片說明（選填）"
                            className="w-full mt-1.5 border border-border bg-background px-2 py-1.5 text-xs focus:outline-none focus:border-foreground transition-colors"
                          />
                        </div>
                      ))}
                      {/* Add more button in grid */}
                      <div
                        className="aspect-[4/3] border border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-foreground transition-colors"
                        onClick={() => mediaInputRef.current?.click()}
                      >
                        <ImagePlus size={20} className="text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">新增更多</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-muted-foreground">
                        共 {photoItems.length} 張照片
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

            {/* ── Videos Tab ── */}
            {activeMediaTab === "videos" && (
              <div>
                <p className="text-xs text-muted-foreground mb-4">
                  上傳影片，將在文章頁面以原生播放器展示。支援 MP4、MOV、WEBM 格式，最大 200MB。
                </p>

                {/* Video upload area */}
                {videoItems.length === 0 ? (
                  <VideoUploader
                    label=""
                    uploading={uploadingVideo}
                    onUpload={async (params) => {
                      setUploadingVideo(true);
                      try {
                        return await handleVideoUpload(params);
                      } finally {
                        setUploadingVideo(false);
                      }
                    }}
                    onUploaded={() => {}}
                  />
                ) : (
                  <div className="space-y-6">
                    {videoItems.map((item, idx) => (
                      <div key={item.id} className="border border-border p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Video size={14} className="text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">影片 {idx + 1}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteMedia(item.id)}
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                          >
                            <X size={12} /> 刪除
                          </button>
                        </div>
                        <video
                          src={item.url}
                          controls
                          className="w-full aspect-video bg-black rounded-sm"
                          preload="metadata"
                        />
                        <input
                          type="text"
                          value={item.caption ?? ""}
                          onChange={(e) => handleCaptionChange(item.id, e.target.value)}
                          placeholder="影片說明（選填）"
                          className="w-full mt-2 border border-border bg-background px-2 py-1.5 text-xs focus:outline-none focus:border-foreground transition-colors"
                        />
                      </div>
                    ))}

                    {/* Add more video */}
                    <div className="border border-dashed border-border p-4">
                      <p className="text-xs text-muted-foreground mb-3">新增更多影片</p>
                      <VideoUploader
                        label=""
                        uploading={uploadingVideo}
                        onUpload={async (params) => {
                          setUploadingVideo(true);
                          try {
                            return await handleVideoUpload(params);
                          } finally {
                            setUploadingVideo(false);
                          }
                        }}
                        onUploaded={() => {}}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        共 {videoItems.length} 部影片
                      </p>
                      <button
                        type="button"
                        onClick={handleSaveCaptions}
                        disabled={savingCaptions}
                        className="text-xs border border-border px-4 py-1.5 hover:border-foreground transition-colors disabled:opacity-50"
                      >
                        {savingCaptions ? "儲存中..." : "儲存影片說明"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Hint for new posts */}
        {!isEdit && (
          <div className="mt-8 p-4 bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">
              💡 建立文章後，即可在編輯頁面上傳文章相簿照片與影片
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
