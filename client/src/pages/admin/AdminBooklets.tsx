import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import AdminLayout from "./AdminLayout";
import { toast } from "sonner";
import { Plus, Trash2, Upload, BookOpen, Eye, EyeOff } from "lucide-react";

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

export default function AdminBooklets() {
  const { data: booklets, isLoading, refetch } = trpc.booklets.adminList.useQuery();
  const utils = trpc.useUtils();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    fileUrl: "",
    fileKey: "",
    coverUrl: "",
    active: true,
    sortOrder: 0,
  });
  const [uploading, setUploading] = useState<"pdf" | "cover" | null>(null);
  const pdfRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.booklets.uploadFile.useMutation();
  const createMutation = trpc.booklets.create.useMutation({
    onSuccess: () => {
      toast.success("小冊子已建立");
      setShowForm(false);
      setForm({ title: "", slug: "", description: "", fileUrl: "", fileKey: "", coverUrl: "", active: true, sortOrder: 0 });
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });
  const deleteMutation = trpc.booklets.delete.useMutation({
    onSuccess: () => {
      toast.success("小冊子已刪除");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });
  const updateMutation = trpc.booklets.update.useMutation({
    onSuccess: () => {
      toast.success("更新成功");
      utils.booklets.adminList.invalidate();
    },
  });

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "pdf" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(type);
    try {
      const dataBase64 = await fileToBase64(file);
      const result = await uploadMutation.mutateAsync({
        filename: file.name,
        contentType: file.type,
        dataBase64,
        type,
      });
      if (type === "pdf") {
        setForm((f) => ({ ...f, fileUrl: result.url, fileKey: result.key }));
        toast.success("PDF 上傳成功");
      } else {
        setForm((f) => ({ ...f, coverUrl: result.url }));
        toast.success("封面上傳成功");
      }
    } catch {
      toast.error("上傳失敗");
    } finally {
      setUploading(null);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.fileUrl) {
      toast.error("請填寫標題、Slug 並上傳 PDF");
      return;
    }
    createMutation.mutate(form);
  };

  return (
    <AdminLayout title="小冊子管理">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-muted-foreground">共 {booklets?.length ?? 0} 本小冊子</p>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs tracking-wider hover:bg-foreground/80 transition-colors"
          >
            <Plus size={12} /> 新增小冊子
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="border border-border p-6 mb-8 bg-secondary/10">
            <h3 className="font-serif text-base font-light mb-5">新增小冊子</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">標題 *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    required
                    className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                    placeholder="熊野古道旅遊指南"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">Slug *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    required
                    className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground font-mono"
                    placeholder="kumano-kodo"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">描述</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground resize-none"
                  placeholder="小冊子簡介"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">PDF 檔案 *</label>
                  {form.fileUrl ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <BookOpen size={12} />
                      <span className="truncate">已上傳</span>
                      <button type="button" onClick={() => setForm((f) => ({ ...f, fileUrl: "", fileKey: "" }))} className="text-destructive hover:underline">移除</button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => pdfRef.current?.click()}
                      disabled={uploading === "pdf"}
                      className="flex items-center gap-2 border border-dashed border-border px-4 py-2 text-xs text-muted-foreground hover:border-foreground transition-colors disabled:opacity-50"
                    >
                      <Upload size={12} />
                      {uploading === "pdf" ? "上傳中..." : "上傳 PDF"}
                    </button>
                  )}
                  <input ref={pdfRef} type="file" accept=".pdf" onChange={(e) => handleUpload(e, "pdf")} className="hidden" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">封面圖片</label>
                  {form.coverUrl ? (
                    <div className="flex items-center gap-2">
                      <img src={form.coverUrl} alt="封面" className="w-12 h-16 object-cover" />
                      <button type="button" onClick={() => setForm((f) => ({ ...f, coverUrl: "" }))} className="text-xs text-destructive hover:underline">移除</button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => coverRef.current?.click()}
                      disabled={uploading === "cover"}
                      className="flex items-center gap-2 border border-dashed border-border px-4 py-2 text-xs text-muted-foreground hover:border-foreground transition-colors disabled:opacity-50"
                    >
                      <Upload size={12} />
                      {uploading === "cover" ? "上傳中..." : "上傳封面"}
                    </button>
                  )}
                  <input ref={coverRef} type="file" accept="image/*" onChange={(e) => handleUpload(e, "cover")} className="hidden" />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-foreground text-background px-5 py-2 text-xs tracking-widest hover:bg-foreground/80 transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending ? "建立中..." : "建立小冊子"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-border px-5 py-2 text-xs tracking-widest hover:border-foreground transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-secondary/30 animate-pulse" />
            ))}
          </div>
        ) : booklets && booklets.length > 0 ? (
          <div className="space-y-3">
            {booklets.map((b) => (
              <div key={b.id} className="flex items-center gap-4 border border-border p-4">
                {b.coverUrl ? (
                  <img src={b.coverUrl} alt={b.title} className="w-12 h-16 object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-16 bg-secondary flex items-center justify-center flex-shrink-0">
                    <BookOpen size={16} className="text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm" style={{color: '#2e37bd'}}>{b.title}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{b.slug}</p>
                  {b.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{b.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateMutation.mutate({ id: b.id, active: !b.active })}
                    className={`text-xs px-2 py-0.5 ${b.active ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {b.active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`確定刪除「${b.title}」？`)) deleteMutation.mutate({ id: b.id });
                    }}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border">
            <p className="text-sm text-muted-foreground">尚無小冊子</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
