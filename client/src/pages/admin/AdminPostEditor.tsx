import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import AdminLayout from "./AdminLayout";
import { toast } from "sonner";
import { Upload, X, ArrowLeft } from "lucide-react";

const CATEGORIES = ["南美", "中東", "亞洲", "歐洲", "中亞", "東南亞"] as const;

type Category = (typeof CATEGORIES)[number];

export default function AdminPostEditor() {
  const params = useParams<{ id: string }>();
  const postId = params.id ? parseInt(params.id) : undefined;
  const isEdit = !!postId;
  const [, navigate] = useLocation();

  const { data: existingPost } = trpc.posts.byId.useQuery(
    { id: postId! },
    { enabled: isEdit }
  );

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "亞洲" as Category,
    type: "travel" as "travel" | "culture",
    published: false,
    coverImageUrl: "",
    coverImageKey: "",
  });
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

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
      });
      if (existingPost.coverImageUrl) setCoverPreview(existingPost.coverImageUrl);
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

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const dataBase64 = await fileToBase64(file);
      const result = await uploadCoverMutation.mutateAsync({
        filename: file.name,
        contentType: file.type,
        dataBase64,
      });
      setForm((f) => ({ ...f, coverImageUrl: result.url, coverImageKey: result.key }));
      setCoverPreview(result.url);
      toast.success("封面圖片上傳成功");
    } catch {
      toast.error("圖片上傳失敗");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.category) return;
    if (isEdit && postId) {
      updateMutation.mutate({ id: postId, ...form });
    } else {
      createMutation.mutate(form);
    }
  };

  const autoSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u4e00-\u9fff-]/g, "")
      .slice(0, 80);

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
                    type: e.target.value as "travel" | "culture",
                  }))
                }
                className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
              >
                <option value="travel">遊記</option>
                <option value="culture">文化（電影/書籍）</option>
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
          <div>
            <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">
              封面圖片
            </label>
            {coverPreview ? (
              <div className="relative aspect-video w-full max-w-md overflow-hidden bg-muted">
                <img
                  src={coverPreview}
                  alt="封面預覽"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCoverPreview("");
                    setForm((f) => ({ ...f, coverImageUrl: "", coverImageKey: "" }));
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 hover:bg-black/70 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                className="flex items-center gap-2 border border-dashed border-border px-6 py-4 text-xs text-muted-foreground hover:border-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                <Upload size={14} />
                {uploadingCover ? "上傳中..." : "上傳封面圖片"}
              </button>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
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
