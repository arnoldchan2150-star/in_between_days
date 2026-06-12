import { useState, useRef } from "react";
import AdminLayout from "./AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Upload, Trash2, CheckCircle, Circle, PlusCircle, GripVertical } from "lucide-react";

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export default function AdminBooklets() {
  const utils = trpc.useUtils();
  const { data: booklets, isLoading } = trpc.booklets.all.useQuery();
  const { data: subscribers } = trpc.booklets.subscribers.useQuery();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileKey, setFileKey] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = trpc.upload.uploadFile.useMutation({
    onSuccess: (data) => {
      setFileUrl(data.url);
      setFileKey(data.key);
      toast.success("PDF 已上傳");
      setUploading(false);
    },
    onError: (e) => {
      toast.error("上傳失敗：" + e.message);
      setUploading(false);
    },
  });

  const uploadCover = trpc.upload.uploadFile.useMutation({
    onSuccess: (data) => {
      setCoverUrl(data.url);
      toast.success("封面圖已上傳");
      setUploadingCover(false);
    },
    onError: (e) => {
      toast.error("封面上傳失敗：" + e.message);
      setUploadingCover(false);
    },
  });

  const createBooklet = trpc.booklets.create.useMutation({
    onSuccess: () => {
      utils.booklets.all.invalidate();
      toast.success("小冊子已新增");
      setShowForm(false);
      resetForm();
    },
    onError: (e) => toast.error("新增失敗：" + e.message),
  });

  const updateBooklet = trpc.booklets.update.useMutation({
    onSuccess: () => {
      utils.booklets.all.invalidate();
      toast.success("已更新");
    },
  });

  const deleteBooklet = trpc.booklets.delete.useMutation({
    onSuccess: () => {
      utils.booklets.all.invalidate();
      toast.success("已刪除");
    },
  });

  const resetForm = () => {
    setTitle(""); setSlug(""); setDescription("");
    setCoverUrl(""); setFileUrl(""); setFileKey(""); setSortOrder(0);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(val));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadFile.mutate({ base64, filename: file.name, contentType: file.type, folder: "booklets" });
    };
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadCover.mutate({ base64, filename: file.name, contentType: file.type, folder: "booklet-covers" });
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = () => {
    if (!title.trim() || !slug.trim()) {
      toast.error("請填寫標題與網址代號");
      return;
    }
    createBooklet.mutate({
      title: title.trim(),
      slug: slug.trim(),
      description: description || undefined,
      coverUrl: coverUrl || undefined,
      fileUrl,
      fileKey,
      active: true,
      sortOrder,
    });
  };

  return (
    <AdminLayout title="小冊子管理">
      <div className="max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-label">共 {booklets?.length ?? 0} 本小冊子・{subscribers?.length ?? 0} 位訂閱者</p>
          <button onClick={() => setShowForm((v) => !v)} className="btn-minimal text-xs">
            <PlusCircle size={13} />
            新增小冊子
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="border border-border p-6 mb-8 space-y-4 animate-fade-up">
            <p className="text-label mb-4">新增旅遊小冊子</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-label block mb-2">標題 *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="熊野古道"
                  className="w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40"
                />
              </div>
              <div>
                <label className="text-label block mb-2">網址代號 (slug) *</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="kumano-kodo"
                  className="w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40"
                />
              </div>
            </div>

            <div>
              <label className="text-label block mb-2">說明（選填）</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="簡短介紹這份小冊子的內容..."
                className="w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground transition-colors resize-none placeholder:text-muted-foreground/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-label block mb-2">封面圖（選填）</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={uploadingCover}
                    className="btn-minimal text-xs"
                  >
                    <Upload size={12} />
                    {uploadingCover ? "上傳中..." : "上傳封面"}
                  </button>
                  <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                  {coverUrl && <span className="text-xs text-muted-foreground">✓ 已上傳</span>}
                </div>
                <input
                  type="text"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="或貼上圖片 URL"
                  className="mt-2 w-full border-b border-border bg-transparent py-1.5 text-xs outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40"
                />
              </div>
              <div>
                <label className="text-label block mb-2">排序（數字越小越前）</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-label block mb-2">PDF 檔案（選填，可稍後上傳）</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="btn-minimal text-xs"
                >
                  <Upload size={12} />
                  {uploading ? "上傳中..." : "上傳 PDF"}
                </button>
                <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
                {fileUrl && <span className="text-xs text-muted-foreground">✓ PDF 已上傳</span>}
              </div>
              <input
                type="text"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="或直接貼上 PDF URL"
                className="mt-2 w-full border-b border-border bg-transparent py-1.5 text-xs outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={handleCreate} disabled={createBooklet.isPending} className="btn-filled text-xs">
                {createBooklet.isPending ? "新增中..." : "新增"}
              </button>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="btn-minimal text-xs">
                取消
              </button>
            </div>
          </div>
        )}

        {/* Booklets list */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-muted animate-pulse" />)}
          </div>
        ) : booklets && booklets.length > 0 ? (
          <div className="border border-border">
            {booklets.map((booklet, i) => (
              <div
                key={booklet.id}
                className={[
                  "flex items-center gap-4 px-5 py-4",
                  i < booklets.length - 1 ? "border-b border-border" : "",
                ].join(" ")}
              >
                <GripVertical size={14} className="text-muted-foreground/40 flex-shrink-0" />

                {/* Cover thumbnail */}
                {booklet.coverUrl ? (
                  <img
                    src={booklet.coverUrl}
                    alt={booklet.title}
                    className="w-12 h-14 object-cover flex-shrink-0 img-travel"
                  />
                ) : (
                  <div className="w-12 h-14 bg-muted flex-shrink-0 flex items-center justify-center">
                    <span className="text-[0.55rem] text-muted-foreground text-center leading-tight px-1">無封面</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-light">{booklet.title}</p>
                  <p className="text-[0.65rem] text-muted-foreground font-mono">/booklet/{booklet.slug}</p>
                  {booklet.description && (
                    <p className="text-[0.65rem] text-muted-foreground truncate mt-0.5">{booklet.description}</p>
                  )}
                  <p className="text-label mt-1">
                    排序 {booklet.sortOrder}・{booklet.active ? "顯示中" : "已隱藏"}・
                    {new Date(booklet.createdAt).toLocaleDateString("zh-TW")}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateBooklet.mutate({ id: booklet.id, active: !booklet.active })}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title={booklet.active ? "隱藏" : "顯示"}
                  >
                    {booklet.active ? <CheckCircle size={16} className="text-foreground" /> : <Circle size={16} />}
                  </button>
                  {booklet.fileUrl && (
                    <a
                      href={booklet.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-label hover:text-foreground transition-colors text-xs"
                    >
                      PDF
                    </a>
                  )}
                  <button
                    onClick={() => {
                      if (confirm(`確定刪除「${booklet.title}」？`)) {
                        deleteBooklet.mutate({ id: booklet.id });
                      }
                    }}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border">
            <p className="font-serif text-lg font-light text-muted-foreground mb-4">尚無小冊子</p>
            <button onClick={() => setShowForm(true)} className="btn-minimal text-xs">
              <PlusCircle size={13} />
              新增第一本小冊子
            </button>
          </div>
        )}

        {/* Subscribers */}
        {subscribers && subscribers.length > 0 && (
          <div className="mt-12">
            <p className="text-label mb-4">最近訂閱者</p>
            <div className="border border-border">
              {subscribers.slice(0, 10).map((sub, i) => (
                <div
                  key={sub.id}
                  className={[
                    "flex items-center justify-between px-5 py-3 gap-4",
                    i < Math.min(subscribers.length, 10) - 1 ? "border-b border-border" : "",
                  ].join(" ")}
                >
                  <div>
                    <p className="text-sm font-light">{sub.name}</p>
                    <p className="text-[0.65rem] text-muted-foreground">{sub.email}</p>
                  </div>
                  <p className="text-label">{sub.sentAt ? "✓ 已寄送" : "未寄送"}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
