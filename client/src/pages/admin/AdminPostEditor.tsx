import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import AdminLayout from "./AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Upload, Eye, Save, ArrowLeft } from "lucide-react";

const CATEGORIES = ["南美", "中東", "亞洲", "歐洲", "中亞", "東南亞"] as const;
const TYPES = [
  { value: "travel", label: "旅遊遊記" },
  { value: "culture", label: "電影 × 書籍" },
] as const;

interface AdminPostEditorProps {
  params?: { id?: string };
}

export default function AdminPostEditor({ params }: AdminPostEditorProps) {
  const isNew = !params?.id || params.id === "new";
  const postId = isNew ? null : parseInt(params!.id!);
  const [, navigate] = useLocation();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("亞洲");
  const [type, setType] = useState<"travel" | "culture">("travel");
  const [published, setPublished] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImageKey, setCoverImageKey] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing post
  const { data: existingData } = trpc.posts.adminBySlug.useQuery(
    { slug: slug || "__" },
    { enabled: false }
  );

  // For edit mode, fetch by id via admin list
  const { data: allPosts } = trpc.posts.adminList.useQuery(undefined, {
    enabled: !isNew,
  });

  const existingPost = allPosts?.find((p) => p.id === postId);

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setSlug(existingPost.slug);
      setExcerpt(existingPost.excerpt ?? "");
      setContent(existingPost.content);
      setCategory(existingPost.category);
      setType(existingPost.type);
      setPublished(existingPost.published);
      setCoverImageUrl(existingPost.coverImageUrl ?? "");
      setCoverImageKey(existingPost.coverImageKey ?? "");
    }
  }, [existingPost]);

  // Auto-generate slug from title
  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (isNew) {
      const auto = v
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\u4e00-\u9fff-]/g, "")
        .slice(0, 80);
      setSlug(auto);
    }
  };

  const utils = trpc.useUtils();

  const createPost = trpc.posts.create.useMutation({
    onSuccess: () => {
      utils.posts.adminList.invalidate();
      toast.success("遊記已建立");
      navigate("/admin/posts");
    },
    onError: (e) => toast.error("建立失敗：" + e.message),
  });

  const updatePost = trpc.posts.update.useMutation({
    onSuccess: () => {
      utils.posts.adminList.invalidate();
      toast.success("遊記已更新");
    },
    onError: (e) => toast.error("更新失敗：" + e.message),
  });

  const uploadFile = trpc.upload.uploadFile.useMutation({
    onSuccess: (data) => {
      setCoverImageUrl(data.url);
      setCoverImageKey(data.key);
      toast.success("封面圖片已上傳");
      setUploading(false);
    },
    onError: (e) => {
      toast.error("上傳失敗：" + e.message);
      setUploading(false);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadFile.mutate({
        base64,
        filename: file.name,
        contentType: file.type,
        folder: "covers",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (publish?: boolean) => {
    if (!title.trim() || !slug.trim() || !content.trim()) {
      toast.error("請填寫標題、網址代稱與內文");
      return;
    }
    const data = {
      title,
      slug,
      excerpt: excerpt || undefined,
      content,
      category,
      type,
      published: publish ?? published,
      coverImageUrl: coverImageUrl || undefined,
      coverImageKey: coverImageKey || undefined,
    };

    if (isNew) {
      createPost.mutate(data);
    } else {
      updatePost.mutate({ id: postId!, ...data });
    }
  };

  const isPending = createPost.isPending || updatePost.isPending;

  return (
    <AdminLayout title={isNew ? "新增遊記" : "編輯遊記"}>
      <div className="max-w-3xl">
        {/* Back */}
        <button
          onClick={() => navigate("/admin/posts")}
          className="text-label hover:text-foreground transition-colors flex items-center gap-2 mb-8"
        >
          <ArrowLeft size={12} />
          返回列表
        </button>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-label block mb-2">標題 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="遊記標題"
              className="w-full border-b border-border bg-transparent py-3 text-lg font-serif font-light outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="text-label block mb-2">網址代稱 (slug) *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-slug"
              className="w-full border-b border-border bg-transparent py-2 text-sm font-mono outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40"
            />
            <p className="text-[0.65rem] text-muted-foreground/60 mt-1">
              /journal/{slug || "url-slug"}
            </p>
          </div>

          {/* Category & Type */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-label block mb-2">目的地分類</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                className="w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-label block mb-2">文章類型</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "travel" | "culture")}
                className="w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground transition-colors"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="text-label block mb-2">摘要（選填）</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="一段簡短的旅行故事摘要..."
              rows={2}
              className="w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground transition-colors resize-none placeholder:text-muted-foreground/40"
            />
          </div>

          {/* Cover image */}
          <div>
            <label className="text-label block mb-2">封面圖片</label>
            <div className="flex items-start gap-4">
              {coverImageUrl && (
                <img
                  src={coverImageUrl}
                  alt="封面"
                  className="w-32 aspect-[4/3] object-cover img-travel"
                />
              )}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="btn-minimal text-xs"
                >
                  <Upload size={12} />
                  {uploading ? "上傳中..." : "上傳圖片"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <input
                  type="text"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="或直接貼上圖片 URL"
                  className="border-b border-border bg-transparent py-1.5 text-xs outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40 w-64"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="text-label block mb-2">內文（支援 Markdown）*</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`# 旅行的開始\n\n在某個清晨，我踏上了這段旅程...\n\n## 第一天\n\n...`}
              rows={20}
              className="w-full border border-border bg-transparent p-4 text-sm font-mono outline-none focus:border-foreground transition-colors resize-y placeholder:text-muted-foreground/30 leading-relaxed"
            />
            <p className="text-[0.65rem] text-muted-foreground/60 mt-1">
              支援 Markdown 格式：# 標題、**粗體**、*斜體*、&gt; 引言、![圖片](url)
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
            <button
              onClick={() => handleSave(false)}
              disabled={isPending}
              className="btn-minimal text-xs"
            >
              <Save size={13} />
              {isPending ? "儲存中..." : "儲存草稿"}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={isPending}
              className="btn-filled text-xs"
            >
              <Eye size={13} />
              {published ? "更新並發布" : "發布遊記"}
            </button>
            {!isNew && existingPost?.slug && (
              <a
                href={`/journal/${existingPost.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-label hover:text-foreground transition-colors ml-auto"
              >
                預覽 →
              </a>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
